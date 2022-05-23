import React from 'react';
import { ControllerProps, Controller } from 'react-hook-form';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup, { FormGroupProps } from '@material-ui/core/FormGroup';
import Grid, { GridProps } from '@material-ui/core/Grid';


interface Props {
    label?: string;
    name: string;
    control: ControllerProps["control"];
    groupList: { value: string, label: string }[];
    defaultValue?: string[];
    formGroupProps?: FormGroupProps;
    gridProps?: GridProps;
}

const CustomCheckBoxGroup = ({ label, name, control, groupList, defaultValue = [], formGroupProps, gridProps }: Props) => {

    function handleSelect(value: string, checkedValues: string[]) {
        const newCheckedValues = checkedValues?.includes(value)
            ? checkedValues?.filter(name => name !== value)
            : [...(checkedValues ?? []), value];
        return newCheckedValues;
    }

    return (
        <FormControl component="fieldset">
            {label && <span className="text-13 font-medium" style={{ marginBottom: "6px" }}>{label}</span>}

            <FormGroup
                row
                style={{ marginLeft: "5px" }}
                {...formGroupProps}
            >

                <Controller
                    name={name}
                    defaultValue={defaultValue}
                    render={({ field: { onChange, value } }) => {
                        return <>
                            {groupList.map((item) => (
                                <GridContainer key={item.value} gridProps={gridProps}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                onChange={(e) => {
                                                    onChange(handleSelect(e.target.value, value))
                                                }}
                                                checked={value?.includes(item.value)}
                                                size="small"
                                                style={{ padding: "5px" }}
                                                value={item.value}
                                            />
                                        }
                                        label={item.label}
                                        classes={{ label: "text-12 font-regular" }}
                                    />
                                </GridContainer>
                            ))}
                        </>
                    }}
                    control={control}
                />

            </FormGroup>
        </FormControl>
    )
}

export { CustomCheckBoxGroup };


const GridContainer = ({ gridProps, children }: any) => {
    if (gridProps) {
        return <Grid {...gridProps}>
            {children}
        </Grid>
    } else {
        return <React.Fragment>
            {children}
        </React.Fragment>
    }
}