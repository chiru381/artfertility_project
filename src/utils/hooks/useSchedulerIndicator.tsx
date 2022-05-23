import { useEffect, useRef } from "react";
import classNames from "clsx";
import { useCurrentTimeIndicatorStyles } from "assets/styles/mui";

export const useSchedulerIndicator = ({ top, ...restProps }: any, indicatorInitialization: boolean = false, setIndicatorInitialization: any = null) => {
    const indicatorRef: any = useRef(null);
    const classes = useCurrentTimeIndicatorStyles({ top });

    useEffect(() => {
        if (indicatorRef?.current && !indicatorInitialization) {
            indicatorRef.current.scrollIntoView({ block: "center" });
            if(setIndicatorInitialization){
                setIndicatorInitialization(true);
            }
        }
    });

    return (
        <div {...restProps} ref={indicatorRef}>
            <div className={classNames(classes.nowIndicator, classes.circle)} />
            <div className={classNames(classes.nowIndicator, classes.line)} />
        </div>
    );
};