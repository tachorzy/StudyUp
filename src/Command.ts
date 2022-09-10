import { embedAuthorPredicate } from "@discordjs/builders/dist/messages/embed/Assertions";
import { Client, EmbedBuilder, Routes, ChatInputCommandInteraction } from "discord.js";
import BodyReadable from "undici/types/readable";
import { token, clientId, guildId, REST } from './Bot';
import { commands } from "./Commands";
// import AddEvent from "./Commands/AddEvent";

export default (client: Client): void => {
    const rest = new REST({ version: '10' }).setToken(token);

    rest.put(Routes.applicationCommands(clientId), { body: commands })
        .then((data: any) => console.log(`Successfully registered ${data.length} application commands.`)) //using any for all your types is redundant cuz thats literally just js
        .catch(console.error);
    
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
    
        const { commandName } = interaction;
        var embed: EmbedBuilder;
        
        switch(commandName){
            case 'addevent':
                embed = AddEvent(interaction);
                await interaction.reply({embeds: [embed]});
                break;
            case 'help':
                await interaction.reply({embeds: [help()]})
                break;
        }
    });
}

//AddEvent function creates embed for a new event from information received through a slash command
function AddEvent (interaction: ChatInputCommandInteraction) {
    const eventType = interaction.options.getString('type');
    const title = interaction.options.getString('title');
    const room = interaction.options.getString('room');
    const capacity = interaction.options.getString('capacity');
    const time = interaction.options.getString('time');
    const date = interaction.options.getString('date');
    const details = interaction.options.getString('description');
    const host: string = interaction.user.id;
    
    //room emote image will change depending on the building you choose
    var roomEmote = '<:StudyRoom2:1017865348457975838>'
    if(room?.includes('PGH') || room?.includes('pgh'))
        roomEmote = '<:pgh:1017868374040129588>'
    else if(room?.includes('Quad') || room?.includes('QUAD'))
        roomEmote = '<:quad:1017871428055486624>'

    const embed = new EmbedBuilder()
        .setColor('#32a852')
        .setTitle(`${eventType} | ${title} :notebook_with_decorative_cover:`)
        .setDescription(details)
        .addFields(
            { name: "ROOM:", value: `${roomEmote + " " + room}`, inline: true },
            { name: "TIME:", value: `${time}`, inline: true },
            { name: "DATE:", value: `${date}`, inline: true },
            { name: "HOST:", value: `<@${host}>`, inline: true },
        )
        .setThumbnail('https://i.imgur.com/XX8tyb3.png')
        .setFooter({text : '🚿 please for the love of the CS department, shower :)'})
    
    //only add the capacity to the embed when there's an input for it.
    if(capacity !== null)
            embed.addFields({ name: "ROOM CAPACITY:", value: `**${capacity}** participants`, inline: true })
    return embed;
}

function help(){
    const ownerid = '<@107022278838996992>'

    const helpembed = new EmbedBuilder()
        .setColor('#32a852')
        .setTitle('Meet Up With StudyUp')
        .setDescription(`Brought to you by ${ownerid}`)
        .setThumbnail('https://data.whicdn.com/images/323756483/original.gif')
        .addFields(
            {name: 'What is StudyUp?', value: 'StudyUp is a bot made for bringing you and your classmates together outside of the classroom. Form study groups, '
            + 'study sessions, watch parties and more with the commands below!'},
            {name: ':loudspeaker: addevent', value: 'Announce an upcoming event'},
            {name: ':no_entry_sign: delevent', value: 'Close an event invitation'},
            {name: ':placard: updatevent', value: 'Use to announce an upcoming event'},
            {name: ':hourglass: schedule', value: 'Schedule a recurring meeting for either a daily, weekly, biweekly or custom basis'},
        )
        .setFooter({text: 'developed in TypeScript', iconURL: 'https://pbs.twimg.com/profile_images/1290672565690695681/0G4bie6b_400x400.jpg'})
    return helpembed;
}