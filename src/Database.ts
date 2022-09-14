import mongoose, { Schema } from "mongoose"

export const schema = new Schema({ eventTitle: String, eventDate: Date, people: [], embedId: String});
export const model = mongoose.model('Events', schema);

//converting a string | null to a Date gives some trouble so I'll just use the any keyword here for now.
export function insertEmbed(title: string | null, date: any){
    const doc = new model()
    doc.eventTitle = title?.toString();
    doc.eventDate = new Date(date)
    doc.save();
}