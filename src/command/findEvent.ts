import { ChatInputCommandInteraction, GuildScheduledEvent } from "discord.js";

export async function findGuildScheduledEvent(interaction: ChatInputCommandInteraction){
    const eventsCollection = await interaction.guild?.scheduledEvents.fetch();
    eventsCollection?.forEach((e: GuildScheduledEvent) => {
        if(e.id == interaction.options.getString('id')) return e;
    })
    return undefined;
}