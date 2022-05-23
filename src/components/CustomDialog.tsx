import Button from '@material-ui/core/Button';
import { useIntl } from 'react-intl';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { SlideTransition } from './SlideTransition';
import { Typography } from '@material-ui/core';

interface CommonProps {
    onAgree: () => void;
    onDisagree: () => void;
    open: boolean;
}
interface Props extends CommonProps {
    title?: string;
    subTitle?: string;
    agreeLabel?: string;
    disagreeLabel?: string;
    dialogContent?: any;
}

const CustomDialog = (props: Props) => {
    const { title, subTitle, onAgree, onDisagree, agreeLabel, disagreeLabel, open, dialogContent } = props;
    const { formatMessage } = useIntl();

    return (
        <Dialog
            TransitionComponent={SlideTransition}
            open={open}
            onClose={onDisagree}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableBackdropClick
        >
            <DialogTitle style={{ background: "#F4E165" }} id="alert-dialog-title">
                <Typography variant="body1" style={{ fontSize: "18px", fontWeight: "bold", textAlign: "center" }}>{title ?? formatMessage({ id: "title" })}</Typography>
            </DialogTitle>

            <DialogContent>
                {dialogContent ?? (
                    <>
                        <DialogContentText id="alert-dialog-description" style={{ fontSize: "15px", textAlign: "center", color: "#000000", marginTop: "10px" }}>
                            {subTitle ?? formatMessage({ id: "sub-title" })}
                        </DialogContentText>
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onDisagree} color="secondary" variant="outlined">
                    {agreeLabel ?? formatMessage({ id: "disagree" })}
                </Button>
                <Button onClick={onAgree} color="primary" variant="contained">
                    {disagreeLabel ?? formatMessage({ id: "agree" })}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export { CustomDialog }

const AuthActiveSessionDialog = (props: CommonProps) => {
    const { onAgree, onDisagree, open } = props;
    const { formatMessage } = useIntl();

    return (
        <Dialog
            TransitionComponent={SlideTransition}
            open={open}
            onClose={onDisagree}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableBackdropClick
        >
            <DialogTitle style={{ background: "#F4E165" }} id="alert-dialog-title">
                <Typography variant="body1" style={{ fontSize: "18px", fontWeight: "bold", textAlign: "center" }}>{formatMessage({ id: "close-active-session" })}</Typography>
            </DialogTitle>

            <DialogContent>
                <DialogContentText id="alert-dialog-description" style={{ fontSize: "15px", textAlign: "center", color: "#000000", marginTop: "10px" }}>
                    You already have another active session. Would you like it to be closed automatically?
                </DialogContentText>
                <DialogContentText id="alert-dialog-description" style={{ fontSize: "15px", textAlign: "center", color: "red", fontWeight: "bold" }}>
                    Remainder: If you click 'Yes', you will loose your unsaved data!
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button onClick={onDisagree} color="default" variant="outlined">
                    {formatMessage({ id: "no" })}
                </Button>
                <Button onClick={onAgree} color="secondary" variant="contained">
                    {formatMessage({ id: "yes" })}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export { AuthActiveSessionDialog };