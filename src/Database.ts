import mongoose, { Schema } from "mongoose"

export const eventSchema = new Schema({ eventId: String, eventTitle: String, eventDate: Date, people: [], embedId: String});
export const eventModel = mongoose.model('events', eventSchema);

export const userSchema = new Schema({ discordId: String, name: String, events: []});
export const userModel = mongoose.model('userIDs', userSchema);

//converting a string | null to a Date gives some trouble so I'll just use the any keyword here for now.
export function insertEvent(eventId: string | null, title: string | null, date: any){
    const doc = new eventModel()
    doc.eventId = eventId?.toString();
    doc.eventTitle = title?.toString();
    doc.eventDate = new Date(date)
    doc.save();
}

//We will insert each user into the db when they react/join an event for the very first time. 
export function insertUser(discordId: string | null, name: string | null, events: string[]){
    const doc = new userModel()
    doc.discordId = discordId?.toString();
    doc.name = name?.toString();
    doc.events = []
    doc.save();
}

//pushes and event into a user's array of events
export function addEvent(discordId: string, eventId: string, eventTitle: string){
    //NEEDS WORK   
}

//finds an event from the database
export function findEvent(eventId: string | null){
    //NEEDS WORK
}