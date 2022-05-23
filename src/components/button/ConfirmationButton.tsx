import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { FormattedMessage, useIntl } from 'react-intl';

import { CustomDialog } from 'components/CustomDialog';

interface Props extends ButtonProps {
    label?: string;
    onConfirm: () => void;
    title?: string;
    subTitle?: string;
    showConfirmation: boolean;
}

const ConfirmationButton = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const { showConfirmation, title, subTitle, label, onConfirm, ...rest } = props;

    const { formatMessage } = useIntl();

    const handleClickOpen = () => {
        if (showConfirmation) {
            setOpen(true);
        } else {
            onConfirm();
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onAgree = () => {
        onConfirm();
        handleClose();
    }

    return (
        <>
            <Button
                style={{ marginRight: "10px" }}
                color="secondary"
                variant="outlined"
                {...rest}
                onClick={handleClickOpen}
            >
                <span>{label ?? <FormattedMessage id="delete" />}</span>
            </Button>

            {showConfirmation && (
                <CustomDialog
                    open={open}
                    onDisagree={handleClose}
                    onAgree={onAgree}
                    title={title ?? formatMessage({ id: "delete-title" })}
                    subTitle={subTitle ?? formatMessage({ id: "delete-confirmation" })}
                />
            )}
        </>
    )
};

ConfirmationButton.defaultProps = {
    showConfirmation: true
}

export { ConfirmationButton };