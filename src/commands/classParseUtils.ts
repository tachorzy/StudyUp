import { parse } from 'node-html-parser';
import classScraper from './classScraper';


export interface Room {
    name: string,
    dateTime: Date[][]
}

export const parseDates = async () => {

    let dates: Date[] = [];

    // Parse all html from classScraper()
    const root = parse(await (await classScraper()).text());

    // Get all date options, convert into Date objects, and push into dates[]
    let dateOptions = root.getElementById("date").getElementsByTagName("option");
    for (let i of dateOptions) {
        dates.push(new Date(i.attributes.value));
    }

    console.log(dates);

    return dates;

}

export const parseTimes = async () => {

    // Array of Room arrays, each child array signifies a room with all possible time ranges
    let times: Date[][] = [];

    // Parse all html from classScraper()
    const root = parse(await (await classScraper()).text());

    // Get all time options, convert into Date arrays, and push into times[]
    let timeOptions = root.getElementsByTagName('label');
    console.log("Number of bookings available: " + timeOptions.length);
    for (let i of timeOptions) {
        // Remove all line breaks and spaces
        let dateTime = i.text.replace(/(\r\n|\n|\r)/gm, "").trim();
        // Split into array for easier Date conversion
        let dateTimeArr = dateTime.split(" ");
        // Create Date array and push into times[]
        times.push(
            [
                new Date(
                    Number(dateTimeArr[6]), 
                    new Date(`${dateTimeArr[4]} 1, 2022`).getMonth() + 1,
                    Number(dateTimeArr[5][0]), 
                    Number(dateTimeArr[0].substr(0, dateTimeArr[0].indexOf(':'))),
                    dateTimeArr[0].substring(dateTimeArr[0].indexOf(':') + 1).slice(0, -2) == "00" ? 0 : Number(dateTimeArr[0].substring(dateTimeArr[0].indexOf(':') + 1).slice(0, -2))
                ),
                new Date(
                    Number(dateTimeArr[6]), 
                    new Date(`${dateTimeArr[4]} 1, 2022`).getMonth() + 1,
                    Number(dateTimeArr[5][0]), 
                    Number(dateTimeArr[2].substr(0, dateTimeArr[0].indexOf(':'))),
                    dateTimeArr[0].substring(dateTimeArr[0].indexOf(':') + 1).slice(0, -2) == "00" ? 0 : Number(dateTimeArr[0].substring(dateTimeArr[0].indexOf(':') + 1).slice(0, -2))
                )
            ]
        );
    }
}