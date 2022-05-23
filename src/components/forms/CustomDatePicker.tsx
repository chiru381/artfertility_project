import React from 'react';
import { KeyboardDatePicker, KeyboardDatePickerProps, DatePicker as NoKeyboardDatePicker, DatePickerProps } from "@material-ui/pickers";
import FormControl from '@material-ui/core/FormControl';
import CalendarToday from '@material-ui/icons/Event';
import { Controller, ControllerProps, FieldError } from "react-hook-form";
import dayjs from 'dayjs';
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import { FormErrorMessage, } from "components/forms";
import { getApiDate } from 'utils/global';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingRight: "3px",
        },
        input: {
            marginRight: "0px !important",
            paddingLeft: "8px",
        }
    })
);


interface Props {
    name: string;
    rules?: ControllerProps["rules"];
    defaultValue?: any;
    control: ControllerProps["control"];
    error?: FieldError;
    onChangeValue?: (date: any) => void;
    formLabel?: string;
}

const CustomDatePicker = React.memo((props: Props & Omit<KeyboardDatePickerProps, 'value' | 'onChange' | 'onBlur' | 'name'>) => {
    const { name, rules, defaultValue, control, error, onChangeValue, formLabel, ...rest } = props;
    const classes = useStyles();

    return (
        <FormControl fullWidth>
            {formLabel && <span className="text-13 font-medium" style={{ marginBottom: "8px" }}>{formLabel}</span>}

            <Controller
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultValue ?? undefined}
                render={({ field: { ref, ...fieldRest } }) => {
                    return (
                        <KeyboardDatePicker
                            variant="inline"
                            inputVariant="outlined"
                            fullWidth
                            size="small"
                            format="DD-MM-YYYY"
                            placeholder="DD-MM-YYYY"
                            keyboardIcon={<CalendarToday color="primary" fontSize='small' />}
                            InputAdornmentProps={{ position: "end", style: { marginLeft: "0px" } }}
                            KeyboardButtonProps={{ size: "small", color: "primary", style: { margin: "0px !important", padding: "0px !important" } }}
                            autoOk={true}
                            error={error ? true : false}
                            {...rest}
                            InputProps={{
                                classes: {
                                    root: classes.root,
                                    input: classes.input,
                                }
                            }}
                            value={fieldRest.value}
                            onChange={(date, value) => {
                                if (value ? dayjs(value, 'DD-MM-YYYY', true).isValid() : false) {
                                    fieldRest.onChange(getApiDate(date?.toDate()));
                                    if (onChangeValue) {
                                        onChangeValue(date);
                                    }
                                }
                            }}
                            onBlur={e => {
                                let value = e.target.value;
                                if (!dayjs(value, 'DD-MM-YYYY', true).isValid()) {
                                    fieldRest.onChange(null);
                                } else if (dayjs(value, 'DD-MM-YYYY').isBefore(dayjs("01-01-1900", 'DD-MM-YYYY')) || dayjs(value, 'DD-MM-YYYY').isAfter(dayjs("01-01-2100", 'DD-MM-YYYY'))) {
                                    fieldRest.onChange(null);
                                } else if (props?.minDate && dayjs(value, 'DD-MM-YYYY').isBefore(dayjs(props.minDate.toString()))) {
                                    fieldRest.onChange(null);
                                } else if (props?.maxDate && dayjs(value, 'DD-MM-YYYY').isAfter(dayjs(props.maxDate.toString()))) {
                                    fieldRest.onChange(null);
                                }
                                if (fieldRest?.onBlur) {
                                    fieldRest.onBlur();
                                }
                            }}
                            label={rules?.required ? `${props.label} *` : props.label}
                        />
                    )
                }}
            />

            <FormErrorMessage error={error} />
        </FormControl>
    )
});

const DatePicker = React.memo((props: { formLabel?: string } & KeyboardDatePickerProps) => {
    const { formLabel, ...rest } = props;
    return (
        <FormControl fullWidth>
            {formLabel && <span className="text-13 font-medium" style={{ marginBottom: "8px" }}>{formLabel}</span>}

            <KeyboardDatePicker
                variant="inline"
                inputVariant="outlined"
                fullWidth
                size="small"
                format="DD-MM-YYYY"
                placeholder="DD-MM-YYYY"
                InputAdornmentProps={{ position: "end" }}
                KeyboardButtonProps={{ size: "small", color: "primary" }}
                keyboardIcon={<CalendarToday color="primary" fontSize='small' />}
                autoOk={true}
                {...rest}
                onBlur={e => {
                    if (dayjs(e.target.value, 'DD-MM-YYYY')?.format('DD-MM-YYYY') !== e.target.value) {
                        props.onChange(null);
                    }
                    if (props?.onBlur) {
                        props.onBlur(e);
                    }
                }}
            />

        </FormControl>
    )
});


const PrimaryDatePicker = React.memo((props: DatePickerProps) => {
    return (
        <NoKeyboardDatePicker
            variant="inline"
            inputVariant="outlined"
            fullWidth
            size="small"
            format="DD-MM-YYYY"
            placeholder="DD-MM-YYYY"
            autoOk={true}
            {...props}
        />
    )
})

export { CustomDatePicker, DatePicker, PrimaryDatePicker }