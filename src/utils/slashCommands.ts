import { Client, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

    export const commands = [
        new SlashCommandBuilder().setName('events').setDescription('Creates an embed with links for every scheduled event'),
        new SlashCommandBuilder().setName('addevent').setDescription('Creates an embed with information for a new study sesh')
            .addStringOption(option =>
                option.setName('title')
                .setDescription('Name your study sesh')
                .setRequired(true))
            .addStringOption(option =>
                option.addChoices(
                    {name: 'Study Sesh', value: 'Study Sesh'},
                    {name: 'Watch Party', value: 'Watch Party'},
                    {name: 'Social Event', value: 'Social Event'},)
                .setName('type')
                .setDescription('Is it a Study Sesh, Watch Party or Social Event?')
                .setRequired(true))
            .addStringOption(option =>
                option.addChoices(
                    {name: '106F', value: '106F'},
                    {name: '106G', value: '106G'},
                    {name: '106H', value: '106H'},
                    {name: '106J', value: '106J'},
                    {name: '106K', value: '106K'},
                    {name: '106E', value: '106E'},
                    {name: '221E', value: '221E'},
                    {name: '221G', value: '221G'},
                    {name: '221H', value: '221H'},
                    {name: '221J', value: '221J'},
                    {name: '221K', value: '221K'},
                )
                .setName('room')
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
                    option.addChoices(
                        {name: 'Study Sesh', value: 'Study Sesh'},
                        {name: 'Watch Party', value: 'Watch Party'},
                        {name: 'Social Event', value: 'Social Event'})
                    .setName('type')
                    .setDescription('Is it a Study Sesh, Watch Party or Social Event?')
                    .setRequired(true))
            .addStringOption(option =>
                option.addChoices(
                    {name: '106F', value: '106F'},
                    {name: '106G', value: '106G'},
                    {name: '106H', value: '106H'},
                    {name: '106J', value: '106J'},
                    {name: '106K', value: '106K'},
                    {name: '106E', value: '106E'},
                    {name: '221E', value: '221E'},
                    {name: '221G', value: '221G'},
                    {name: '221H', value: '221H'},
                    {name: '221J', value: '221J'},
                    {name: '221K', value: '221K'},
                )
                .setName('room')
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
                option.addChoices(
                    {name: '106F', value: '106F'},
                    {name: '106G', value: '106G'},
                    {name: '106H', value: '106H'},
                    {name: '106J', value: '106J'},
                    {name: '106K', value: '106K'},
                    {name: '106E', value: '106E'},
                    {name: '221E', value: '221E'},
                    {name: '221G', value: '221G'},
                    {name: '221H', value: '221H'},
                    {name: '221J', value: '221J'},
                    {name: '221K', value: '221K'},
                )
                .setName('room')
                .setDescription('where is this event taking place?')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('date')
                .setDescription('when is this event taking place? MM-DD-YY hh:mm e.g. 11-11-2022 04:30 PM')
                .setRequired(true)),
        new SlashCommandBuilder().setName('delete').setDescription('delete an event')
            .addStringOption(option =>
                option.addChoices(
                    {name: '106F', value: '106F'},
                    {name: '106G', value: '106G'},
                    {name: '106H', value: '106H'},
                    {name: '106J', value: '106J'},
                    {name: '106K', value: '106K'},
                    {name: '106E', value: '106E'},
                    {name: '221E', value: '221E'},
                    {name: '221G', value: '221G'},
                    {name: '221H', value: '221H'},
                    {name: '221J', value: '221J'},
                    {name: '221K', value: '221K'},
                )
                .setName('room')
                .setDescription('where is this event taking place?')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('starttime')
                .setDescription('when is the event taking place?')
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
                .setRequired(true)),
        new SlashCommandBuilder().setName('map').setDescription('Find your way around the library and straight to your study room'),
        new SlashCommandBuilder().setName('updatevent').setDescription('Updates a study sesh embed with new info')
        .addStringOption(option =>
            option.addChoices(
                {name: '106F', value: '106F'},
                {name: '106G', value: '106G'},
                {name: '106H', value: '106H'},
                {name: '106J', value: '106J'},
                {name: '106K', value: '106K'},
                {name: '106E', value: '106E'},
                {name: '221E', value: '221E'},
                {name: '221G', value: '221G'},
                {name: '221H', value: '221H'},
                {name: '221J', value: '221J'},
                {name: '221K', value: '221K'},
            )
            .setName('room')
            .setDescription('where is this event taking place?')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('starttime')
            .setDescription('when is the event taking place?')
            .setRequired(true))
        .addStringOption(option =>
            option.addChoices(
                {name: '106F', value: '106F'},
                {name: '106G', value: '106G'},
                {name: '106H', value: '106H'},
                {name: '106J', value: '106J'},
                {name: '106K', value: '106K'},
                {name: '106E', value: '106E'},
                {name: '221E', value: '221E'},
                {name: '221G', value: '221G'},
                {name: '221H', value: '221H'},
                {name: '221J', value: '221J'},
                {name: '221K', value: '221K'},
            )
            .setName('newroom')
            .setDescription('where is the updated event taking place?')
            .setRequired(false))
        .addStringOption(option =>
            option.setName('newstarttime')
            .setDescription('when is the updated event expected to start?')
            .setRequired(false))
        .addStringOption(option =>
            option.setName('newendtime')
            .setDescription('when is the updated event expected to end?')
            .setRequired(false))
        .addStringOption(option =>
            option.setName('newdescription')
            .setDescription('whhat is the updated description for the event?')
            .setRequired(false))
        .addStringOption(option =>
            option.setName('newname')
            .setDescription('what is the updated name for the event?')
            .setRequired(false)), 
        new SlashCommandBuilder().setName('scrape').setDescription('Scrape latest dates and times from UH website.')
    ]	