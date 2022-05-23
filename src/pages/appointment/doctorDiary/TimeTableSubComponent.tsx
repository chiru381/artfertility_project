import {
    WeekView,
    DayView
} from '@devexpress/dx-react-scheduler-material-ui';
import { useSchedulerStyles } from 'assets/styles/mui';
import dayjs from "dayjs";

const formatDayScaleDate = (date: any, options: any) => {
    const momentDate = dayjs(date);
    const { weekday } = options;
    return weekday ? momentDate.format('ddd DD MMM') : '';
};

const TimeTableCell = (props: any) => {
    const classes = useSchedulerStyles();
    return <WeekView.TimeTableCell {...props} className={classes.timeTableCell} />
};

const DayScaleCell = (props: any) => {
    return <WeekView.DayScaleCell {...props} formatDate={formatDayScaleDate} />;
};

const TimeLabel = (props: any) => {
    const classes = useSchedulerStyles();
    return <DayView.TimeScaleLabel {...props} className={classes.timeLabel} />;
};

export {
    TimeTableCell,
    DayScaleCell,
    TimeLabel
}