import dayjs from "dayjs";
import { getDayName } from "utils/constants";


export function checkIsTimeSlotBlocked(startDate: any, endDate: any, slotConfigData: { [key: string]: any }[], SlotBlockData: { [key: string]: any }[]) {
    let df = 'YYYY-MM-DD';
    let tf = 'HH:mm';
    let nowDate = dayjs().format(df);
    let slotDate = dayjs(startDate).format(df);

    let slotStartTime = dayjs(startDate).format(tf);
    let slotEndTime = dayjs(endDate).format(tf);
    let nowTime = dayjs().format(tf);

    if (dayjs(slotDate).isBefore(nowDate)) {
        return true;
    } else if (dayjs(slotDate).isSame(nowDate) && (dayjs(slotStartTime, tf).isBefore(dayjs(nowTime, tf)))) {
        return true;
    } else {
        for (let i = 0; i < slotConfigData.length; i++) {
            let selectedDay = slotConfigData[i]?.operatingTheatreSlotConfigDetails?.find((slotConfig: any) => dayjs(startDate).format('ddd') === getDayName(slotConfig.dayOfWeekNumber));
            if (selectedDay) {
                let resourceFromDate = dayjs(slotConfigData[i].fromDate).format(df);
                let resourceToDate = dayjs(slotConfigData[i].toDate).format(df);

                if (dayjs(slotDate).isBefore(resourceFromDate) || dayjs(slotDate).isAfter(resourceToDate)) {
                    return true;
                } else if (selectedDay) {
                    let resourceFromTime = dayjs(selectedDay.fromTime, 'hh:mm:ss').format(tf);
                    let resourceToTime = dayjs(selectedDay.toTime, 'hh:mm:ss').format(tf);

                    if (selectedDay?.isExcluded) {
                        return true;
                    } else if (dayjs(slotStartTime, tf).isBefore(dayjs(resourceFromTime, tf)) || dayjs(slotStartTime, tf).isAfter(dayjs(resourceToTime, tf))) {
                        return true;
                    }
                }
            }
        }
    }


    for (let i = 0; i < SlotBlockData.length; i++) {
        let slotBlockFromDate = dayjs(SlotBlockData[i].fromDate).format(df);
        let slotBlockToDate = dayjs(SlotBlockData[i].toDate).format(df);

        let slotBlockFromTime = dayjs(SlotBlockData[i].fromTime, 'HH:mm:ss').format(tf);
        let slotBlockToTime = dayjs(SlotBlockData[i].toTime, 'HH:mm:ss').format(tf);

        if ((dayjs(slotBlockFromDate).isSame(slotDate) || dayjs(slotBlockToDate).isSame(slotDate)) || (dayjs(slotDate).isAfter(slotBlockFromDate) && dayjs(slotDate).isBefore(slotBlockToDate))) {
            if ((dayjs(slotBlockFromTime, tf).isSame(dayjs(slotStartTime, tf)) || dayjs(slotStartTime, tf).isBefore(dayjs(slotBlockToTime, tf))) &&
                (dayjs(slotBlockToTime, tf).isSame(dayjs(slotEndTime, tf)) || dayjs(slotEndTime, tf).isAfter(dayjs(slotBlockFromTime, tf)))) {
                return true;
            }
        }

    }

    return false;
}


export function checkOverlappedSlot(startDate: any, endDate: any, appointmentData: { [key: string]: any }[], appointmentId?: number) {
    let df = 'YYYY-MM-DD';
    let tf = 'HH:mm';
    let slotDate = dayjs(startDate).format(df);

    let slotStartTime = dayjs(startDate).format(tf);
    let slotEndTime = dayjs(endDate).format(tf);

    for (let i = 0; i < appointmentData.length; i++) {
        let appointmentDate = dayjs(appointmentData[i].appointmentDateTime).format(df);
        let resourceFromTime = appointmentData[i].estimatedAppointmentFromTime;
        let resourceToTime = appointmentData[i].estimatedAppointmentToTime;

        if (dayjs(appointmentDate).isSame(slotDate) && (appointmentId ? (appointmentId !== appointmentData[i].id) : true)) {
            if ((dayjs(resourceFromTime, tf).isSame(dayjs(slotStartTime, tf)) || dayjs(resourceFromTime, tf).isBefore(dayjs(slotStartTime, tf))) &&
                (dayjs(resourceToTime, tf).isSame(dayjs(slotEndTime, tf)) || dayjs(resourceToTime, tf).isAfter(dayjs(slotEndTime, tf)))) {
                return true;
            }
        }
    }

    return false;
}