import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import dayjs from 'dayjs';

import { CustomSelect, TextBox } from 'components/forms';
import { FormModal } from 'components';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { getMasterPaginationData } from 'redux/actions';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { getFormBody } from 'utils/global';
import { CustomDialog } from 'components/CustomDialog';

interface Props {
    closeModal: () => void;
    isBlock: boolean;
    selectedData: any;
    onApiCall: () => void
}

const BlockForMaintenanceModal = (props: Props) => {
    const { closeModal, isBlock, selectedData, onApiCall } = props;
    const { handleSubmit, formState: { errors }, control, getValues } = useForm({ mode: 'all' });
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [open, setOpen] = useState(false);

    const { blockReasonData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            blockReasonData: masterPaginationReducer[masterPaginationServices.bedBlockReason].data
        }),
        shallowEqual
    );

    useEffect(() => {
        if (isBlock) {
            dispatch(getMasterPaginationData(masterPaginationServices.bedBlockReason, {}));
        }
    }, []);

    let blockReasonOptions = blockReasonData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    function onSubmit() {
        setShowConfirmation(true);
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
        setShowConfirmation(false);
    }

    function onAgree() {
        let formData = getValues();
        let bodyData = getFormBody(formData);

        bodyData = {
            ...bodyData,
            bedId: selectedData.id
        }

        setLoading(true);
        services.bedBlockAndUnblock(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    closeModal();
                    toastMessage(formatMessage({ id: isBlock ? "bed-block-message" : "bed-unblock-message" }));
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    return (
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={formatMessage({ id: isBlock ? "block-for-maintenance" : "unblock-for-maintenance" })}
                confirmLabel="Submit"
            >
                <Grid container spacing={2}>
                    {isBlock &&
                        <Grid item xs={12}>
                            <CustomSelect
                                options={blockReasonOptions}
                                label={formatMessage({ id: "reason-for-block" })}
                                name="bedBlockReasonId"
                                control={control}
                                error={errors.bedBlockReasonId}
                                rules={{ required: true }}
                            />
                        </Grid>
                    }
                    <Grid item xs={12}>
                        <TextBox
                            label={formatMessage({ id: isBlock ? "block-date-time" : "un-block-date-time" })}
                            name="blockDate"
                            disabled={true}
                            value={dayjs(new Date()).format('DD-MM-YYYY hh:mm A')}
                        />
                    </Grid>
                </Grid>
            </FormModal>
            {showConfirmation && (
                <CustomDialog
                    open={open}
                    onDisagree={handleClose}
                    onAgree={onAgree}
                    title={formatMessage({ id: isBlock ? "bed-block-title" : "bed-un-block-title" })}
                    subTitle={formatMessage({ id: isBlock ? "bed-block-confirmation" : "bed-un-block-confirmation" })}
                />
            )}
        </>
    )
}

export default BlockForMaintenanceModal;