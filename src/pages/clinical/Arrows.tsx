import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import React from "react";
import { VisibilityContext } from "react-horizontal-scrolling-menu";

function Arrow({
    children,
    disabled,
    onClick,
    direction
}: {
    children: React.ReactNode;
    disabled: boolean;
    onClick: VoidFunction;
    direction: string
}) {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            style={{
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                opacity: disabled ? "0" : "1",
                userSelect: "none",
                border: "none",
                borderRight: direction === "left" ? "1px solid rgba(0,0,0,0.1)" : "none",
                borderLeft: direction === "right" ? "1px solid rgba(0,0,0,0.1)" : "none",
                padding: "0px"
            }}
        >
            {children}
        </button>
    );
}

export function LeftArrow() {
    const {
        isFirstItemVisible,
        scrollPrev,
        visibleItemsWithoutSeparators,
        initComplete
    } = React.useContext(VisibilityContext);

    const [disabled, setDisabled] = React.useState(
        !initComplete || (initComplete && isFirstItemVisible)
    );
    React.useEffect(() => {
        // NOTE: detect if whole component visible
        if (visibleItemsWithoutSeparators.length) {
            setDisabled(isFirstItemVisible);
        }
    }, [isFirstItemVisible, visibleItemsWithoutSeparators]);

    return (
        !disabled && <Arrow direction="left" disabled={disabled} onClick={() => scrollPrev()}>
            <ChevronLeft />
        </Arrow>
    );
}

export function RightArrow() {
    const {
        isLastItemVisible,
        scrollNext,
        visibleItemsWithoutSeparators
    } = React.useContext(VisibilityContext);

    const [disabled, setDisabled] = React.useState(!visibleItemsWithoutSeparators.length && isLastItemVisible
    );
    React.useEffect(() => {
        if (visibleItemsWithoutSeparators.length) {
            setDisabled(isLastItemVisible);
        }
    }, [isLastItemVisible, visibleItemsWithoutSeparators]);

    return (
        !disabled && <Arrow direction="right" disabled={disabled} onClick={() => scrollNext()}>
            <ChevronRight />
        </Arrow>
    );
}
