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

//adds a user into an event's participant list
export function enrollUser(discordId: string, eventId: string){
    eventModel.findOneAndUpdate({id: eventId},
        {$push: { people: discordId } }, function(error, event){
        if(error)
           return console.log(error);        
    })
}

//removes a user from an event's participant list
export function dropUser(discordId: string, eventId: string){
    eventModel.findOneAndUpdate({id: eventId},
        {$pull: { people: discordId } }, function(error, event){
        if(error)
           return console.log(error);        
    })
}


//pushes and event into a user's array of events
export function addUser(discordId: string, eventId: string){

}


//finds an event from the database and returns the title and list of participants.
export async function findEvent(eventId: string | null){
    console.log(`SEARCHING FOR EVENTID: ${eventId}`)
    //NEEDS WORK -- broken and needs refactoring
    var title, users, str
    eventModel.find({id: eventId}, function(error, event){
        if(error)
           return console.log(error);
        console.log(event)
        //string parsing: NEEDS REFACTORING!
        str = event.toString()
        users = str.slice(str.indexOf('['), str.indexOf(',')).split('],')
        title = str.slice(str.indexOf('eventTitle: '), str.indexOf('}'))
        console.log(`event title: ${title}\npeople: ${users}`);
    }).select(['eventId', 'eventTitle', 'people'])
    // console.log(eventModel.where('eventId').equals(eventId).select(['eventTItle', 'people']))
    // return `event title: ${title}\npeople: ${users}`
}