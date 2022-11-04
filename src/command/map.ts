import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, ActionRow } from "discord.js";
import { client } from "src/Bot";

//prints the first page by default, takes in the slash command interaction and the page number (from the button)
export function printPage(interaction: ChatInputCommandInteraction, page=0){
    interaction.reply({ embeds: [embedPages[page]], components: [rowList[page]] })
}

//edits the reply given, same format as above
export function editPage(interaction: ChatInputCommandInteraction, page=0){
    interaction.editReply({ embeds: [embedPages[page]], components: [rowList[page]] })
}

//Creating the array of Embeds, one for each floor in the library.
export const embedPages: any = [
    new EmbedBuilder()
        .setColor('#32a852')
        .setTitle('MD Anderson Library')
        .addFields(
        {
            name: '1st Floor',
            value: 'The Red Wing group study rooms are seen on the left and are available through booking only.'
        })
        .setImage('https://i.imgur.com/G7UXVUw.png'),
    new EmbedBuilder()
        .setColor('#32a852')
        .setTitle('MD Anderson Library')
        .addFields(
            {
                name: '2nd Floor',
                value: 'Group Study Rooms can be found left of the main staircase and then immediately on your right. They are only available through booking.'
            })
        .setImage('https://i.imgur.com/yZoeaLj.png'),
    new EmbedBuilder()
        .setColor('#32a852')
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
            .setStyle(ButtonStyle.Primary)
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
            .setStyle(ButtonStyle.Primary)
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
            .setStyle(ButtonStyle.Primary)
    )
]