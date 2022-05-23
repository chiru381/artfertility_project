import Button, { ButtonProps } from '@material-ui/core/Button';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface Props extends ButtonProps {
    label?: string | React.ReactElement
}

const SecondaryButton = React.memo((props: Props) => {
    const { label, ...rest } = props;
    return (
        <Button
            color="primary"
            variant="outlined"
            {...rest}
        >
            <span style={{textTransform: "none"}}>{label ?? <FormattedMessage id="cancel" />}</span>
        </Button>
    )
});

export { SecondaryButton };