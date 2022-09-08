import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

console.log("Bot is starting...");
console.log(`Discord token: ${process.env.DISCORD_TOKEN}`);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
	console.log('Ready!');
});

client.login("token");
