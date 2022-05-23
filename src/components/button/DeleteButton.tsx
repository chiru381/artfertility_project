import React from 'react';
import { IconButtonProps } from '@material-ui/core/IconButton';
import { useIntl } from 'react-intl';

import { CustomDialog } from 'components/CustomDialog';
import { TableDeleteButton } from './TableButtons';

interface Props extends IconButtonProps {
    tooltipLabel?: string;
    onDelete: () => void;
    title?: string;
    subTitle?: string;
    showConfirmation: boolean;
}

const DeleteButton = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const { showConfirmation, title, subTitle, tooltipLabel, onDelete, ...rest } = props;

    const { formatMessage } = useIntl();

    const handleClickOpen = () => {
        if (showConfirmation) {
            setOpen(true);
        } else {
            onDelete();
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onAgree = () => {
        onDelete();
        handleClose();
    }

    return (
        <>
            <TableDeleteButton
                tooltipLabel={tooltipLabel ?? "Delete"}
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

DeleteButton.defaultProps = {
    showConfirmation: true
}

export { DeleteButton };