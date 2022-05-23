import Button, { ButtonProps } from '@material-ui/core/Button';
import Save from '@material-ui/icons/Save';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface Props extends ButtonProps {
    label?: string
}

const SaveButton = React.memo((props: Props) => {
    const { label, ...rest } = props;
    return (
        <Button
            color="primary"
            variant="contained"
            endIcon={<Save />}
            {...rest}
        >
            <span>{label ?? <FormattedMessage id="save" />}</span>
        </Button>
    )
});

export { SaveButton };