import { Client, GatewayIntentBits } from "discord.js";
import mongoose from "mongoose"
import command from "./Command";
import * as dotenv from "dotenv";

dotenv.config();

const dbtoken: string | undefined = process.env.DB_CONN_STRING;
export const token: string | undefined = process.env.DISCORD_TOKEN;
export const clientId: any = process.env.clientId;
export const guildId: any | undefined = process.env.guildId;
export const { REST } = require('@discordjs/rest');

console.log("Bot is starting...");
console.log(`Discord token: ${token}`);
console.log(`MongoDB token: ${dbtoken}`);

export const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages]});

client.once('ready', async () => {
	await mongoose.connect(
		dbtoken || '',
		{
			keepAlive: true,
		}
	)
	console.log('Ready!');
});

command(client);
client.login(token);
