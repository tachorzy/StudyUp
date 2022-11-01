import { channel } from "diagnostics_channel";
import { Client, EmbedBuilder, Routes, ChatInputCommandInteraction, GuildScheduledEvent, Embed, EmbedAssertions, GuildScheduledEventEntityMetadataOptions, GuildScheduledEventStatus, Options } from "discord.js";
import mongoose from "mongoose"
import { token, clientId, REST } from './Bot';
import { insertEvent, findEvent } from "./Database";
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
                const ev = AddEvent(interaction);
                await interaction.reply({embeds: [createEventEmbed(interaction)]});

                message = await interaction.fetchReply();
                message.react('👍');
                var invite = (await ev)?.createInviteURL({
                    channel: interaction.channelId
                });
                const value = eventCallbackTemp(invite);
                interaction.channel?.send(value.toString())
                break;
            case 'announce':
                // embed = announcement(interaction);
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
            case 'search':
                var event = findEvent(interaction.guildId, interaction.options.getString('room'), interaction.options.getString('date'))
                // const eventTitle = event.then(documentCallback);
                // interaction.reply(`We found an event titled: ${}`)

                break;
        }
    });

    //When an event is created we push it to the database (WIP) 
    client.on('guildScheduledEventCreate', async event => {
        const embed = NewEvent(event);
    });

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
async function eventCallbackTemp(event: Promise<string> | undefined){
    const Value = await event;
    return Value; 
}
function NewEvent(event: GuildScheduledEvent){
    //creating a document for the embed in the database (WIP)
    insertEvent(event.guildId, event.id, event.name, event?.entityMetadata?.location, event.url, event.scheduledStartAt);    
}

function documentCallback(event: mongoose.Document<unknown, any, any>){
    return event.get('eventTitle');
}

//whenever we have call guildScheduleEventManager.create() or guildScheduleEventManager.delete() we get a Promise that we
//attach this callback function to. Once our promise is done waiting we callback here
function eventCallback(event: GuildScheduledEvent){
    const eventId: string = event.id
    insertEvent(event.guildId, eventId, event.name, event?.entityMetadata?.location, event.url, event.scheduledStartAt);    
}

//AddEvent function creates embed for a new event from information received through a slash command
function AddEvent (interaction: ChatInputCommandInteraction) {
    //grabbing information from slash commands
    const eventType = interaction.options.getString('type');
    const title = interaction.options.getString('title');
    const details = interaction.options.getString('description');
    const host: string = interaction.user.id;
    const room = interaction.options.getString('room');
    const capacity = interaction.options.getString('capacity');
    const startDate: any = interaction.options.getString('starttime');
    const endDate: any = interaction.options.getString('endtime');
    const scheduledTime1 = new Date(startDate);
    const scheduledTime2 = new Date(endDate);

    //return if below fields are empty
    if (title == null || room == null || details == null)
        return;
    if(scheduledTime2 <= scheduledTime1 || endDate < startDate){
        interaction.reply('You can\'t put a time/date in that is equal to or before the start time! Please run the command again fixing the end time/date : )');
        return;
    }
        //creating an event through discord.js built in Guild Event Scheduler
        var event: Promise<GuildScheduledEvent<GuildScheduledEventStatus>> | undefined = interaction.guild?.scheduledEvents.create({
            name: title,
            description: details,
            privacyLevel: 2,
            entityType: 3,
            scheduledStartTime: scheduledTime1,
            scheduledEndTime: scheduledTime2,
            entityMetadata:{
                location: `Room: ${room}`
            }
    });
    const eventId = event?.then(eventCallback);
    //Check if it is duplicating documents in Mongoose Database (WIP)

    return event;

}

//creates the EVENTS embed that is posted to the channel
function createEventEmbed(interaction: ChatInputCommandInteraction){
    const eventId = interaction.id;
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
        .addFields(
            { name: "ROOM:", value: `${roomEmote + " " + room}`, inline: true },
            { name: "TIME:", value: `${ISOToEnglishTime(startTime)}`, inline: true },
            { name: "DATE:", value: `${ISOToEnglishDate(endTime)}`, inline: true },
            { name: "HOST:", value: `<@${host}>`, inline: true },
        )
        .setThumbnail('https://i.imgur.com/XX8tyb3.png')
        .setFooter({text: `🚿 please for the love of the CS department, shower :)\n\nEventId: ${eventId}`})
    
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

//Make an announcement to all the participants of an event
function announcement(event: GuildScheduledEvent){
    const participants = event.fetchSubscribers();
    console.log(participants)
}

//creates a help embed for all commands
function help(){
    const ownerid = '<@107022278838996992>'
    const coownerid = '<@242075681046003743>'
    const coownerid2 = '<@220536344848498690>'

    const helpembed = new EmbedBuilder()
        .setColor('#32a852')
        .setTitle('Meet Up With StudyUp')
        .setDescription(`Brought to you by ${ownerid}, ${coownerid} and ${coownerid2}`)
        .setThumbnail('https://data.whicdn.com/images/323756483/original.gif')
        .addFields(
            {name: 'What is StudyUp?', value: 'StudyUp is a bot made for bringing you and your classmates together outside of the classroom. Form study groups, '
            + 'study sessions, watch parties and more with the commands below!'},
            {name: ':loudspeaker: /addevent', value: 'Announce an upcoming event.'},
            {name: ':exclamation: /ping', value: 'Notify an event\'s participants.'},
            {name: ':no_entry_sign: /delevent (coming soon)', value: 'Close an event invitation.'},
            {name: ':placard: /updatevent (coming soon)', value: 'Use to announce an upcoming event.'},
            {name: ':hourglass: /schedule (coming soon)', value: 'Schedule a recurring meeting for either a daily, weekly, biweekly or custom basis'},
        )
        .setFooter({text: 'developed in TypeScript', iconURL: 'https://pbs.twimg.com/profile_images/1290672565690695681/0G4bie6b_400x400.jpg'})
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