import { ChatInputCommandInteraction, GuildScheduledEvent } from "discord.js";
import { createEvent } from "./createEvent";

const cronJob = require('node-cron');

export async function scheduleRecuringEvent(interaction: ChatInputCommandInteraction){    
    let localInteraction = interaction
    let dayOfWeek = interaction.options.getString('day_of_the_week');
    let event: GuildScheduledEvent | undefined;
    //first param: second (optional), second param: minute, third param: hour, fourth param: day of month, fifth param: month, sixth param: day of week
    cronJob.schedule(`0 0 0 * * ${dayOfWeek}`, async () => {
        console.log('CRON JOB: scheduling an event')
        event = await createEvent(localInteraction);
        return event;
    });
    return event;
}