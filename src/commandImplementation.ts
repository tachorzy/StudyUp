import { Client, EmbedBuilder, Routes, ChatInputCommandInteraction, GuildScheduledEvent, Embed, EmbedAssertions, GuildScheduledEventEntityMetadataOptions, GuildScheduledEventStatus, InteractionCollector, GuildScheduledEventUser, Collection } from "discord.js";
import mongoose from "mongoose"
import { token, clientId, REST } from './Bot';
import { insertEvent, findEvent, delEvent } from "./Database";
import { commands } from "./slashCommands";

//discord bot formality or otherwise called event handling
export default (client: Client): void => {
    const rest = new REST({ version: '10' }).setToken(token);

    rest.put(Routes.applicationCommands(clientId), { body: commands })
        .then((data: any) => console.log(`Successfully registered ${data.length} application commands.`)) //using any for all your types is redundant cuz thats literally just js
        .catch(console.error);
        
    //upon an interaction via slash command
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
    
        const { commandName } = interaction;
        var embed: EmbedBuilder | undefined;
        var message;
        switch(commandName){
            case 'addevent':
                const event = await createEvent(interaction);
                await interaction.reply({embeds: [createEventEmbed(interaction, event?.id)]});
                console.log(event)
                message = await interaction.fetchReply();
                message.react('👍');
                break;
            case 'ping':
                await announcement(interaction);
                break;
            case 'events':
                embed = await listEventsEmbed(interaction);
                if(!embed)
                    interaction.reply('There doesn\'t seem to be any scheduled events currently. Check again later!');
                interaction.reply({embeds: [embed]})
                break;
            case 'help':
                await interaction.reply({embeds: [help()]})
                break;
            //this case is just for temporary testing.
            case 'search':
                findEvent(interaction.guildId, interaction.options.getString('room'), interaction.options.getString('date'))
                console.log('SEARCH MADE')
                break;
            case 'del':
                delEvent(interaction.guildId, interaction.options.getString('id'))
                console.log('DELETION MADE')
                break;
        }
    });

    //When an event is created we push it to the database (WIP) 
    // client.on('guildScheduledEventCreate', async event => {
    //     const embed = NewEvent(event);
    // });

    //When an event is deleted we send a message
    client.on('guildScheduledEventDelete', async event => {
        //new code goes here
    });

    //When a reaction added, DM Link to user (WIP)
    client.on('messageReactionAdd', async reaction => {
        const embed = reaction.message.embeds.at(0);
        if(await reaction.emoji.name === '👍'){
            //new code goes here
        }
    });
}

//whenever we have call guildScheduleEventManager.create() or guildScheduleEventManager.delete() we get a Promise that we
//attach this callback function to. Once our promise is done waiting we callback here
function onInsertion(event: GuildScheduledEvent){
    const eventId: string = event.id
    insertEvent(event.guildId, eventId, event.name, event?.entityMetadata?.location, event.url, event.scheduledStartAt);    
}

function onFetchSubscribers(event: GuildScheduledEvent){

}


//AddEvent function creates embed for a new event from information received through a slash command
function createEvent (interaction: ChatInputCommandInteraction) {
    //grabbing information from slash commands
    const title: string | null = interaction.options.getString('title');
    const details: string | null = interaction.options.getString('description');
    const room: string | null = interaction.options.getString('room');
    const startDate: any = interaction.options.getString('starttime');
    const endDate: any = interaction.options.getString('endtime');

    //return if below fields are empty
    if (title == null || room == null || details == null)
        return;
    
        //creating an event through discord.js built in Guild Event Scheduler
        var event: Promise<GuildScheduledEvent<GuildScheduledEventStatus>> | undefined = interaction.guild?.scheduledEvents.create({
            name: title,
            description: details,
            privacyLevel: 2,
            entityType: 3,
            scheduledStartTime: new Date(startDate),
            scheduledEndTime: new Date(endDate),
            entityMetadata:{
                location: `Room: ${room}`
            }
    });

    event?.then(onInsertion)
    return event;
}

//creates the EVENTS embed that is posted to the channel
function createEventEmbed(interaction: ChatInputCommandInteraction, eventId: string | undefined){
    const eventType = interaction.options.getString('type');
    const title = interaction.options.getString('title');
    const room = interaction.options.getString('room');
    const capacity = interaction.options.getString('capacity');
    const startTime = interaction.options.getString('starttime');
    const endTime = interaction.options.getString('endtime');
    const details = interaction.options.getString('description');
    const host: string = interaction.user.id;

    //room emote image will change depending on the building you choose. By defualt it's set to a library emote
    var roomEmote = '<:StudyRoom2:1017865348457975838>'
    if(room?.includes('PGH') || room?.includes('pgh'))
        roomEmote = '<:pgh:1017868374040129588>'
    else if(room?.includes('Quad') || room?.includes('QUAD'))
        roomEmote = '<:quad:1017871428055486624>'

    //actually creates the embed that is replied to the channel
    const embed = new EmbedBuilder()
        .setColor('#32a852')
        .setTitle(`${eventType} | ${title} :notebook_with_decorative_cover:`)
        .setDescription(details)
        .setThumbnail('https://i.imgur.com/XX8tyb3.png')
        .addFields(
            { name: "ROOM:", value: `${roomEmote + " " + room}`, inline: true },
            { name: "TIME:", value: `${ISOToEnglishTime(startTime)}`, inline: true },
            { name: "DATE:", value: `${ISOToEnglishDate(endTime)}`, inline: true },
            { name: "HOST:", value: `<@${host}>`, inline: true },
        )
        .setFooter({text: `🚿 please for the love of the CS department, shower :)\n\nEventId: ${eventId}`}) //
    
    //only add the capacity to the embed when there's an input for it.
    if(capacity !== null)
            embed.addFields({ name: "ROOM CAPACITY:", value: `**${capacity}** participants`, inline: true })
    
    return embed;
}

//function to list out all ongoing events
async function listEventsEmbed(interaction: ChatInputCommandInteraction){
    const embed = new EmbedBuilder();

    let events: GuildScheduledEvent[] = [];
    const eventsCollection = await interaction.guild?.scheduledEvents.fetch();
    if(!eventsCollection)
        return embed;
    eventsCollection.forEach((e: GuildScheduledEvent) => {events.push(e)});
    
    embed
        .setColor('#32a852')
        .setTitle(`<a:NOTED:1032271325907128380> Study Groups for ${interaction.guild?.name} <a:NOTED:1032271325907128380>`)
        .setDescription('Find a group for you!')
        .setThumbnail('https://media.tenor.com/31Y1Gw8Zd98AAAAC/anime-write.gif');
    
    if(events.length == 0)
        embed.addFields({ name: "There seems to not be any events currently.", value: 'Check again later!', inline: true })
    
    events.forEach((e: GuildScheduledEvent) => {
        embed.addFields({
            name: `${e.name}`, value: `${e.description}\n**Time:** ${e.scheduledStartAt}\n**Host:** ${e.creator}\n**Set a Reminder!**\n${e.url}`
        })
    })
    
    return embed;
}

async function getSubscribers(subscribers: Promise<Collection<string, GuildScheduledEventUser<false>>> | undefined){
    return Promise.resolve(subscribers);
}

async function findGuildScheduledEvent(interaction: ChatInputCommandInteraction){
    const eventsCollection = await interaction.guild?.scheduledEvents.fetch();
    eventsCollection?.forEach((e: GuildScheduledEvent) => {
        if(e.id == interaction.options.getString('id')) return e;
    })
    return undefined;
}

// Make an announcement to all the participants of an event (WIP)
async function announcement(interaction: ChatInputCommandInteraction){
    //finds the event from the discord server's event collection
    var event: GuildScheduledEvent | undefined;
    const eventsCollection = await interaction.guild?.scheduledEvents.fetch();
    eventsCollection?.forEach((e: GuildScheduledEvent) => {
        if(e.id == interaction.options.getString('id')) event = e;
    })
    
    if(event === undefined) return;
    
    //embed setup
    var userTags: string = '';
    var msg: string | null = interaction.options.getString('message');
    
    if(msg === null) return;

    var embed = new EmbedBuilder()
        .setColor('#ff2f3d')
        .setTitle(`ANNOUNCEMENT FOR ${event.name}`)
        .setFooter({text: `🚿 and as always please stay showered\n\nEventId: ${event.id}`})
        .addFields({name: 'UPDATE:', value: `${msg}`, inline: true })
        .setThumbnail('https://media4.giphy.com/media/aq7tOXIdgaVbGgojK1/giphy.gif?cid=790b7611c7d7f72b6533626d278c0c6d37b9caf5ff933152&rid=giphy.gif&ct=s')
    
    //gathering user tags to ping
    const participants = Promise.resolve(event?.fetchSubscribers());
    await participants.then((subs) => { subs.forEach(sub => userTags += `${sub.user} `) });
    embed.addFields({name: 'NOTIFYING:', value: `${userTags}`, inline: false })
    
    interaction.reply({embeds: [embed]});
}

//creates a help embed for all commands
function help(){
    const ownerid = '<@107022278838996992>'
    const coownerid = '<@220536344848498690>'
    const coownerid2 = '<@242075681046003743>'

    const aestheticThumbnail = 'https://data.whicdn.com/images/323756483/original.gif'
    const typescriptLogo = 'https://pbs.twimg.com/profile_images/1290672565690695681/0G4bie6b_400x400.jpg'

    const helpembed = new EmbedBuilder()
        .setColor('#faf7f8')
        .setTitle('Meet Up With StudyUp')
        .setDescription(`Brought to you by ${ownerid}, ${coownerid} and ${coownerid2}`)
        .setThumbnail(aestheticThumbnail)
        .addFields(
            {name: 'What is StudyUp?', value: 'StudyUp is a bot made for bringing you and your classmates together outside of the classroom. Form study groups, '
            + 'study sessions, watch parties and more with the commands below!'},
            {name: ':loudspeaker: /addevent', value: 'Schedule a server event'},
            {name: ':exclamation: /ping', value: 'Notify an event\'s participants with an important announcement.'},
            {name: ':no_entry_sign: /delevent (coming soon)', value: 'Close a scheduled event.'},
            {name: ':placard: /updatevent (coming soon)', value: 'Use to announce an upcoming event.'},
            {name: ':hourglass: /schedule (coming soon)', value: 'Schedule a recurring meeting for either a daily, weekly, biweekly or custom basis'},
        )
        .setFooter({text: 'developed in TypeScript', iconURL: typescriptLogo})
    return helpembed;
}


//helper functions for converting DATE between ISO and plain-English
function ISOToEnglishDate(oldDate) {
    var shownDate: string;
    var tempDate = new Date(oldDate);
    var shownDate = '';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];            
    var year    = tempDate.getFullYear(); 
    var month   = tempDate.getMonth();
    var day     = tempDate.getDate(); 

    shownDate = `${months[month]} ${day}, ${year}`
                 
    return shownDate;
 }

 //helper function to convert TIME from ISO to plain-English
 function ISOToEnglishTime(oldTime) {
    var shownTime: string;
    var tempTime = new Date(oldTime);
    var hours: number   = tempTime.getHours();
    var mins: number | string   = tempTime.getMinutes();  
    
    if (mins < 10)
        mins = `0${mins}`
    if(hours > 12) {
        shownTime = `${hours-12}:${mins} PM`
    }
    else
        shownTime = `${hours}:${mins} AM`
    return shownTime;
 }