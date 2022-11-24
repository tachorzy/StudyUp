import { ChatInputCommandInteraction, GuildScheduledEvent} from "discord.js";
import { findEvent, delEvent } from "../utils/Database";



export function editEvent (interaction: ChatInputCommandInteraction) {
    //Take input from user which COULD include: oldRoom, oldStartTime, newRoom?, newStartTime?, newDescription?, newName?
    //check if the inputs are in the right format
    //check to see if there is already an event scheduled for newRoom and newStartTime as that would be a conflict
    //use the fetch command to fetch eventId from the database using oldRoom and oldStartTime as parameters
    //one you have the event, utilize the edit command for events in discord.js and change the event
    //send a new embed for the edited event (diff color maybe like blue) (add one that is red for the delete)
    //ping anyone that is interested in the event about the changes in the event
   
    interaction.reply("The Event was Successfully edited and is now updated")
}