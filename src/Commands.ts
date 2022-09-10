import { Client, SlashCommandBuilder } from "discord.js";

export const commands = [
	new SlashCommandBuilder().setName('addevent').setDescription('Creates an embed with information for a new study sesh')
		.addStringOption(option =>
			option.setName('title')
			.setDescription('Name your study sesh')
			.setRequired(true))
        .addStringOption(option =>
            option.setName('type')
            .setDescription('Is it a Study Sesh, Watch Party or Social Event?')
            .setRequired(true))
		.addStringOption(option =>
			option.setName('room')
			.setDescription('Tell us where your sesh will be!')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('time')
			.setDescription('Tell us when you plan to meet!')
			.setRequired(true))
        .addStringOption(option =>
            option.setName('date')
            .setDescription('Tell us what day you wanna meet!')
            .setRequired(true))
		.addStringOption(option =>
			option.setName('description')
			.setDescription('So what\'s the plan?')
			.setRequired(true))

        .addStringOption(option =>
            option.setName('capacity')
            .setDescription('What\'s the room\'s suggested number of people?')
            .setRequired(false)),
        
    new SlashCommandBuilder().setName('help').setDescription('provides help on all available commands'),
	new SlashCommandBuilder().setName('delevent').setDescription('Removes an embed and study sesh'),
	new SlashCommandBuilder().setName('update').setDescription('Updates a study sesh embed with new info'),
]	