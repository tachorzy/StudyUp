import { Client, EmbedBuilder, Routes, GuildScheduledEvent, GuildScheduledEventStatus, Events, MessageComponentInteraction, MessageComponent, ButtonInteraction } from "discord.js";
import { token, clientId, REST } from '../Bot';
import { commands } from "../utils/slashCommands";
import { createEvent, createEventEmbed } from"../command/createEvent";
import { listEventsEmbed } from "../command/listEvents";
import { announcement } from "../command/announcement";
import { help } from "../command/help";
import { scheduleRecuringEvent } from "../command/scheduleEvent";
import { printPage, editPage } from "../command/map";

//discord bot formality or otherwise called event handling
export default (client: Client): void => {
    const rest = new REST({ version: '10' }).setToken(token);

    rest.put(Routes.applicationCommands(clientId), { body: commands })
        .then((data: any) => console.log(`Successfully registered ${data.length} application commands.`)) //using any for all your types is redundant cuz thats literally just js
        .catch(console.error);
        
    //upon an interaction via slash command
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
    
        const { commandName } = interaction;
        let embed: EmbedBuilder | undefined;
        switch(commandName){
            case 'addevent':
                const event = await createEvent(interaction);

                let endTime = interaction.options.getString('endtime') as string
                //create an invite link alongside the creation of an event and pass that as a parameter to the createEventEmbed function so that we can add the invite as a link to the Embed.
                event?.createInviteURL({channel: interaction.channelId}).then(invite => {
                    createEventEmbed(interaction, new Date(endTime), event, invite)
                })
                break;
            case 'ping':
                await announcement(interaction);
                break;
            case 'events':
                embed = await listEventsEmbed(interaction);
                if(!embed)
                    interaction.reply('There doesn\'t seem to be any scheduled events currently. Check again later!');
                interaction.reply({embeds: [embed]})
                break;
            case 'help':
                await interaction.reply({embeds: [help()]})
                break;
            case 'schedule':
                const scheduledEvent: GuildScheduledEvent<GuildScheduledEventStatus> | undefined = await scheduleRecuringEvent(interaction);
                console.log(scheduledEvent)
                
                let scheduledEndTime = interaction.options.getString('endtime') as string

                scheduledEvent?.createInviteURL({channel: interaction.channelId}).then(invite => {
                    createEventEmbed(interaction, new Date(scheduledEndTime) ,scheduledEvent, invite)
                })               
                break;
            case 'map':
                printPage(interaction)
                client.on("interactionCreate", buttonInteraction => {
                    if(!buttonInteraction.isButton()) return
                    
                    if(buttonInteraction.customId === 'first-page')
                        editPage(interaction, 0)
                    else if(buttonInteraction.customId === 'second-page')
                        editPage(interaction, 1)
                    else if(buttonInteraction.customId === 'third-page')
                        editPage(interaction, 2)

                    buttonInteraction.deferUpdate()
                })
                break;
        }
    });

    //When an event is deleted we send a message
    client.on('guildScheduledEventDelete', async event => {
        //new code goes here
    });

    //When a reaction added, DM Link to user (WIP)
    client.on('messageReactionAdd', async reaction => {
        const embed = reaction.message.embeds.at(0);
        if(await reaction.emoji.name === '👍'){
            //new code goes here
        }
    });
}