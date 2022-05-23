import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { shallowEqual, useSelector } from 'react-redux';

import { CustomSelect, CustomTextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { getFormBody } from 'utils/global';
import { services } from 'utils/services';
import { useCreateLookupOptions, useToastMessage } from 'utils/hooks';
import { RootReducerState } from 'utils/types';


interface Props {
    closeModal: () => void;
    onApiCall: () => void;
    selectedAppointment: any;
}

const CancelAppointmentModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall, selectedAppointment } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();

    const { appointmentLookupData } = useSelector(
        ({ appointmentLookupReducer }: RootReducerState) => {
            return ({
                appointmentLookupData: appointmentLookupReducer.data
            })
        },
        shallowEqual
    );

    // Lookup options for dropdown
    let selectOptions = useCreateLookupOptions(appointmentLookupData);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        let formData = {
            ...bodyData,
            appointmentId: selectedAppointment.id,
            isCancelled: true,
            resourceId: selectedAppointment.resourceId,
            clinicId: selectedAppointment.clinicId
        }

        setLoading(true);
        services.cancelAppointment(formData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "appointment-cancel-message" }));
                    closeModal();
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
                title={formatMessage({ id: "cancel-appointment" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomSelect
                            label={formatMessage({ id: "cancel-reason" })}
                            options={selectOptions?.rescheduleReasons ?? []}
                            control={control}
                            name="rescheduleReasonId"
                            error={errors.rescheduleReasonId}
                            rules={{ required: true }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "remarks" })}
                            name="rescheduleRemark"
                            control={control}
                            error={errors.rescheduleRemark}
                        />
                    </Grid>
                </Grid>
            </FormModal>

            {loading && <HoverLoader />}
        </>
    )
}

export default CancelAppointmentModal;