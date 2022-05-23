import Button, { ButtonProps } from '@material-ui/core/Button';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface Props extends ButtonProps {
    label?: string
}

const EditButton = React.memo((props: Props) => {
    const { label, ...rest } = props;
    return (
        <Button
            style={{ marginRight: "10px" }}
            color="primary"
            variant="outlined"
            {...rest}
        >
            <span>{label ?? <FormattedMessage id="edit" />}</span>
        </Button>
    )
});

export { EditButton };