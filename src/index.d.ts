import { Schema, model, connect, Date, ObjectId } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
interface IEvent {
  title: string;
  date: Date;
  userIds: [String]; //figure out the correct data type corresponding with a mongodb array
  _id?: ObjectId;
}

// 2. Create a Schema corresponding to the document interface.
const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  userIds: { type: Array, required: true },
  _id: ObjectId
});

// 3. Create a Model.
const Event = model<IEvent>('Event', eventSchema);

run().catch(err => console.log(err));

async function run() {
  // 4. Connect to MongoDB
  await connect('mongodb://localhost:3000/StudyUp');

  const event = new Event({
    title: 'COSC 3380 Hilford Lecture Together',
    date: 'Sept 12',
    userIds: []
  });
  await event.save();

  console.log(event.title); // 'bill@initech.com'
}