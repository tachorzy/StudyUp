import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, GuildScheduledEvent, GuildScheduledEventStatus } from "discord.js";
import { ISOToEnglishDate, ISOToEnglishTime } from "../utils/isoTimeConverter";
import { insertEvent } from "../utils/Database";

//whenever we have call guildScheduleEventManager.create() or guildScheduleEventManager.delete() we get a Promise that we
//attach this callback function to. Once our promise is done waiting we callback here
function onInsertion(event: GuildScheduledEvent){
    const eventId: string = event.id
    insertEvent(event.guildId, eventId, event.name, event?.entityMetadata?.location, event.url, event.scheduledStartAt);    
}

//AddEvent function creates embed for a new event from information received through a slash command
export function createEvent (interaction: ChatInputCommandInteraction) {
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
    
    const eventId = event?.then(event => {
        const eventId: string = event.id
        insertEvent(event.guildId, eventId, event.name, event?.entityMetadata?.location, event.url, event.scheduledStartAt); 
    });
    return event;
}

//creates the EVENTS embed that is posted to the channel
export function createEventEmbed(interaction: ChatInputCommandInteraction, endDate: Date, event: GuildScheduledEvent | undefined, invite: string){
    if(event === undefined) return;

    const eventType = interaction.options.getString('type');
    const room = interaction.options.getString('room');
    const capacity = interaction.options.getString('capacity');
    const details = interaction.options.getString('description');
    const host: string = interaction.user.id;
    const thumbnail = 'https://i.imgur.com/XX8tyb3.png'
    const startTime = ISOToEnglishTime(event.scheduledStartAt) ;
    const endTime = ISOToEnglishTime(event.scheduledEndAt);


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