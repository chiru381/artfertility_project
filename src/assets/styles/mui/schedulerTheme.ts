import { fade, makeStyles } from '@material-ui/core';

export const useSchedulerStyles = makeStyles((theme: any) => ({

    timeTableBlockedCell: {
        height: "24px !important",
        lineHeight: "auto !important",
        backgroundColor: "grey",
        // '&:hover': {
        //     backgroundColor: "grey !important",
        // },
        // '&:focus': {
        //     backgroundColor: "grey !important",
        // },
    },
    timeTableCell: {
        height: "24px !important",
    },
    timeLabel: {
        height: "24px !important",
        lineHeight: "24px !important",
        "&:first-child": {
            height: "4px !important"
        },
        "&:last-child": {
            height: "4px !important"
        }
    },
}));

export const useCurrentTimeIndicatorStyles = makeStyles(theme => ({
    line: {
        height: "2px",
        width: "100%",
        transform: "translate(0, -1px)"
    },
    circle: {
        width: theme.spacing(1.5),
        height: theme.spacing(1.5),
        borderRadius: "50%",
        transform: "translate(-50%, -50%)"
    },
    nowIndicator: {
        position: "absolute",
        left: 0,
        top: ({ top }: any) => top,
        background: theme.palette.secondary.main,
        zIndex: 1
    }
}));