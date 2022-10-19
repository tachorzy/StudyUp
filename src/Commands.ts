import { Client, SlashCommandBuilder } from "discord.js";

    export const commands = [
        new SlashCommandBuilder().setName('events').setDescription('Creates an embed with links for every scheduled event'),
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
                option.setName('starttime')
                .setDescription('Tell us when you want to meet! In the format mm-dd-yyyy hh:mm, e.g. 09-12-2022 04:00')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('endtime')
                .setDescription('When are you ending the session? In the format mm-dd-yyyy hh:mm, e.g. 09-12-2022 05:30')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('description')
                .setDescription('So what\'s the plan?')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('capacity')
                .setDescription('What\'s the room\'s suggested number of people?')
                .setRequired(false)),
        new SlashCommandBuilder().setName('search').setDescription('search for an event')
            .addStringOption(option =>
                option.setName('id')
                .setDescription('The id of the event is found in the footer of event embeds')
                .setRequired(true)),
        new SlashCommandBuilder().setName('help').setDescription('provides help on all available commands'),
        new SlashCommandBuilder().setName('ping').setDescription('Ping everyone in an event and send a message.')
            .addStringOption(option =>
                option.setName('announcement')
                .setDescription('Have something to share with us?')
                .setRequired(false))
        // new SlashCommandBuilder().setName('delevent').setDescription('Removes an embed and study sesh'),
        // new SlashCommandBuilder().setName('update').setDescription('Updates a study sesh embed with new info'),
    ]	