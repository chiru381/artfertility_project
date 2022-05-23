import React from 'react';
import { IconButtonProps } from '@material-ui/core/IconButton';
import { useIntl } from 'react-intl';

import { CustomDialog } from 'components/CustomDialog';
import { TableDeLinkButton } from './TableButtons';

interface Props extends IconButtonProps {
    onConfirm: () => void;
    title?: string;
    subTitle?: string;
    showConfirmation: boolean;
    tooltipLabel?: string;
}

const ConfirmationIconButton = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const { showConfirmation, title, subTitle, tooltipLabel, onConfirm, ...rest } = props;

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
            <TableDeLinkButton
                tooltipLabel={tooltipLabel}
                onClick={handleClickOpen}
                {...rest}
            />

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

ConfirmationIconButton.defaultProps = {
    showConfirmation: true
}

export { ConfirmationIconButton };