import { Client, EmbedBuilder, Routes, ChatInputCommandInteraction, GuildScheduledEvent, Embed, EmbedAssertions } from "discord.js";
import { utimesSync } from "fs";
import mongoose from "mongoose"
import { token, clientId, REST } from './Bot';
import { insertEvent, findEvent, enrollUser, dropUser } from "./Database";
import { commands } from "./Commands";
import { stringify } from "querystring";

export default (client: Client): void => {
    const rest = new REST({ version: '10' }).setToken(token);

    rest.put(Routes.applicationCommands(clientId), { body: commands })
        .then((data: any) => console.log(`Successfully registered ${data.length} application commands.`)) //using any for all your types is redundant cuz thats literally just js
        .catch(console.error);
        
    var participantCollection;
    //upon an interaction via slash command
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
    
        const { commandName } = interaction;
        var embed: EmbedBuilder | undefined;
        //var message: InteractionResponse<boolean>;
        var message;
        switch(commandName){
            case 'addevent':
                AddEvent(interaction);
                // embed = createEventEmbed(interaction)
                await interaction.reply({embeds: [createEventEmbed(interaction)]});

                message = await interaction.fetchReply();
                message.react('👍');
                break;
            case 'announce':
                // embed = announceEvent(interaction);
                break;
            case 'events':
                embed = await createEventsEmbed(interaction);
                if(!embed)
                    interaction.reply('There doesn\'t seem to be any scheduled events currently. Check again later!');
                interaction.reply({embeds: [embed]})
                break;
            case 'help':
                await interaction.reply({embeds: [help()]})
                break;
            case 'search':
                const doc = await search(interaction.options.getString('id'))
                await interaction.reply(`test ${doc}`)
                break;
        }
    });

    //When an event is created we push it to hte 
    client.on('guildScheduledEventCreate', async interaction => {
        const embed = NewEvent(interaction);
    });

    //When a reaction added
    client.on('messageReactionAdd', async reaction => {
        const embed = reaction.message.embeds.at(0);
        if(await reaction.emoji.name === '👍'){
            participantCollection = await reaction.users.fetch();
            console.log(participantCollection);
            console.log(participantCollection.keys());

                // enrollUser(participantCollection.at(-1), )
        }
    });

    //When reaction removed
    client.on('messageReactionRemove', async reaction => {
        participantCollection = await reaction.users.fetch();
        console.log(participantCollection);
        console.log(participantCollection.keys());   
        //we would then update the db here 
        
        //ping test
    });


}

//announces a new event upon created
function NewEvent(event: GuildScheduledEvent){
    //creating a document for the embed in the database
    insertEvent(event.guildId, event.id, event.name, event.url, event.scheduledStartAt);    
    // const embed = new EmbedBuilder()
    // .setColor('#32a852')
    // .setThumbnail(event.image)
    // .setTitle(`${event.name} has just been announced :notebook_with_decorative_cover:`)
    // .setDescription(event.description)
    // .addFields(
    //     { name: "ROOM:", value: `${event.channel} `, inline: true },
    //     { name: "Scheduled for:", value: `${event.scheduledStartAt} `, inline: true }
    // )
    // // .setThumbnail('https://i.imgur.com/XX8tyb3.png')
    // .setFooter({text: `🚿 please for the love of the CS department, shower :)`})
    // return embed;
}

//AddEvent function creates embed for a new event from information received through a slash command
function AddEvent (interaction: ChatInputCommandInteraction) {
    const eventId = interaction.id;
    const eventType = interaction.options.getString('type');
    const title = interaction.options.getString('title');
    const details = interaction.options.getString('description');
    const host: string = interaction.user.id;
    const room = interaction.options.getString('room');
    const capacity = interaction.options.getString('capacity');
    const date: any = interaction.options.getString('starttime');
    console.log(date)
    console.log(ISOToEnglishDate(date))
    console.log(ISOToEnglishTime(date))

    const scheduledTime = new Date(date);
    if (title == null || room == null || details == null)
        return;
    
    interaction.guild?.scheduledEvents.create({
        name: title,
        description: details,
        privacyLevel: 2,
        entityType: 3, //https://discord.com/developers/docs/resources/guild-scheduled-event#guild-scheduled-event-object-guild-scheduled-event-entity-types
        scheduledStartTime: scheduledTime,
        scheduledEndTime: new Date(date)
    });
    
    //creating a document for the embed in the database
    insertEvent(interaction.guildId, eventId, title, null, date);    
    return;
}

function createEventEmbed(interaction: ChatInputCommandInteraction){
    const eventId = interaction.id;
    const eventType = interaction.options.getString('type');
    const title = interaction.options.getString('title');
    const room = interaction.options.getString('room');
    const capacity = interaction.options.getString('capacity');
    const time = interaction.options.getString('time');
    const date: any = interaction.options.getString('date') + ' UTC';
    const details = interaction.options.getString('description');
    const host: string = interaction.user.id;

    //room emote image will change depending on the building you choose. By defualt it's set to a library emote
    var roomEmote = '<:StudyRoom2:1017865348457975838>'
    if(room?.includes('PGH') || room?.includes('pgh'))
        roomEmote = '<:pgh:1017868374040129588>'
    else if(room?.includes('Quad') || room?.includes('QUAD'))
        roomEmote = '<:quad:1017871428055486624>'

    const embed = new EmbedBuilder()
        .setColor('#32a852')
        .setTitle(`${eventType} | ${title} :notebook_with_decorative_cover:`)
        .setDescription(details)
        .addFields(
            { name: "ROOM:", value: `${roomEmote + " " + room}`, inline: true },
            { name: "TIME:", value: `${ISOToEnglishTime(date)}`, inline: true },
            { name: "DATE:", value: `${ISOToEnglishDate(date)}`, inline: true },
            { name: "HOST:", value: `<@${host}>`, inline: true },
        )
        .setThumbnail('https://i.imgur.com/XX8tyb3.png')
        .setFooter({text: `🚿 please for the love of the CS department, shower :)\n\nEventId: ${eventId}`})
    
    //only add the capacity to the embed when there's an input for it.
    if(capacity !== null)
            embed.addFields({ name: "ROOM CAPACITY:", value: `**${capacity}** participants`, inline: true })
    
    return embed;
}

async function createEventsEmbed(interaction: ChatInputCommandInteraction){
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

async function search(interactionId: string | null){
    findEvent(interactionId);
}

//creates a help embed
function help(){
    const ownerid = '<@107022278838996992>'
    const coownerid = '<@242075681046003743>'

    const helpembed = new EmbedBuilder()
        .setColor('#32a852')
        .setTitle('Meet Up With StudyUp')
        .setDescription(`Brought to you by ${ownerid} and ${coownerid} `)
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


//helper functions for converting between ISO and plain-English
function ISOToEnglishDate(oldDate) {
    var shownDate: string;
    var tempDate = new Date(oldDate);
    // var oldTime = Math.round(tempDate.getTime() / 1000);
    var shownDate = '';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                      
    var year    = tempDate.getFullYear(); 
    var month   = tempDate.getMonth();
    var day     = tempDate.getDate(); 

    shownDate = `${months[month]} ${day}, ${year}`
                 
    return shownDate;
 }

 function ISOToEnglishTime(oldTime) {
    var shownTime: string;
    var tempTime = new Date(oldTime);
    // var oldTime = Math.round(tempDate.getTime() / 1000);
    var hours: number   = tempTime.getHours()+6;
    var mins: number | string   = tempTime.getMinutes();  
    
    if (mins < 10)
        mins = `0${mins}`

    if(hours > 12) {
        shownTime = `${hours-12}:${mins} pm`
    }
    else
        shownTime = `${hours}:${mins} am`
    // shownTime = `${hours}:${mins}`
    return shownTime;
 }