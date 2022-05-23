import React from "react";
import {
	KeyboardTimePicker,
	KeyboardTimePickerProps,
} from "@material-ui/pickers";
import FormControl from "@material-ui/core/FormControl";
import ClockIcon from "@material-ui/icons/Schedule";

import { Controller, ControllerProps, FieldError } from "react-hook-form";
import { FormErrorMessage } from "components/forms";
import InputAdornment from "@material-ui/core/InputAdornment";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import dayjs from "dayjs";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			paddingRight: "3px",
		},
		input: {
			marginRight: "0px !important",
			paddingLeft: "8px",
		},
	})
);

interface Props {
	name: string;
	rules?: ControllerProps["rules"];
	defaultValue?: any;
	control: ControllerProps["control"];
	error?: FieldError;
	onChangeDate?: (date: any) => void;
	formLabel?: string;
}

const CustomTimePicker = React.memo(
	(
		props: Props &
			Omit<KeyboardTimePickerProps, "value" | "onChange" | "onBlur" | "name">
	) => {
		const {
			name,
			rules,
			defaultValue,
			control,
			error,
			onChangeDate,
			formLabel,
			...rest
		} = props;
		const classes = useStyles();

		return (
			<FormControl fullWidth>
				{formLabel && (
					<span className="text-13 font-medium" style={{ marginBottom: "8px" }}>
						{formLabel}
					</span>
				)}

				<Controller
					name={name}
					control={control}
					rules={rules}
					defaultValue={defaultValue ?? null}
					render={({ field: { ref, ...fieldRest } }) => {
						return (
							<KeyboardTimePicker
								variant="inline"
								inputVariant="outlined"
								fullWidth
								size="small"
								placeholder="hh:mm"
								mask="__:__ _M"
								autoOk={true}
								error={error ? true : false}
								minutesStep={5}
								{...rest}
								{...fieldRest}
								InputProps={{
									classes: {
										root: classes.root,
										input: classes.input,
									},
								}}
								keyboardIcon={<ClockIcon color="primary" fontSize="small" />}
								InputAdornmentProps={{ position: "end" }}
								KeyboardButtonProps={{ size: "small", color: "primary" }}
								onChange={(date, value) => {
									if (value ? dayjs(value, "hh:mm A", true).isValid() : false) {
										fieldRest.onChange(date);
										if (onChangeDate) {
											onChangeDate(date);
										}
									}
								}}
								onBlur={(e) => {
									let value = e.target.value;
									if (!dayjs(value, "hh:mm A", true).isValid()) {
										fieldRest.onChange(dayjs(fieldRest?.value?.toString()));
									}
									if (fieldRest?.onBlur) {
										fieldRest.onBlur();
									}
								}}
								label={rules?.required ? `${props.label} *` : props.label}
							/>
						);
					}}
				/>

				<FormErrorMessage error={error} />
			</FormControl>
		);
	}
);

const TimePicker = React.memo((props: KeyboardTimePickerProps) => {
	return (
		<KeyboardTimePicker
			variant="inline"
			inputVariant="outlined"
			fullWidth
			size="small"
			placeholder="hh:mm"
			mask="__:__ _M"
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<ClockIcon color="primary" />
					</InputAdornment>
				),
			}}
			autoOk={true}
			minutesStep={5}
			keyboardIcon={<ClockIcon color="primary" />}
			{...props}
			onChange={(date, value) => {
				if (value ? dayjs(value, "hh:mm A", true).isValid() : false) {
					props.onChange(date);
				}
			}}
			onBlur={(e) => {
				let value = e.target.value;
				if (!dayjs(value, "hh:mm A", true).isValid()) {
					props.onChange(dayjs(props?.value?.toString()));
				}
				if (props?.onBlur) {
					props.onBlur(e);
				}
			}}
		/>
	);
});

export { CustomTimePicker, TimePicker };
