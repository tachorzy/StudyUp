import { EmbedBuilder } from "discord.js"

//creates a help embed for all commands
export function help(){
    const ownerid = '<@107022278838996992>'
    const coownerid = '<@220536344848498690>'
    const coownerid2 = '<@242075681046003743>'

    const aestheticThumbnail = 'https://data.whicdn.com/images/323756483/original.gif'
    const typescriptLogo = 'https://pbs.twimg.com/profile_images/1290672565690695681/0G4bie6b_400x400.jpg'

    const helpembed = new EmbedBuilder()
        .setColor('#faf7f8')
        .setTitle('Meet Up With StudyUp')
        .setDescription(`Brought to you by ${ownerid}, ${coownerid} and ${coownerid2}`)
        .setThumbnail(aestheticThumbnail)
        .addFields(
            {name: 'What is StudyUp?', value: 'StudyUp is a bot made for bringing you and your classmates together outside of the classroom. Form study groups, '
            + 'study sessions, watch parties and more with the commands below!'},
            {name: ':loudspeaker: /addevent', value: 'Schedule a server event'},
            {name: ':exclamation: /ping', value: 'Notify an event\'s participants with an important announcement.'},
            {name: ':no_entry_sign: /delevent (coming soon)', value: 'Close a scheduled event.'},
            {name: ':placard: /updatevent (coming soon)', value: 'Use to announce an upcoming event.'},
            {name: ':hourglass: /schedule (coming soon)', value: 'Schedule a recurring meeting for either a daily, weekly, biweekly or custom basis'},
        )
        .setFooter({text: 'developed in TypeScript', iconURL: typescriptLogo})
    return helpembed;
}