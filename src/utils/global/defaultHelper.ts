import dayjs from "dayjs";
import en from 'dayjs/locale/en';
import { getApiDate } from ".";

export function getAppointmentFromToDate(date: any, viewName: string) {
    let defaultDay = dayjs().get('day');
    let selectedDate = viewName === "Month" ? dayjs(date).startOf('month').toDate() : viewName === "Day" ? dayjs(date).toDate() : dayjs(date).locale({ ...en, weekStart: defaultDay }).startOf('week').toDate();

    let params = {
        selectedDate: selectedDate,
        fromDateTime: getApiDate(selectedDate),
        toDateTime: getApiDate(viewName === "Month" ? dayjs(date).endOf('month').toDate() : dayjs(selectedDate).add(viewName === "Day" ? 0 : 6, "day").toDate()),
    }

    return params;
}