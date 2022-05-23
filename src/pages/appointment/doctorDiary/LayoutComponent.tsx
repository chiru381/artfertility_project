import { useState, useEffect, memo } from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import dayjs from "dayjs";
import Button from "@material-ui/core/Button";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Typography from "@material-ui/core/Typography";
import Schedule from "@material-ui/icons/Schedule";

import Phone from "@material-ui/icons/Phone";
import Person from "@material-ui/icons/Person";
import AccountBox from "@material-ui/icons/AccountBox";
import { ReactComponent as StethoscopeIcon } from "assets/images/icons/stethoscope.svg";

const options = [
	{ label: "Start Consultation", value: 1 },
	{ label: "End Consultation", value: 2 },
	{ label: "Go to Patient EMR", value: 3 },
	{ label: "Patient Appointment History", value: 4 },
];

export const LayoutComponent = memo((props: any) => {
	const {
		appointmentByDateData,
		appointmentData,
		onSelectAppointmentAction,
		onHide,
	} = props;
	const [appointment, setAppointment] = useState<any>({});
	const [appointmentOptions, setAppointmentOptions] = useState<any>([]);

	useEffect(() => {
		let {
			id,
			isArrived,
			isConsultationStart,
			isConsultationEnd,
			endDate,
			doctorId,
		} = appointmentData;
		let selectedAppointment = appointmentByDateData.find((appointment: any) =>
			appointment?.surgeryId
				? `OT${appointment.id}` === id
				: +appointment.id === +id
		);

		let df = "YYYY-MM-DD";
		let nowDate = dayjs().format(df);
		let slotDate = dayjs(endDate).format(df);
		let isToday = dayjs(slotDate).isSame(nowDate);

		if (selectedAppointment) {
			setAppointment(selectedAppointment);
		}

		let appointmentOptions: any = [];
		if (isArrived && !isConsultationStart && isToday && doctorId) {
			appointmentOptions = [options[0]];
		} else if (isConsultationStart && !isConsultationEnd && doctorId) {
			appointmentOptions = [options[1]];
		}
		setAppointmentOptions([
			...appointmentOptions,
			...(selectedAppointment?.patientId ? [options[2], options[3]] : []),
		]);
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
					<Box
						p={1}
						style={{ border: "1px solid rgba(0,0,0,0.2)", borderRadius: "5px" }}
					>
						<Typography variant="subtitle1">
							<Box fontWeight="fontWeightBold" component="span">
								{`${appointment.appointmentNumber} - `}
							</Box>
							<Typography variant="caption" component="span">
								{appointment?.operatingTheatreName ?? appointment.visitTypeName}
							</Typography>
						</Typography>

						<Typography variant="caption">
							{dayjs(appointment.appointmentDateTime).format(
								"dddd, MMMM DD, YYYY"
							)}
						</Typography>
						<div style={{ display: "flex", alignItems: "center" }}>
							<Schedule fontSize={"small"} style={{ marginRight: "4px" }} />
							<Typography variant="caption">
								{dayjs(
									appointment?.estimatedAppointmentFromTime,
									"HH:mm:ss"
								).format("hh:mm A")}{" "}
								-{" "}
								{dayjs(
									appointment?.estimatedAppointmentToTime,
									"HH:mm:ss"
								).format("hh:mm A")}
							</Typography>
						</div>

						<Grid container spacing={1} style={{ marginTop: "10px" }}>
							{appointment?.patientUHID && (
								<Grid
									item
									xs={6}
									style={{ display: "flex", alignItems: "center" }}
								>
									<AccountBox
										htmlColor="#1AA659"
										fontSize={"small"}
										style={{ marginRight: "5px" }}
									/>
									<Typography variant="caption">
										{appointment.patientUHID}
									</Typography>
								</Grid>
							)}
							<Grid
								item
								xs={6}
								style={{ display: "flex", alignItems: "center" }}
							>
								<Person
									htmlColor="#1AA659"
									fontSize={"small"}
									style={{ marginRight: "5px" }}
								/>
								<Typography variant="caption">
									{appointment.patientFullName}
								</Typography>
							</Grid>
							<Grid
								item
								xs={6}
								style={{ display: "flex", alignItems: "center" }}
							>
								<Phone
									htmlColor="#1AA659"
									fontSize={"small"}
									style={{ marginRight: "5px" }}
								/>
								<Typography variant="caption">
									{appointment.telephone}
								</Typography>
							</Grid>
							{appointment.medicalStaffUserDisplayName && (
								<Grid
									item
									xs={6}
									style={{ display: "flex", alignItems: "center" }}
								>
									<StethoscopeIcon
										fill="#1AA659"
										style={{ width: "20px", marginRight: "5px" }}
									/>
									<Typography variant="caption">
										Dr. {appointment.medicalStaffUserDisplayName}
									</Typography>
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
									>
										{option.label}
									</Button>
								</Grid>
							))}
						</Grid>
					</Box>
				)}
			</Box>
		</div>
	);
});
