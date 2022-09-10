import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { events?: mongoDB.Collection } = {}

//declaring global variables so Node.js knows we have existing strings for the following variables
declare global {
    namespace NodeJS {
        interface ProcessEnv{
            DB_CONN_STRING: string;
            USERS_COLLECTION_NAME: string;
        }
    }
}

// Initialize Connection
export async function connectToDatabase () {
    dotenv.config();

    console.log(`DB_CONN_STRING IS: ${process.env.DB_CONN_STRING}`)
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);

    await db.command({
        "collMod": process.env.USERS_COLLECTION_NAME,
        "validator": {
            $jsonSchema: {
                bsonType: "object",
                required: ["title", "date", "userIds"],
                additionalProperties: false,
                properties: {
                _id: {},
                title: {
                    bsonType: "string",
                    description: "'name' is required and is a string"
                },
                date: {
                    bsonType: "date",
                    description: "'price' is required and is a date"
                },
                userIds: {
                    bsonType: "array",
                    description: "'category' is required and is an array"
                }
                }
            }
         }
    });
   
    const eventCollection: mongoDB.Collection = db.collection(process.env.USERS_COLLECTION_NAME);
 
  collections.events = eventCollection;
       
         console.log(`Successfully connected to database: ${db.databaseName} and collection: ${eventCollection.collectionName}`);
 }
 
