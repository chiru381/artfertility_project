import { useState, useEffect, memo } from 'react';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import dayjs from 'dayjs';
import Button from '@material-ui/core/Button';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Typography from '@material-ui/core/Typography';
import Schedule from '@material-ui/icons/Schedule';

import Phone from '@material-ui/icons/Phone';
import Person from '@material-ui/icons/Person';
import AccountBox from '@material-ui/icons/AccountBox';
import { ReactComponent as StethoscopeIcon } from 'assets/images/icons/stethoscope.svg';

const options = [
    // { label: "Patient Medical Record", value: 0 },
    { label: "Confirm appointment", value: 1 },
    { label: "Cancel appointment", value: 2 },
    { label: "Mark Patient Arrived", value: 3 },
    { label: "Start Consultation", value: 4 },
    { label: "End Consultation", value: 5 },
    { label: "Reschedule appointment", value: 6 },
    { label: "Go to Patient EMR", value: 7 },
    { label: "Patient Appointment History", value: 8 },
]


export const LayoutComponent = memo((props: any) => {
    const { appointmentByDateData, appointmentData, onSelectAppointmentAction, onHide } = props;
    const [appointment, setAppointment] = useState<any>({});
    const [appointmentOptions, setAppointmentOptions] = useState<any>([]);


    useEffect(() => {
        let { id, isArrived, isConfirmed, isCancelled, isConsultationStart, isConsultationEnd, endDate, doctorId, patientId } = appointmentData;
        let selectedAppointment = appointmentByDateData.find((appointment: any) => +appointment.id === +id);

        let df = 'YYYY-MM-DD';
        let tf = 'HH:mm';
        let nowDate = dayjs().format(df);
        let nowTime = dayjs().format(tf);
        let slotEndTime = dayjs(endDate).format(tf);
        let slotDate = dayjs(endDate).format(df);

        let isSlotBlocked = dayjs(slotDate).isBefore(nowDate) || (dayjs(slotDate).isSame(nowDate) && dayjs(slotEndTime, tf).isBefore(dayjs(nowTime, tf)));
        let isToday = dayjs(slotDate).isSame(nowDate);

        if (selectedAppointment) {
            setAppointment(selectedAppointment);
        }

        let appointmentOptions: any = [];

        if (isConsultationEnd || isSlotBlocked || isCancelled) {
        } else if (isConsultationStart) {
            appointmentOptions = [options[4]];
        } else if (isArrived) {
            appointmentOptions = isToday && doctorId ? [options[3]] : [];
        } else if (isConfirmed) {
            appointmentOptions = isToday ? doctorId ? [options[1], options[2]] : [options[2]] : doctorId ? [options[1]] : [];
        } else {
            appointmentOptions = doctorId ? [options[0], options[5], options[1]] : [options[0], options[5]];
        }
        setAppointmentOptions([...appointmentOptions, ...selectedAppointment?.patientId ? [options[6], options[7]] : []]);

    }, []);

    function onSelectOptions(value: number) {
        onSelectAppointmentAction(value, appointment);
        if (onHide) {
            onHide();
        }
    }

    return (
        <div>
            <Box mx={2} mb={2} mt={1}>
                {appointment?.appointmentDateTime && (
                    <Box p={1} style={{ border: "1px solid rgba(0,0,0,0.2)", borderRadius: "5px" }}>
                        <Typography variant="subtitle1">
                            <Box fontWeight="fontWeightBold" component="span">
                                {`${appointment.appointmentNumber} - `}
                            </Box>
                            <Typography variant="caption" component="span">
                                {appointment.visitTypeName}
                            </Typography>
                        </Typography>

                        <Typography variant="caption">{dayjs(appointment.appointmentDateTime).format('dddd, MMMM DD, YYYY')}</Typography>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <Schedule fontSize={"small"} style={{ marginRight: "4px" }} />
                            <Typography variant="caption">{dayjs(appointment?.estimatedAppointmentFromTime, 'HH:mm:ss').format('hh:mm A')} - {dayjs(appointment?.estimatedAppointmentToTime, 'HH:mm:ss').format('hh:mm A')}</Typography>
                        </div>

                        <Grid container spacing={1} style={{ marginTop: "10px" }}>
                            {appointment?.patientUHID && <Grid item xs={6} style={{ display: "flex", alignItems: "center" }} >
                                <AccountBox htmlColor="#1AA659" fontSize={"small"} style={{ marginRight: "5px" }} />
                                <Typography variant="caption">{appointment.patientUHID}</Typography>
                            </Grid>}
                            <Grid item xs={6} style={{ display: "flex", alignItems: "center" }} >
                                <Person htmlColor="#1AA659" fontSize={"small"} style={{ marginRight: "5px" }} />
                                <Typography variant="caption">{appointment.patientFullName}</Typography>
                            </Grid>
                            <Grid item xs={6} style={{ display: "flex", alignItems: "center" }} >
                                <Phone htmlColor="#1AA659" fontSize={"small"} style={{ marginRight: "5px" }} />
                                <Typography variant="caption">{appointment.telephone}</Typography>
                            </Grid>
                            {appointment.medicalStaffUserDisplayName && (
                                <Grid item xs={6} style={{ display: "flex", alignItems: "center" }} >
                                    <StethoscopeIcon fill="#1AA659" style={{ width: "20px", marginRight: "5px" }} />
                                    <Typography variant="caption">Dr. {appointment.medicalStaffUserDisplayName}</Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                )}

                {appointmentOptions.length !== 0 && (
                    <Box mt={2}>
                        <Grid container spacing={1}>
                            {appointmentOptions.map((option: any, index: number) => (
                                <Grid key={index} item xs={12}>
                                    <Button
                                        style={{ justifyContent: "space-between" }}
                                        fullWidth
                                        endIcon={<ChevronRight />}
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => onSelectOptions(option.value)}
                                    >{option.label}</Button>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

            </Box>
        </div>
    )
})