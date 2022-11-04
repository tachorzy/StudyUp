import { ChatInputCommandInteraction, EmbedBuilder, GuildScheduledEvent } from "discord.js";

//function to list out all ongoing events
export async function listEventsEmbed(interaction: ChatInputCommandInteraction){
    const embed = new EmbedBuilder();

    let events: GuildScheduledEvent[] = [];
    const eventsCollection = await interaction.guild?.scheduledEvents.fetch();
    if(!eventsCollection) return embed;
    eventsCollection.forEach((e: GuildScheduledEvent) => {events.push(e)});
    
    embed
        .setColor('#32a852')
        .setTitle(`<a:NOTED:1032271325907128380> Study Groups for ${interaction.guild?.name} <a:NOTED:1032271325907128380>`)
        .setDescription('Find a group for you!')
        .setThumbnail('https://media.tenor.com/31Y1Gw8Zd98AAAAC/anime-write.gif');
    
    if(events.length == 0)
        embed.addFields({ name: "There seems to not be any events currently.", value: 'Check again later!', inline: true })
    
    events.forEach((e: GuildScheduledEvent) => {
        embed.addFields({
            name: `${e.name}`, value: `${e.description}\n**Time:** ${e.scheduledStartAt}-${e.scheduledEndAt}\n**Host:** ${e.creator}\n**Set a Reminder!**\n${e.url}`
        })
    })
    
    return embed;
}