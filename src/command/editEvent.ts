import { ChatInputCommandInteraction, GuildScheduledEvent, EmbedBuilder} from "discord.js";
import { findEvent, updateEvent} from "../utils/Database";
import { ISOToEnglishTime } from "../utils/isoTimeConverter";


export async function editEvent (interaction: ChatInputCommandInteraction) {
    //Take input from user which COULD include: oldRoom, oldStartTime, newRoom?, newStartTime?, newDescription?, newName?
    const old_room: string | null = interaction.options.getString('room');
    const old_startDate: any = interaction.options.getString('starttime');
    const old_starttime = new Date(old_startDate);
    let new_room = interaction.options.getString('newroom');
    let new_startDate: any = interaction.options.getString('newstarttime');
    let new_endDate: any = interaction.options.getString('newendtime');
    let new_description = interaction.options.getString('newdescription');
    let new_name = interaction.options.getString('newname')

    //Added a case where no inputs are provided
    if(new_name == null && new_startDate == null && new_endDate == null && new_description == null && new_name == null){
        interaction.reply("You provided no inputs you **dumbo**, please try again and input changes that need to be made. :)");
        return;
    } 
    //Utilize the databse fetch to find the old event and store its event id for later use
    let eventInformation_id: string | undefined
    let oldEvent = await findEvent(interaction.guildId, old_room, new Date(old_startDate).toString()).then(event => {
        console.log("in editevent")
        console.log(old_room)
        console.log(new Date(old_startDate).toString())
        let eventInformation = event?.pop()
        eventInformation_id = eventInformation?.eventId

        //Check if the NEW inputs are not null and if they are then to replace them with the old events parameters
        if(new_name == null){new_name = eventInformation?.eventTitle!}
        if(new_description == null){new_description = eventInformation?.eventDescription!}
        if(new_endDate == null){new_endDate = eventInformation?.eventEndDate}
        
    })
    //have to be done outside due to callbacks changing the values later
    if(new_room == null){new_room = old_room;}
    if(new_startDate == null){new_startDate = old_startDate}
    //Check to see if there is already an event scheduled for newRoom and newStartTime as that would be a conflict
    if(new_room != old_room || new_startDate != old_startDate){
        let checkEventInformation_id
        let checkEvent = findEvent(interaction.guildId, new_room, new Date(new_startDate).toString()).then(check => {
            let checkEventInformation = check?.pop()
            checkEventInformation_id = checkEventInformation?.eventId
        })

        //If there is already an event at that time, then we reply telling the user and return
        if(checkEventInformation_id != undefined){
            interaction.reply("There is already an event schedule at the same **TIME** and at the same **ROOM**. Please double check your information and try again!")
            return;
        }
    }

    //Changing the start/end DATE into start/end TIME
    const new_starttime = new Date(new_startDate);
    const new_endtime = new Date(new_endDate);

    if(new_starttime > new_endtime){
        interaction.reply("The updated start time is scheduled **AFTER** the scheduled end time which is not possible. Please double check your information and try again!")
        return;
    }
    //Once you have the event, utilize the edit command for events in discord.js to update the event
    interaction.guild?.scheduledEvents.fetch(eventInformation_id).then(eventToBeChanged =>{
        interaction.guild?.scheduledEvents.edit(eventToBeChanged, {
            name: new_name!,
            scheduledStartTime: new_starttime,
            scheduledEndTime: new_endtime,
            description: new_description!,
            entityMetadata:{
                location: `Room: ${new_room}`
            }

        })
        //The event is updated in the database as well
        updateEvent(eventToBeChanged.id, new_name, new_room, new Date(new_startDate).toString(), new Date(new_endDate).toString(), new_description);

        //send a new embed as a reply that automatically replied with a BLUE colored embed to symbolize that an edit has been made
        editEventEmbed(interaction, new_starttime, eventToBeChanged)
    })
    
    //ping anyone that is interested in the event about the changes in the event (IDFK how to do this tbh)
   
}

//creates the EVENTS embed that is posted to the channel
export function editEventEmbed(interaction: ChatInputCommandInteraction, endDate: Date, event: GuildScheduledEvent | undefined){
    if(event === undefined) return;

    const eventType = event.description;
    const room = event.entityMetadata?.location;
    const details = interaction.options.getString('description');
    const thumbnail = 'https://i.imgur.com/vHzOzlc.png'
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
        .setColor('#2CE2FF')
        .setTitle("Event Updated!")
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