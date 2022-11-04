import { Client, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

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
                .setDescription('Tell us when you want to meet! In the format mm-dd-yyyy hh:mm AM/PM, e.g. 09-12-2022 04:00 PM')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('endtime')
                .setDescription('When are you ending the session? In the format mm-dd-yyyy hh:mm AM/PM, e.g. 09-12-2022 05:30 PM')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('description')
                .setDescription('So what\'s the plan?')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('capacity')
                .setDescription('What\'s the room\'s suggested number of people?')
                .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),
        new SlashCommandBuilder().setName('schedule').setDescription('Schedule a recurring study sesh')
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
                .setDescription('Tell us when you want to meet! In the format mm-dd-yyyy hh:mm AM/PM, e.g. 09-12-2022 04:00 PM')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('endtime')
                .setDescription('When are you ending the session? In the format mm-dd-yyyy hh:mm AM/PM, e.g. 09-12-2022 05:30 PM')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('description')
                .setDescription('So what\'s the plan?')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('day_of_the_week')
                .setDescription('Schedule your event based on the day of the week. Enter a number from 0-6 (Sun-Sat)')
                .setRequired(true))   
            .addStringOption(option =>
                option.setName('semester')
                .setDescription('What semester is this? Fall, Spring, or Summer?')
                .setRequired(true))           
            .addStringOption(option =>
                option.setName('capacity')
                .setDescription('What\'s the room\'s suggested number of people?')
                .setRequired(false))
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents),
        new SlashCommandBuilder().setName('search').setDescription('search for an event')
            .addStringOption(option =>
                option.setName('room')
                .setDescription('where is this event taking place?')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('date')
                .setDescription('when is this event taking place? MM-DD-YY hh:mm e.g. 11-11-2022 04:30 PM')
                .setRequired(true)),
        new SlashCommandBuilder().setName('del').setDescription('delete an event')
            .addStringOption(option =>
                option.setName('id')
                .setDescription('where is this event taking place?')
                .setRequired(true)),
        new SlashCommandBuilder().setName('help').setDescription('provides help on all available commands'),
        new SlashCommandBuilder().setName('ping').setDescription('Ping everyone in an event and send a message.')
            .addStringOption(option =>
                option.setName('id')
                .setDescription('copy the event\'s ID from the events tab or the event embed.')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('message')
                .setDescription('Have something to share with us?')
                .setRequired(true))
        // new SlashCommandBuilder().setName('delevent').setDescription('Removes an embed and study sesh'),
        // new SlashCommandBuilder().setName('update').setDescription('Updates a study sesh embed with new info'),
    ]	