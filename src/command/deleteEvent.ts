import { ChatInputCommandInteraction, GuildScheduledEvent, EmbedBuilder} from "discord.js";
import { findEvent, delEvent } from "../utils/Database";
import { ISOToEnglishTime } from "../utils/isoTimeConverter";


export function deleteEvent (interaction: ChatInputCommandInteraction) {
    //grabbing input from the slash command entered by the user
    const room: string | null = interaction.options.getString('room');
    const startDate: any = interaction.options.getString('starttime');
    const starttime = new Date(startDate)

    //CHECK IF INPUTS ARE IN THE RIGHT FORMAT

    //use the Database.ts findevent command to fetch eventId from the database
    let event = findEvent(interaction.guildId, room, new Date(starttime).toString())
    event.then(Data => {
        //storing eventId in id variable
        let eventInformation = Data?.pop()
        let id = eventInformation?.eventId as string
        if(id == undefined){
            interaction.reply("EVENT DOES NOT EXIST, PLEASE TRY AGAIN LATER")
            return;
        }
        //using discord.js fetch to grab the event and then deleting the event from the discord server AND databse
        let temp = interaction.guild?.scheduledEvents.fetch(id).then(temp => {
            //deleteing from discord
            interaction.guild?.scheduledEvents.delete(temp as GuildScheduledEvent)

            //deleting from the database
            delEvent(interaction.guildId, id)

            //replying to the interaction with a RED color embed to indicate that the event has been deleted
            deleteEventEmbed(interaction, startDate, temp)
        })
    })
}

//creates the EVENTS embed that is posted to the channel
export function deleteEventEmbed(interaction: ChatInputCommandInteraction, endDate: Date, event: GuildScheduledEvent | undefined){
    if(event === undefined) return;

    const eventType = event.description;
    const room = event.entityMetadata?.location;
    const details = interaction.options.getString('description');
    const thumbnail = 'https://i.imgur.com/07SNIYk.png'
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
        .setColor('#FF2D08')
        .setTitle("Event DELETED!")
        .setDescription(`${eventType} | ${event.name} :pencil:`)
        .setThumbnail(thumbnail)
        .addFields(
            { name: "ROOM:", value: `${roomEmote} __${room?.substring(6)}__`, inline: true },
            { name: "TIME:", value: `${startTime}-${endTime}`, inline: true },
            { name: "DATE:", value: `${endDate}`, inline: true },
        )
        .setFooter({text: `🚿 please for the love of the CS department, shower :)\n\nEventId: ${event.id}`}) 
    
    interaction.reply({embeds: [embed]});
}