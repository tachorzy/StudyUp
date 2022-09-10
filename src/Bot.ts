import { Client, GatewayIntentBits } from "discord.js";
import express from "express";
import { connectToDatabase } from "./services/database.service"
import { usersRouter } from "./routes/users.router";
import command from "./Command";
import * as dotenv from "dotenv";

dotenv.config();

export const token = process.env.DISCORD_TOKEN;
export const clientId: any = process.env.clientId;
export const guildId: any = process.env.guildId;
export const { REST } = require('@discordjs/rest');

console.log("Bot is starting...");
console.log(`Discord token: ${token}`);

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
	console.log('Ready!');
});

command(client);
client.login(token);

//MongoDB
const app = express();
const port = 3000; //probably should change later?
connectToDatabase()
    .then(() => {
		console.log(`The port is ${port}`)
        app.use("/games", usersRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });