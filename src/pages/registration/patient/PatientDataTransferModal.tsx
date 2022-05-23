import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';

import { CustomCheckBox, CustomSelect, CustomTextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { getFormBody } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';

interface Props {
    closeModal: () => void;
}

const PatientDataTransferModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal } = props;

    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();

    function onSubmit(data: any) {
        // let bodyData = getFormBody(data);
        // setLoading(true);
        // services.createCountry(bodyData)
        //     .then((res) => {
        //         setLoading(false);
        //         if (res.data?.succeeded) {
        //             toastMessage(formatMessage({ id: "insert-message" }));
        //             closeModal();
        //         } else {
        //             toastMessage(res.data?.message, 'error');
        //         }
        //     })
        //     .catch((err) => {
        //         setLoading(false);
        //         toastMessage(err.message, 'error');
        //     })
    }

    return (
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={formatMessage({ id: "patient-data-transfer" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomSelect
                            label={formatMessage({ id: "clinic" })}
                            options={[]}
                            control={control}
                            name="clinicId"
                            error={errors.clinicId}
                            rules={{ required: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            label={formatMessage({ id: "transfer-reason" })}
                            options={[]}
                            control={control}
                            name="transferReasonid"
                            error={errors.transferReasonid}
                            rules={{ required: true }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "partner-uhid" })}
                            name="uhid"
                            control={control}
                            error={errors.uhid}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomCheckBox
                            name="isTransferPartner"
                            label={formatMessage({ id: "transfer-partner-data" }) + "?"}
                            control={control}
                        />
                    </Grid>
                </Grid>
            </FormModal>

            {loading && <HoverLoader />}
        </>
    )
}

export default PatientDataTransferModal