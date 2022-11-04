import fetch from 'cross-fetch';
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
            "body": "iid=4043&gid=6713&capacity=0&date=2022-11-04&slots=",
            "method": "POST"
    });

    //fs.writeFile('./scrapedData.txt', await data.text(), { flag: 'w+' }, err => { console.log(err) });
    //console.log(await data.text());

    return data;
}

export default classScraper;