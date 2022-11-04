import { Client, EmbedBuilder, Routes, ChatInputCommandInteraction, GuildScheduledEvent, Embed, EmbedAssertions, GuildScheduledEventEntityMetadataOptions, GuildScheduledEventStatus, InteractionCollector, GuildScheduledEventUser, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, APIActionRowComponent, AnyComponentBuilder } from "discord.js";
import { token, clientId, REST, guildId } from './Bot';
import { insertEvent, findEvent, delEvent } from "./Database";
import { commands } from "./slashCommands";

import { parseDates, parseRooms, parseTimes } from "./commands/classParseUtils";

const cronJob = require('node-cron');

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
        let embed: EmbedBuilder | undefined;
        switch(commandName){
            case 'addevent':
                const event = await createEvent(interaction);
                //create an invite link alongside the creation of an event and pass that as a parameter to the createEventEmbed function so that we can add the invite as a link to the Embed.
                event?.createInviteURL({channel: interaction.channelId}).then(invite => {
                    createEventEmbed(interaction, event, invite)
                })
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
            case 'schedule':
                const eventScheduled: GuildScheduledEvent<GuildScheduledEventStatus> | undefined = await scheduleRecuringEvent(interaction);
                console.log(eventScheduled)
                eventScheduled?.createInviteURL({channel: interaction.channelId}).then(invite => {
                    createEventEmbed(interaction, event, invite)
                })               
                break;
            case 'scrape':
                parseTimes();
                break;
        }
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

//whenever we have call guildScheduleEventManager.create() or guildScheduleEventManager.delete() we get a Promise that we
//attach this callback function to. Once our promise is done waiting we callback here
function onInsertion(event: GuildScheduledEvent){
    const eventId: string = event.id
    insertEvent(event.guildId, eventId, event.name, event?.entityMetadata?.location, event.url, event.scheduledStartAt);    
}

//AddEvent function creates embed for a new event from information received through a slash command
function createEvent (interaction: ChatInputCommandInteraction) {
    //grabbing information from slash commands
    const title: string | null = interaction.options.getString('title');
    const details: string | null = interaction.options.getString('description');
    const room: string | null = interaction.options.getString('room');
    const startDate: any = interaction.options.getString('starttime');
    const endDate: any = interaction.options.getString('endtime');

    if (title == null || room == null || details == null)
        return;
    if (new Date(startDate) >= new Date(endDate))
        interaction.reply('`INVALID DATE ENTERED: Event scheduled to end before it begins. Please enter a valid start and end time.`')
        
    //creating an event through discord.js built in Guild Event Scheduler
    let event: Promise<GuildScheduledEvent<GuildScheduledEventStatus>> | undefined = interaction.guild?.scheduledEvents.create({
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
    
    const eventId = event?.then(onInsertion);
    return event;
}

//creates the EVENTS embed that is posted to the channel
function createEventEmbed(interaction: ChatInputCommandInteraction, event: GuildScheduledEvent | undefined, invite: string){
    if(event === undefined) return;

    console.log(interaction)
    const eventType = interaction.options.getString('type');
    const room = interaction.options.getString('room');
    const capacity = interaction.options.getString('capacity');
    const details = interaction.options.getString('description');
    const startTime = ISOToEnglishTime(event.scheduledStartAt) ;
    const endTime = ISOToEnglishTime(event.scheduledEndAt);
    const endDate = ISOToEnglishDate(event.scheduledEndAt);
    const host: string = interaction.user.id;
    const thumbnail = 'https://i.imgur.com/XX8tyb3.png'

    //room emote image will change depending on the building you choose. By defualt it's set to a library emote
    let roomEmote = '<:StudyRoom2:1017865348457975838>'
    if(room?.includes('PGH') || room?.includes('pgh'))
        roomEmote = '<:pgh:1017868374040129588>'
    else if(room?.includes('Quad') || room?.includes('QUAD'))
        roomEmote = '<:quad:1017871428055486624>'

    //actually creates the embed that is replied to the channel
    const embed = new EmbedBuilder()
        .setColor('#32a852')
        .setTitle(`${eventType} | ${event.name} :notebook_with_decorative_cover:`)
        .setDescription(details)
        .setThumbnail(thumbnail)
        .addFields(
            { name: "ROOM:", value: `${roomEmote} ${room}`, inline: true },
            { name: "TIME:", value: `${startTime}-${endTime}`, inline: true },
            { name: "DATE:", value: `${endDate}`, inline: true },
            { name: "HOST:", value: `<@${host}>`, inline: true },
        )
        .setFooter({text: `🚿 please for the love of the CS department, shower :)\n\nEventId: ${event.id}`}) 
    //create a button and add to reply so that people can also easily "interest" the event
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
					.setLabel('Click me if your interested in this event!')
					.setStyle(ButtonStyle.Link)
                    .setURL(invite)
        );

    //only add the capacity to the embed when there's an input for it.
    if(capacity !== null) 
        embed.addFields({ name: "ROOM CAPACITY:", value: `**${capacity}** participants`, inline: true })
    
    interaction.reply({components: [row], embeds: [embed]});
}

async function scheduleRecuringEvent(interaction: ChatInputCommandInteraction){    
    let localInteraction = interaction
    let dayOfWeek = interaction.options.getString('day_of_the_week');
    let event: GuildScheduledEvent | undefined;
    //first param: second (optional), second param: minute, third param: hour, fourth param: day of month, fifth param: month, sixth param: day of week
    cronJob.schedule(`0 0 0 * * ${dayOfWeek}`, async () => {
        console.log('CRON JOB: scheduling an event')
        event = await createEvent(localInteraction);
        return event;
    });
    return event;
}

//function to list out all ongoing events
async function listEventsEmbed(interaction: ChatInputCommandInteraction){
    const embed = new EmbedBuilder();

    let events: GuildScheduledEvent[] = [];
    const eventsCollection = await interaction.guild?.scheduledEvents.fetch();
    if(!eventsCollection) return embed;
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
            name: `${e.name}`, value: `${e.description}\n**Time:** ${e.scheduledStartAt}-${e.scheduledEndAt}\n**Host:** ${e.creator}\n**Set a Reminder!**\n${e.url}`
        })
    })
    
    return embed;
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
    let event: GuildScheduledEvent | undefined;
    const eventsCollection = await interaction.guild?.scheduledEvents.fetch();
    eventsCollection?.forEach((e: GuildScheduledEvent) => {
        if(e.id == interaction.options.getString('id')) event = e;
    })
    
    if(event === undefined) return;
    
    //embed setup
    let userTags: string = '';
    let msg: string | null = interaction.options.getString('message');
    
    if(msg === null) return;

    let embed = new EmbedBuilder()
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
    const tempDate = new Date(oldDate);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];            
    const year    = tempDate.getFullYear(); 
    const month   = tempDate.getMonth();
    const day     = tempDate.getDate(); 

    const shownDate: string = `${months[month]} ${day}, ${year}`
                 
    return shownDate;
 }

 //helper function to convert TIME from ISO to plain-English
 function ISOToEnglishTime(oldTime) {
    let shownTime: string;
    const tempTime = new Date(oldTime);
    let hours: number   = tempTime.getHours();
    let mins: number | string   = tempTime.getMinutes();  
    
    if (mins < 10)
        mins = `0${mins}`
    if(hours > 12) {
        shownTime = `${hours-12}:${mins} PM`
    }
    else
        shownTime = `${hours}:${mins} AM`
    return shownTime;
 }