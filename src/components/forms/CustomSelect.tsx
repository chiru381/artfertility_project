import React from 'react';
import Autocomplete, { AutocompleteProps } from '@material-ui/lab/Autocomplete';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import { Controller, ControllerProps, FieldError } from "react-hook-form";
import FormControl from '@material-ui/core/FormControl';

import { FormErrorMessage } from "components/forms";
import { SelectOptionsState } from 'utils/types';

function sortingOtions(options: SelectOptionsState[]) {
    let optionsList = JSON.parse(JSON.stringify(options));
    return optionsList?.filter((list: SelectOptionsState) => (list.value && list.label))?.sort((a: any, b: any) => a?.label?.toString().localeCompare(b?.label?.toString()));
}
interface SelectProps {
    placeholder?: string;
    label?: string;
    fullWidth?: boolean;
    textFieldProps?: TextFieldProps;
}

interface Props extends SelectProps, Omit<
    AutocompleteProps<SelectOptionsState, false | true, boolean, true>,
    'error' | 'onChange' | 'required' | 'renderInput'
> {
    name: string;
    rules?: ControllerProps["rules"];
    defaultValue?: SelectOptionsState | SelectOptionsState[];
    control: ControllerProps["control"];
    error?: FieldError;
    onChangeValue?: (data: any) => void;
    formLabel?: string;
}

const CustomSelect = React.memo((props: Props) => {
    const { name, control, rules, defaultValue, label, error, placeholder, textFieldProps, options, onChangeValue, formLabel, ...rest } = props;

    return (
        <FormControl fullWidth>
            {formLabel && <span className="text-13 font-medium" style={{ marginBottom: "8px" }}>{formLabel}</span>}

            <Controller
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultValue ? defaultValue : props?.multiple ? [] : null}
                render={({ field }) => (
                    <Autocomplete
                        size="small"
                        {...field}
                        onChange={(_, data) => {
                            field.onChange(data);
                            if (onChangeValue) {
                                onChangeValue(data);
                            }
                        }}
                        defaultValue={defaultValue ?? ""}
                        getOptionLabel={(option: any) => option?.label ?? ""}
                        getOptionSelected={(option, value) => option?.value === value?.value}
                        filterSelectedOptions
                        options={sortingOtions(options)}
                        renderInput={(params: any) => (
                            <TextField
                                variant="outlined"
                                label={rules?.required ? `${label} *` : label}
                                placeholder={placeholder}
                                error={error ? true : false}
                                {...params}
                                {...textFieldProps}
                            />
                        )}
                        {...rest}
                    />
                )}
            />

            <FormErrorMessage error={error} />
        </FormControl>
    )
});


const Select = React.memo((props: SelectProps & Omit<
    AutocompleteProps<SelectOptionsState, false | true, boolean, true>,
    'renderInput'
>) => {
    const { label, placeholder, fullWidth = true, textFieldProps, options, ...rest } = props;
    let inputPropsStyle = textFieldProps?.InputProps?.style ? textFieldProps.InputProps.style : {};

    return (
        <FormControl fullWidth={fullWidth}>
            <Autocomplete
                size="small"
                getOptionLabel={(option: any) => option.label}
                filterSelectedOptions
                getOptionSelected={(option, value) => option?.value === value?.value}
                options={sortingOtions(options)}
                {...rest}
                renderInput={(params: any) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        label={label}
                        placeholder={placeholder}
                        {...textFieldProps}
                        InputProps={{
                            ...params.InputProps,
                            style: inputPropsStyle
                        }}
                    />
                )}
            />
        </FormControl>
    )
})

export { CustomSelect, Select };