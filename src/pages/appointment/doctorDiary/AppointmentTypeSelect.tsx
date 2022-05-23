import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            borderBottom: `1px solid #eaecef`,
            padding: '8px 10px',
            fontWeight: 600,
        },
        list: {
            display: "flex",
            alignItems: "center"
        },
        color: {
            width: "14px",
            height: "14px",
            flexShrink: 0,
            borderRadius: 3,
            marginRight: 8,
            marginTop: 6,
            marginBottom: 6,
            marginLeft: 10
        },
        text: {
            flexGrow: 1,
        },
    }),
);

interface Props {
    appointmentType: { label: string, value: string | number, checked: boolean }[],
    onAppointmentTypeToggle: (value: string | number) => void
}

const PopupCheckBox = ({ onAppointmentTypeToggle, appointmentType }: Props) => {
    return (
        <div>
            {appointmentType.map((option: any) => (
                <div key={option.value} style={{ width: "200px", padding: "0 12px" }}>
                    <FormControlLabel
                        style={{ width: "100%" }}
                        control={
                            <Checkbox
                                size="medium"
                                checked={option.checked} 
                                name={String(option.value)}
                                onChange={() => {
                                    onAppointmentTypeToggle(option.value);
                                }}
                            />
                        }
                        label={option.label}
                    />
                </div>
            ))}
        </div>
    )
}

const ColorCodePopup = ({ colorInstances }: any) => {
    const classes = useStyles();
    return (
        <div style={{minWidth: "230px"}}>
            <Box className={classes.header}>
                Color Codes
            </Box>

            {colorInstances.map((option: any, index: number) => (
                <div key={index} className={classes.list}>
                    <div className={classes.color} style={{ backgroundColor: option.color }} />
                    <div className={classes.text}>
                        {option.text}
                    </div>
                </div>
            ))}
        </div>
    )
}

export { PopupCheckBox, ColorCodePopup };