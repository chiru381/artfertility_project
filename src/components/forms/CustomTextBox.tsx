import React from 'react'
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import { Controller, ControllerProps, FieldError } from "react-hook-form";

import { FormErrorMessage, } from "components/forms";
interface Props {
    name: string;
    rules?: ControllerProps["rules"];
    defaultValue?: any;
    control: ControllerProps["control"];
    error?: FieldError;
    margin?: FormControlProps["margin"];
    containerStyle?: React.CSSProperties;
    formLabel?: string;
}

const CustomTextBox = React.memo(((props: Props & TextFieldProps) => {
    const { margin, name, control, rules, defaultValue, error, containerStyle, formLabel, ...rest } = props;

    const preventMinus = (e: any) => {
        if ((e.charCode === 45 || e.charCode === 43) && props.type === "number") {
            e.preventDefault();
        }
    };

    const preventPasteNegative = (e: any) => {
        const clipboardData = e.clipboardData
        const pastedData = parseFloat(clipboardData.getData('text'));

        if (pastedData < 0) {
            e.preventDefault();
        }
    };

    return (
        <FormControl margin={margin} fullWidth style={{ alignItems: "flex-start", ...containerStyle }}>
            {formLabel && <span className="text-13 font-medium" style={{ marginBottom: "8px" }}>{formLabel}</span>}
            <Controller
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultValue ?? null}
                render={({ field: { ref, ...fieldRest } }) => (
                    <TextField
                        inputRef={ref}
                        variant="outlined"
                        size="small"
                        fullWidth
                        {...fieldRest}
                        {...rest}
                        onKeyPress={preventMinus}
                        onPaste={preventPasteNegative}
                        value={fieldRest.value ?? ""}
                        label={props.label ? rules?.required ? `${props.label} *` : props.label : ''}
                        error={error ? true : false}
                    />
                )}
            />

            <FormErrorMessage error={error} />
        </FormControl>
    )
}));

interface TextBoxState {
    formLabel?: string;
    containerStyle?: React.CSSProperties;
}

const TextBox = React.memo((props: TextFieldProps & TextBoxState) => {
    const { formLabel, containerStyle, ...rest } = props;

    const preventMinus = (e: any) => {
        if ((e.charCode === 45 || e.charCode === 43) && props.type === "number") {
            e.preventDefault();
        }
    };

    const preventPasteNegative = (e: any) => {
        const clipboardData = e.clipboardData
        const pastedData = parseFloat(clipboardData.getData('text'));

        if (pastedData < 0) {
            e.preventDefault();
        }
    };
    return (
        <div style={{ ...containerStyle }}>
            {formLabel && <span className="text-13 font-medium" style={{ marginBottom: "8px", display: "flex" }}>{formLabel}</span>}
            <TextField
                variant="outlined"
                size="small"
                fullWidth
                {...rest}
                onKeyPress={preventMinus}
                onPaste={preventPasteNegative}
                value={props.value ?? ""}
            />
        </div>
    )
})

export { CustomTextBox, TextBox };