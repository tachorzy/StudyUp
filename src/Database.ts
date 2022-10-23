import mongoose, { Schema } from "mongoose"

let listOfCollections = Object.keys(mongoose.connection.collections);

//creating our schemas and models below
export const eventSchema = new Schema({ guildId: String, eventId: String, eventTitle: String, eventDate: Date, people: [], url: String, embedId: String});
export const eventModel = mongoose.model('events', eventSchema);

//Inserts an event document into the database
//converting a string | null to a Date gives some trouble so I'll just use the any keyword here for now.
export function insertEvent(guildId: string | null, eventId: string | null, title: string | null, url: string | null, date: any){
    const doc = new eventModel()
    doc.guildId = guildId?.toString();
    doc.eventId = eventId?.toString();
    doc.eventTitle = title?.toString();
    doc.url = url?.toString();
    doc.eventDate = new Date(date);
    doc.save();
}

//finds an event from the database and returns the title and list of participants.
export async function findEvent(eventId: string | null){
    console.log(`SEARCHING FOR EVENTID: ${eventId}`)



    
}