import dayjs from "dayjs";

export function getApiDate(date: any){
    let d = dayjs(date).format('YYYY-MM-DDTHH:mm');
    return `${d}:00Z`
}

export function formatApiDate(date: any){
    if(typeof date === "string"){
        let removeTimeZone = date.replace(':00Z', '');
        return dayjs(removeTimeZone).toDate();
    }else{
        return date;
    }
}