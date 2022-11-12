import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Interaction, CacheType } from "discord.js";

//prints the first page by default, takes in the slash command interaction and the page number (from the button)
export function printPage(interaction: ChatInputCommandInteraction, page=0){
    interaction.reply({ embeds: [embedPages[page]], components: [rowList[page]] })
}

//edits the reply given, same format as above
export function editPage(interaction: ChatInputCommandInteraction, page=0){
    interaction.editReply({ embeds: [embedPages[page]], components: [rowList[page]] })
}

//handles ButtonInteractions based on ids
export function buttonInteractionHandler(buttonInteraction: Interaction<CacheType>, interaction: ChatInputCommandInteraction){
    if(!buttonInteraction.isButton()) return
                    
    if(buttonInteraction.customId === 'first-page')
        editPage(interaction, 0)
    else if(buttonInteraction.customId === 'second-page')
        editPage(interaction, 1)
    else if(buttonInteraction.customId === 'third-page')
        editPage(interaction, 2)

    buttonInteraction.deferUpdate()
}

//Creating the array of Embeds, one for each floor in the library.
export const embedPages: any = [
    new EmbedBuilder()
        .setColor('#df2323')
        .setTitle('MD Anderson Library')
        .addFields(
        {
            name: '1st Floor',
            value: 'The Red Wing group study rooms are seen on the left and are available through booking only.'
        })
        .setImage('https://i.imgur.com/G7UXVUw.png'),
    new EmbedBuilder()
        .setColor('#df2323')
        .setTitle('MD Anderson Library')
        .addFields(
            {
                name: '2nd Floor',
                value: 'Group Study Rooms can be found left of the main staircase and then immediately on your right. They are only available through booking.'
            })
        .setImage('https://i.imgur.com/yZoeaLj.png'),
    new EmbedBuilder()
        .setColor('#df2323')
        .setTitle('MD Anderson Library')
        .addFields(
            {
                name: '3rd Floor ~~Brown Matrimonial Services~~ ',
                value: 'Group Study Rooms are available here on a first come first serve basis. In both the Red and Brown Wings.'
            })
        .setImage('https://i.imgur.com/ebvxJEN.png')
]

//Array of ActionRows, there's a unique row per page. The current page's button will have the Primary Style (blurple) and the others are Secondary (grey)
export const rowList: any =  [
    new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('first-page')
            .setLabel('First Floor')
            .setStyle(ButtonStyle.Danger)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('second-page')
            .setLabel('Second Floor')
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('third-page')
            .setLabel('Third Floor')
            .setStyle(ButtonStyle.Secondary)
    ),

    new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('first-page')
            .setLabel('First Floor')
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('second-page')
            .setLabel('Second Floor')
            .setStyle(ButtonStyle.Danger)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('third-page')
            .setLabel('Third Floor')
            .setStyle(ButtonStyle.Secondary)
    ),

    new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId('first-page')
            .setLabel('First Floor')
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('second-page')
            .setLabel('Second Floor')
            .setStyle(ButtonStyle.Secondary)
    )
    .addComponents(
        new ButtonBuilder()
            .setCustomId('third-page')
            .setLabel('Third Floor')
            .setStyle(ButtonStyle.Danger)
    )
]