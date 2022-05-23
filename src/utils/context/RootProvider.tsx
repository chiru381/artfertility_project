import React, { useState } from 'react';
import RootContext from "./RootContext";

import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import Alert, { AlertProps } from "@material-ui/lab/Alert";


const RootProvider: React.FC = (props) => {
    const [toastOpen, setToastOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [duration, setDuration] = useState<number | null>(null);
    const [severity, setSeverity] = useState<AlertProps['severity']>("success");

    const toastMessage = (message: string, severity: AlertProps['severity'] = "success", duration: number | null = 3000) => {
        setMessage(message);
        setSeverity(severity);
        setDuration(duration);
        setToastOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setToastOpen(false);
    };

    return (
        <RootContext.Provider
            value={{
                toastMessage
            }}
        >
            {props.children}

            <Snackbar
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center"
                }}
                autoHideDuration={2500}
                open={toastOpen}
                onClose={handleClose}
                TransitionComponent={Slide}
            >
                <Alert variant="filled" onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </RootContext.Provider>
    )
}

export default RootProvider;