import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import Add from '@material-ui/icons/Add';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { CustomIconButton, SecondaryButton } from 'components/button';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        list: {
            display: "flex",
            alignItems: "center"
        },
        color: {
            width: "18px",
            height: "18px",
            flexShrink: 0,
            borderRadius: 3,
            marginRight: 8,
            marginTop: 6,
            marginBottom: 6,
        }
    }),
);

interface Props {
    appointmentType: { label: string, value: string | number, checked: boolean }[];
    onAppointmentTypeToggle: (value: string | number) => void;
    onSelectAll: (value: boolean) => void;
    colorInstances: any[];
    setCreateTaskModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DoctorDiaryControllerPanel = React.memo(({ appointmentType, onAppointmentTypeToggle, colorInstances, setCreateTaskModalOpen, onSelectAll }: Props) => {
    const classes = useStyles();
    const { formatMessage } = useIntl();
    const [hideSidebar, setHideSidebar] = useState(false);
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(true);

    useEffect(() => {
        let filterColumns = appointmentType.filter(type => type.checked);
        setIsSelectAllChecked(appointmentType.length === filterColumns.length);
    }, [appointmentType]);

    return (
        <div className={`scheduler-left-panel ${hideSidebar ? "scheduler-left-panel-auto" : ""}`}>
            <div style={{ padding: "15px" }}>
                <div>
                    <CustomIconButton
                        tooltipLabel="Toggle Side Panel"
                        onClick={() => setHideSidebar(!hideSidebar)}
                        style={{ marginBottom: "10px" }}
                    >
                        {hideSidebar ? <ChevronRight /> : <ChevronLeft />}
                    </CustomIconButton>

                    {!hideSidebar && <>
                        <SecondaryButton
                            label={formatMessage({ id: "create-task" })}
                            fullWidth
                            startIcon={<Add />}
                            style={{ marginBottom: "15px" }}
                            onClick={() => setCreateTaskModalOpen(true)}
                        />

                        <Typography variant="body2" style={{ fontWeight: "bold", color: "#3c4043", marginBottom: "2px" }}>
                            {formatMessage({ id: "appointment-type" })}
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size="small"
                                    checked={isSelectAllChecked}
                                    onChange={() => {
                                        setIsSelectAllChecked(!isSelectAllChecked);
                                        onSelectAll(!isSelectAllChecked);
                                    }}
                                />
                            }
                            label={<Typography variant="body2">Select All</Typography>}
                        />
                        {appointmentType.map((option: any) => (
                            <div key={option.value}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={option.checked}
                                            name={String(option.value)}
                                            onChange={() => {
                                                onAppointmentTypeToggle(option.value);
                                            }}
                                        />
                                    }
                                    label={<Typography variant="body2">{option.label}</Typography>}
                                />
                            </div>
                        ))}

                        <Typography variant="body2" style={{ fontWeight: "bold", color: "#3c4043", marginBottom: "2px", marginTop: "10px" }}>
                            {formatMessage({ id: "labels" })}
                        </Typography>
                        {colorInstances.map((option: any, index: number) => (
                            <div key={index} className={classes.list}>
                                <div className={classes.color} style={{ backgroundColor: option.color }} />
                                <Typography variant="body2">{option.text}</Typography>
                            </div>
                        ))}
                    </>}
                </div>
            </div>
        </div>
    )
});

export default DoctorDiaryControllerPanel;