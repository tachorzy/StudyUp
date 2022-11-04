//helper functions for converting DATE between ISO and plain-English
export function ISOToEnglishDate(oldDate) {
    const tempDate = new Date(oldDate);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];            
    const year    = tempDate.getFullYear(); 
    const month   = tempDate.getMonth();
    const day     = tempDate.getDate(); 

    const shownDate: string = `${months[month]} ${day}, ${year}`
                 
    return shownDate;
}

 //helper function to convert TIME from ISO to plain-English
export function ISOToEnglishTime(oldTime) {
    let shownTime: string;
    const tempTime = new Date(oldTime);
    let hours: number   = tempTime.getHours();
    let mins: number | string   = tempTime.getMinutes();  
    
    if (mins < 10)
        mins = `0${mins}`
    if(hours > 12)
        shownTime = `${hours-12}:${mins} PM`
    else
        shownTime = `${hours}:${mins} AM`
    return shownTime;
}