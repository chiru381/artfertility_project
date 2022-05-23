import { Tooltip } from '@material-ui/core';
import Button, { ButtonProps } from '@material-ui/core/Button';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface Props extends ButtonProps {
    label?: string | React.ReactElement
}

interface IconButtonProps extends ButtonProps {
    tooltipLabel?: string | React.ReactElement
}

const PrimaryButton = React.memo((props: Props) => {
    const { label, ...rest } = props;
    return (
        <Button
            variant="contained"
            color="primary"
            {...rest}
        >
            <span style={{ textTransform: "none" }}>{label ?? <FormattedMessage id="submit" />}</span>
        </Button>
    )
});

const CustomIconButton = React.memo((props: IconButtonProps) => {
    const { tooltipLabel, ...rest } = props;
    return (
        <Tooltip title={tooltipLabel ?? ""}>
            <Button
                variant="outlined"
                className="icon-button"
                {...rest}
            >
                {props.children}
            </Button>
        </Tooltip>
    )
});

export { PrimaryButton, CustomIconButton };