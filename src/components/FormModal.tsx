import React, { ReactNode, useState, memo } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Slide from '@material-ui/core/Slide';
import 'assets/styles/components/modal.css';
import { useTheme } from '@material-ui/core/styles';

interface Props {
    children: React.ReactElement;
    title?: string | ReactNode;
    onConfirm?: () => void;
    onCancel: () => void;
    confirmLabel?: string | ReactNode;
    cancelLabel?: string | ReactNode;
    modalSize?: "small" | "medium" | "half-page" | "full-page";
    slideAnimation?: boolean;
    customFooter?: any;
}

const FormModal = memo((props: Props) => {
    const { children, title, onConfirm, onCancel,
        confirmLabel = <FormattedMessage id="save" />,
        cancelLabel = <FormattedMessage id="cancel" />,
        modalSize = "small",
        slideAnimation = true,
        customFooter
    } = props;
    const [transition, setTransition] = useState(true);
    const theme = useTheme();

    function cancelWithTransition() {
        setTransition(false);
        if (slideAnimation) {
            setTimeout(() => {
                onCancel();
            }, 600);
        } else {
            onCancel();
        }
    }

    return (
        <Modal
            open={true}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            <Slide timeout={slideAnimation ? 600 : 0} direction="left" in={transition} mountOnEnter unmountOnExit>
                <div className={`modal-dialog ${modalSize}`}>
                    <div className="modal-content">

                        {title && <div className="modal-header">
                            <h3 className="modal-heading" style={{ color: theme.palette.primary.main }}>
                                {title}
                            </h3>
                        </div>}

                        <div id="container_div_id" className="modal-body">
                            {children}
                        </div>

                        <div className={`modal-footer`}>
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button onClick={cancelWithTransition} style={{ marginRight: "15px" }} variant="outlined" color="primary">
                                    {cancelLabel}
                                </Button>

                                {customFooter ?? (
                                    <>
                                        {onConfirm && <Button onClick={onConfirm} variant="contained" color="primary">
                                            {confirmLabel}
                                        </Button>}
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </Slide>
        </Modal>
    )
});

export { FormModal };