import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { updateUtility } from 'redux/actions';

import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import HospitalIcon from '@material-ui/icons/LocalHospital';
import { blue } from '@material-ui/core/colors';
import { RootReducerState } from 'utils/types';

const useStyles = makeStyles({
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
});

export interface ClinicSelectionDialogProps {
    open: boolean;
    onClose: () => void;
}

function ClinicSelectionDialog(props: ClinicSelectionDialogProps) {
    const classes = useStyles();
    const { onClose, open } = props;
    const dispatch = useDispatch();

    const { authData, selectedClinic } = useSelector(
        ({ utilityReducer, auth }: RootReducerState) => ({
            authData: auth.data,
            selectedClinic: utilityReducer.selectedClinic
        }),
        shallowEqual
    );

    const handleClose = () => {
        onClose();
    };

    const handleListItemClick = (value: string) => {
        onClose();
        if (+value !== +selectedClinic) {
            dispatch(updateUtility({ selectedClinic: String(value) }));
            setTimeout(() => {
                window.location.reload();
            }, 10);
        }
    };

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }} id="simple-dialog-title">Select Clinic</DialogTitle>
            <List style={{ minWidth: "320px" }}>
                {authData?.clinics?.map((clinic: any, index: number) => (
                    <ListItem
                        button
                        onClick={() => handleListItemClick(clinic.clinicId)}
                        key={index}
                        style={{
                            background: +clinic.clinicId === +selectedClinic ? "rgba(0,0,0,0.05)" : "",
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                                <HospitalIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={clinic.clinicName} />
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

export default ClinicSelectionDialog
