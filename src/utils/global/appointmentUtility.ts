import dayjs from "dayjs";

export const formatDayScaleDate = (date: any, options: any) => {
    const momentDate = dayjs(date);
    const { weekday } = options;
    return weekday ? momentDate.format('ddd DD MMM') : '';
};