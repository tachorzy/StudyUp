import fetch from 'cross-fetch';
import { parse } from 'node-html-parser';
//import fs from 'fs';

// Make an HTTP request with specified headers to UH website
const classScraper = async () => {
    let data = await fetch("https://uh.libcal.com/widget/equipment/ajax/display", {
            "headers": {
            "accept": "text/html, */*; q=0.01",
            "accept-language": "en-US,en;q=0.5",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "sec-gpc": "1",
            "x-requested-with": "XMLHttpRequest",
            "Referer": "https://uh.libcal.com/widget/equipment?gid=6713&eid=0&iid=4043",
            "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            "body": "iid=4043&gid=6713&capacity=0&date=2022-11-05&slots=",
            "method": "POST"
    });

    //fs.writeFile('./scrapedData.txt', await data.text(), { flag: 'w+' }, err => { console.log(err) });
    //console.log(await data.text());

    return data;
}

// Room type
export interface Room {
    name: string,
    capacity: number,
    dateTime?: Date[][]
}

// Helper functions
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

export const parseRooms = async () => {

    // Array of Room arrays, each child array signifies a room with all possible time ranges
    let rooms: Room[] = [];

    // Parse all html from classScraper()
    const root = parse(await (await classScraper()).text());

    // Find name and capacity of available rooms and populate rooms array
    let roomOptions = root.querySelectorAll('.panel-heading');
    for (let i of roomOptions) {
        const roomInfo = i.innerText.replace(/(\r\n|\n|\r)/gm, "").trim().split(/\s+/);
        rooms.push({
            name: roomInfo[0],
            capacity: Number(roomInfo[2]),
        });
    }

    console.log(rooms);

    return rooms;
}

export const parseTimes = async () => {

    // Parse all html from classScraper()
    console.log(await (await classScraper()).text())
    const root = parse(await (await classScraper()).text());

    let times: Date[][] = [];

    // Get all time options, convert into Date arrays, and push into times[]
    let timeOptions = root.getElementsByTagName('label');

    for (let i of timeOptions) {
        // Remove all line breaks and spaces
        let dateTime = i.text.replace(/(\r\n|\n|\r)/gm, "").trim();
        // Split into array for easier Date conversion
        let dateTimeArr = dateTime.split(" ");
        console.log(dateTime);
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

    console.log(times.length)
}

export default parseTimes;