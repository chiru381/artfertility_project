import { memo, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import Add from '@material-ui/icons/Add';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { masterPaginationServices } from "utils/constants";
import { Select } from 'components/forms';
import { RootReducerState } from 'utils/types';

import { useCreateLookupOptions } from 'utils/hooks';
import { CustomIconButton, SecondaryButton } from 'components/button';
import Typography from '@material-ui/core/Typography';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';


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
    onCreateEnquiry: () => void;
    onChangeResource: (data: any) => void;
    setSelectedDoctor: React.Dispatch<React.SetStateAction<any>>;
    selectedDoctor: any;
    selectedResource: any;
}

const ScheulingControllerPanel = memo(({ onCreateEnquiry, onChangeResource, selectedResource, selectedDoctor, setSelectedDoctor }: Props) => {
    const { formatMessage } = useIntl();
    const classes = useStyles();
    const [hideSidebar, setHideSidebar] = useState(false);

    const { appointmentLookupData, visitTypeData } = useSelector(
        ({ masterPaginationReducer, appointmentLookupReducer }: RootReducerState) => ({
            appointmentLookupData: appointmentLookupReducer.data,
            visitTypeData: masterPaginationReducer[masterPaginationServices.visitType].data,
        }),
        shallowEqual
    );
    // Lookup options for dropdown
    let selectOptions = useCreateLookupOptions(appointmentLookupData);

    let resources = useMemo(() => ({
        fieldName: 'colourId',
        title: 'Resource',
        instances: visitTypeData.modelItems.map((visit: any) => ({ id: `V${visit.id}`, text: visit.name, color: visit.colorCode })),
    }), [visitTypeData.modelItems])

    return (
        <div className={`scheduler-left-panel ${hideSidebar ? "scheduler-left-panel-auto" : ""}`}>
            <div style={{ padding: "15px" }}>

                <CustomIconButton
                    tooltipLabel="Toggle Side Panel"
                    onClick={() => setHideSidebar(!hideSidebar)}
                    style={{ marginBottom: "10px" }}
                >
                    {hideSidebar ? <ChevronRight /> : <ChevronLeft />}
                </CustomIconButton>

                {!hideSidebar && <>
                    <SecondaryButton
                        label={formatMessage({ id: "create-enquiry" })}
                        fullWidth
                        startIcon={<Add />}
                        style={{ marginBottom: "20px" }}
                        onClick={onCreateEnquiry}
                    />

                    <Select
                        options={selectOptions?.resources ?? []}
                        onChange={(_, data: any) => onChangeResource(data)}
                        value={selectedResource}
                        disableClearable
                        style={{ marginBottom: "20px" }}
                        label="Select Resource"
                    />

                    {selectedResource?.value === "1" && (
                        <Select
                            options={selectOptions?.medicalStaffs ?? []}
                            onChange={(_, data: any) => {
                                setSelectedDoctor(data);
                            }}
                            value={selectedDoctor}
                            disableClearable
                            label="Select Doctor"
                        />
                    )}

                    <Typography variant="body2" style={{ fontWeight: "bold", color: "#3c4043", marginBottom: "2px", marginTop: "10px" }}>
                        {formatMessage({ id: "labels" })}
                    </Typography>
                    {resources?.instances.map((option: any, index: number) => (
                        <div key={index} className={classes.list}>
                            <div className={classes.color} style={{ backgroundColor: option.color }} />
                            <Typography variant="body2">{option.text}</Typography>
                        </div>
                    ))}
                </>}
            </div>
        </div>
    )
});

export default ScheulingControllerPanel;