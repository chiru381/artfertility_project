import dayjs from 'dayjs';
import { appointments } from './appointments';

const currentDate = dayjs();
let date = currentDate.date();

const makeTodayAppointment = (startDate: any, endDate: any, index: number) => {

    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + (index % 7); // last day is the first day + 6

    var day = new Date(curr.setDate(last)).getDate();

    const nextStartDate = dayjs(startDate)
        .year(currentDate.year())
        .month(currentDate.month())
        .date(day);

    const nextEndDate = dayjs(endDate)
        .year(currentDate.year())
        .month(currentDate.month())
        .date(day);

    return {
        startDate: nextStartDate.toDate(),
        endDate: nextEndDate.toDate(),
    };
};

export const weeklyAppointment = appointments.map(({ startDate, endDate, ...restArgs }, index) => {
    const result = {
        ...makeTodayAppointment(startDate, endDate, index),
        ...restArgs
    };
    date += 1;
    if (date > 31) date = 1;
    return result;
});
