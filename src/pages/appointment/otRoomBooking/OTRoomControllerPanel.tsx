import { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { masterPaginationServices } from "utils/constants";
import { RootReducerState } from 'utils/types';

import { CustomIconButton } from 'components/button';
import Typography from '@material-ui/core/Typography';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';


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
    setSelectedOTRoom: React.Dispatch<React.SetStateAction<any>>;
    selectedOTRoom: number | null;
}

const OTRoomControllerPanel = ({ selectedOTRoom, setSelectedOTRoom }: Props) => {
    const { formatMessage } = useIntl();
    const classes = useStyles();
    const [hideSidebar, setHideSidebar] = useState(false);

    const { operatingTheatreRoomData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            operatingTheatreRoomData: masterPaginationReducer[masterPaginationServices.operatingTheatreRoom].data,
        }),
        shallowEqual
    );
    const { modelItems: OTRoomData } = operatingTheatreRoomData;

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

                {!hideSidebar && (
                    <>
                        <Typography variant="body2" style={{ fontWeight: "bold", color: "#3c4043", marginBottom: "2px" }}>
                            {formatMessage({ id: "ot-room" })}
                        </Typography>
                        {OTRoomData?.map((option: any) => (
                            <div key={option.id}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={selectedOTRoom === option.id}
                                            name={String(option.id)}
                                            onChange={() => {
                                                setSelectedOTRoom(option.id);
                                            }}
                                        />
                                    }
                                    label={<Typography variant="body2">{option.name}</Typography>}
                                />
                            </div>
                        ))}

                        <Typography variant="body2" style={{ fontWeight: "bold", color: "#3c4043", marginBottom: "2px", marginTop: "10px" }}>
                            {formatMessage({ id: "labels" })}
                        </Typography>
                        {OTRoomData.map((option: any, index: number) => (
                            <div key={index} className={classes.list}>
                                <div className={classes.color} style={{ backgroundColor: option.colorCode }} />
                                <Typography variant="body2">{option.name}</Typography>
                            </div>
                        ))}
                    </>
                )}

            </div>
        </div>
    )
}

export default OTRoomControllerPanel;