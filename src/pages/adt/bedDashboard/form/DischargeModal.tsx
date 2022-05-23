import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import dayjs from 'dayjs';

import { CustomTextBox } from 'components/forms';
import { FormModal } from 'components';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void
}

const DischargeModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const [loading, setLoading] = useState(false);
    const { formatMessage } = useIntl();
    const { closeModal, selectedData, onApiCall } = props;
    const { toastMessage } = useToastMessage();

    function onSubmit(data: any) {
        const parms = {
            admissionId: selectedData.admissionId
        }
        setLoading(true);
        services.dischargeAdmittedPatient(parms)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    closeModal();
                    toastMessage(formatMessage({ id: "discharge-message" }));
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
            title={formatMessage({ id: "discharge" })}
            confirmLabel="Submit"
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomTextBox
                        label={formatMessage({ id: "disicharge-date-time" })}
                        name="dishargeDateTime"
                        control={control}
                        disabled={true}
                        defaultValue={dayjs(new Date()).format('DD-MM-YYYY hh:mm A')}
                    />
                </Grid>
            </Grid>
        </FormModal>
    )
}

export default DischargeModal;