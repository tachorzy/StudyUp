import { ChatInputCommandInteraction, GuildScheduledEvent} from "discord.js";
import { findEvent, delEvent } from "../utils/Database";



export function deleteEvent (interaction: ChatInputCommandInteraction) {
    //grabbing input from the slash command entered by the user
    const room: string | null = interaction.options.getString('room');
    const startDate: any = interaction.options.getString('starttime');
    const starttime = new Date(startDate)

    //CHECK IF INPUTS ARE IN THE RIGHT FORMAT

    //use the Database.ts findevent command to fetch eventId from the database
    let event = findEvent(interaction.guildId, room, starttime.toString())
    event.then(Data => {
        //storing eventId in id variable
        let eventInformation = Data?.pop()
        let id = eventInformation?.eventId as string
        if(id == undefined){
            interaction.reply("EVENT DOES NOT EXIST, PLEASE TRY AGAIN LATER")
            return;
        }
        delEvent(interaction.guildId, id)
        //using discord.js fetch to grab the event and then deleting the event from the discord server AND databse
        let temp = interaction.guild?.scheduledEvents.fetch(id).then(temp => {
            //deleteing from discord
            interaction.guild?.scheduledEvents.delete(temp as GuildScheduledEvent)

            //deleting from the database
            delEvent(interaction.guildId, id)
        })
    })

    //CHANGE THIS TO INSTEAD REPLY WITH A RED COLOR EMBED SAYING EVENT CANCELED
    interaction.reply("The Delete was Successful and the event is now deleted!")
}