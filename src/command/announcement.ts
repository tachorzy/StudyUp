import { ChatInputCommandInteraction, EmbedBuilder, GuildScheduledEvent } from "discord.js";

// Make an announcement to all the participants of an event (WIP)
export async function announcement(interaction: ChatInputCommandInteraction){
    //finds the event from the discord server's event collection
    let event: GuildScheduledEvent | undefined;
    const eventsCollection = await interaction.guild?.scheduledEvents.fetch();
    eventsCollection?.forEach((e: GuildScheduledEvent) => {
        if(e.id == interaction.options.getString('id')) event = e;
    })
    
    if(event === undefined) return;
    //embed setup
    let userTags: string = '';
    let msg: string | null = interaction.options.getString('message');
    
    if(msg === null) return;

    let embed = new EmbedBuilder()
        .setColor('#ff2f3d')
        .setTitle(`ANNOUNCEMENT FOR ${event.name}`)
        .setFooter({text: `🚿 and as always please stay showered\n\nEventId: ${event.id}`})
        .addFields({name: 'UPDATE:', value: `${msg}`, inline: true })
        .setThumbnail('https://media4.giphy.com/media/aq7tOXIdgaVbGgojK1/giphy.gif?cid=790b7611c7d7f72b6533626d278c0c6d37b9caf5ff933152&rid=giphy.gif&ct=s')
    
    //gathering user tags to ping
    const participants = Promise.resolve(event?.fetchSubscribers());
    
    if(participants == null)
        interaction.reply('This event currently has no participants.')

    await participants.then((subs) => { subs.forEach(sub => userTags += `${sub.user} `) });
    embed.addFields({name: 'NOTIFYING:', value: `${userTags}`, inline: false })
    
    interaction.reply({embeds: [embed]});
}