import FormControlLabel, { FormControlLabelProps } from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import React from 'react';
import { Controller, ControllerProps, FieldError } from "react-hook-form";

interface Props {
    name: string;
    rules?: ControllerProps["rules"];
    control: ControllerProps["control"];
    error?: FieldError;
    isDefaultChecked?: boolean;
}

const CustomCheckBox = React.memo((props: Props & CheckboxProps & Omit<FormControlLabelProps, 'control'>) => {
    const { control, name, rules, isDefaultChecked, error, ...rest } = props;

    return (
        <FormControlLabel
            style={{ width: "fit-content" }}
            control={
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    defaultValue={isDefaultChecked ?? false}
                    render={({ field }) => (
                        <Checkbox
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

const CheckBox = React.memo((props: CheckboxProps & { label?: string }) => {
    const { label = "", ...rest } = props;

    return (
        <FormControlLabel
            style={{ width: "fit-content" }}
            control={
                <Checkbox
                    size="medium"
                    color="primary"
                    {...rest}
                />
            }
            label={label}
        />
    )
});

export { CustomCheckBox, CheckBox };