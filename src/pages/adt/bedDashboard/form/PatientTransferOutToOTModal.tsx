import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import dayjs from 'dayjs';

import { CustomTextBox } from 'components/forms';
import { FormModal } from 'components';
import { useToastMessage } from 'utils/hooks';
import { getFormBody } from 'utils/global';
import { services } from 'utils/services';
import { bedStatus } from 'utils/constants';


interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void
}

const PatientTransferOutToOTModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const [loading, setLoading] = useState(false);
    const { closeModal, selectedData, onApiCall } = props;
    const { toastMessage } = useToastMessage();

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            newBedStatusId: bedStatus.PostOT,
            admissionId: selectedData?.admissionId
        }

        setLoading(true);
        services.patientBedMovement(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    closeModal();
                    toastMessage(formatMessage({ id: "patient-transfer-message" }));
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
        <FormModal
            onCancel={closeModal}
            onConfirm={handleSubmit(onSubmit)}
            title={formatMessage({ id: "patient-transfer-out-to-post-ot" })}
            confirmLabel="Submit"
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomTextBox
                        label={formatMessage({ id: "transfer-date-time" })}
                        name="postOTDate"
                        control={control}
                        disabled={true}
                        defaultValue={dayjs(new Date()).format('DD-MM-YYYY hh:mm A')}
                    />
                </Grid>
            </Grid>
        </FormModal>
    )
}

export default PatientTransferOutToOTModal;