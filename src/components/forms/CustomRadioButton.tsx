import FormControlLabel, { FormControlLabelProps } from '@material-ui/core/FormControlLabel';
import Radio, { RadioProps } from '@material-ui/core/Radio';
import React from 'react';
import { Controller, ControllerProps, FieldError } from "react-hook-form";

interface Props {
    name: string;
    rules?: ControllerProps["rules"];
    defaultValue?: any;
    control: ControllerProps["control"];
    error?: FieldError;
}

const CustomRadioButton = React.memo((props: Props & RadioProps & Omit<FormControlLabelProps, 'control'>) => {
    const { control, name, rules, defaultValue, error, ...rest } = props;

    return (
        <FormControlLabel
            style={{ width: "fit-content" }}
            control={
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field }) => (
                        <Radio
                            name={name}
                            checked={!!field.value}
                            color="primary"
                            size="small"
                            {...rest}
                            onChange={(e) => field.onChange(e.target.checked)}
                        />
                    )}
                />
            }
            {...rest}
        />
    )
});


const RadioButton = React.memo((props: RadioProps & { label?: string }) => {
    const { label = "", ...rest } = props;

    return (
        <FormControlLabel
            style={{ width: "fit-content" }}
            control={
                <Radio
                    size="small"
                    color="primary"
                    {...rest}
                />
            }
            label={label}
        />
    )
});

export { CustomRadioButton, RadioButton };