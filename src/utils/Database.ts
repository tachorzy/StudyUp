import mongoose, { Schema } from "mongoose"
import { start } from "repl";

let listOfCollections = Object.keys(mongoose.connection.collections);

//creating our schemas and models below
export const eventSchema = new Schema({ guildId: String, eventId: String, eventTitle: String, eventRoom: String, eventDate: Date, people: [], url: String, embedId: String, eventDescription: String, eventEndDate: Date});
export const eventModel = mongoose.model('events', eventSchema);

//Inserts an event document into the database
//converting a string | null to a Date gives some trouble so I'll just use the any keyword here for now.
export function insertEvent(guildId: string | null, eventId: string | null, title: string | null, room: string | null | undefined, url: string | null, date: any, description: string | null, dateEnd: any){
    const doc = new eventModel()
    doc.guildId = guildId?.toString();
    doc.eventId = eventId?.toString();
    doc.eventTitle = title?.toString();
    doc.eventRoom = room?.toString();
    doc.url = url?.toString();
    doc.eventDate = new Date(date);
    doc.eventDescription = description?.toString();
    doc.eventEndDate = new Date(dateEnd);
    doc.save();
}

//finds an event from the database and returns the title and list of participants.
export async function findEvent(guildId: string | null, roomQuery: string | null, dateQuery: string | null){
    
    if(!dateQuery || !guildId)
        return;
    console.log("in database.ts")
    console.log(roomQuery)
    console.log(new Date(dateQuery))
    
    return await eventModel.find({guildId: guildId, eventRoom: `Room: ${roomQuery}`, eventDate: new Date(dateQuery)});
}

export async function delEvent(guildId: string | null, eventId: string | null){
    //require both guildId and eventId to delete from the database (slightly redundant as each eventId is unique)
    if (!guildId || !eventId){
        return;
    }
    console.log(`deleting eventId: ${eventId}`)
    return await eventModel.deleteOne({eventId: eventId})
}
//note here that the date/s here actually references time
export async function updateEvent(eventId: string | null, name: string | null, room: string | null | undefined, startDate: string | null, endDate: string | null, description: string | null){
    console.log(`Updating event with id: ${eventId}`)
    return await eventModel.updateOne(
        {eventId: eventId},
        {
            $set: {
                eventTitle: name,
                eventRoom: `Room: ${room}`,
                eventDate: new Date(startDate!),
                eventEndDate: new Date(endDate!),
                eventDescription: description
            }
        })
}