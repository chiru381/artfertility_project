import { useCallback, useState, useRef } from 'react';
import { Controller, ControllerProps, FieldError } from "react-hook-form";
import { HexColorPicker, HexColorInput } from "react-colorful";
import FormControl from '@material-ui/core/FormControl';
import Opacity from '@material-ui/icons/Opacity';
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";

import { FormErrorMessage } from "components/forms";
import { SecondaryButton } from 'components/button';
import useClickOutside from 'utils/hooks/useClickOutside';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        popover: {
            position: "absolute",
            top: "calc(100% + 2px)",
            left: 0,
            borderRadius: "9px",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
            padding: "5px",
            background: "#FFFFFF",
            zIndex: 1
        },
        textbox: {
            display: "block",
            boxSizing: "border-box",
            width: "100%",
            marginTop: "5px",
            padding: "6px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            background: "#eee",
            outline: "none",
            font: "inherit",
            textTransform: "uppercase",
            textAlign: "center",
            '&:focus': {
                borderColor: theme.palette.primary.main
            },
        }
    })
);

interface Props {
    name: string;
    rules?: ControllerProps["rules"];
    control: ControllerProps["control"];
    error?: FieldError;
    formLabel?: string;
    defaultValue?: string
}

const CustomColorPicker = (props: Props) => {
    const { name, control, rules, defaultValue, error, formLabel } = props;
    const [isOpen, toggle] = useState(false);
    const classes = useStyles();

    const popover: any = useRef();

    const close = useCallback(() => toggle(false), []);
    useClickOutside(popover, close);

    return (
        <FormControl fullWidth>
            {formLabel && <span className="text-13 font-medium" style={{ marginBottom: "5px" }}>{formLabel}</span>}

            <Controller
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultValue ?? "#aabbcc"}
                render={({ field }) => (
                    <>
                        <SecondaryButton
                            label={field.value}
                            onClick={() => toggle(true)}
                            startIcon={<Opacity htmlColor={field.value} />}
                            color="default"
                            style={{ justifyContent: "unset" }}
                        />

                        {isOpen && (
                            <div className={classes.popover} ref={popover}>
                                <HexColorPicker
                                    color={field.value}
                                    onChange={color => {
                                        field.onChange(color);
                                    }}
                                />
                                <HexColorInput
                                    color={field.value}
                                    onChange={color => {
                                        field.onChange(color);
                                    }}
                                    className={classes.textbox}
                                />
                            </div>
                        )}
                    </>
                )}
            />

            <FormErrorMessage error={error} />
        </FormControl>
    )
}

export { CustomColorPicker };