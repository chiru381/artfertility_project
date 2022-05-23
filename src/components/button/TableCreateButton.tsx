import Button, { ButtonProps } from '@material-ui/core/Button';
import AddCircle from '@material-ui/icons/AddCircle';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface Props extends ButtonProps {
    label?: string
}

const TableCreateButton = React.memo((props: Props) => {
    const { label, ...rest } = props;
    return (
        <Button
            endIcon={<AddCircle color="primary" style={{fontSize: "20px"}}/>}
            style={{ marginLeft: "15px", height: "35px", textTransform: "capitalize" }}
            size="large"
            variant="outlined"
            color="primary"
            {...rest}
        >
            <span>{label ?? <FormattedMessage id="create"/>}</span>
        </Button>
    )
})

export { TableCreateButton };