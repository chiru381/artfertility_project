import { useEffect, useState, memo } from 'react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { CustomTextBox } from 'components/forms';
import { Grid } from '@material-ui/core';

import { CustomDialog } from 'components';
import { useForm } from 'react-hook-form';
import { validationRule } from 'utils/global';

interface Props {
    patientBillingData: any;
    closeModal?: () => void;
    onAgreePatientAppointment?: () => void;
}

const BillUserAlert = memo((props: Props) => {
    const { patientBillingData, closeModal, onAgreePatientAppointment } = props;
    const { formatMessage } = useIntl();
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });

    const [appointmentPopupOpen, setAppointmentPopupOpen] = useState(false);
    const [pendingOrderPopupOpen, setPendingOrderPopupOpen] = useState(false);
    const [packagePopupOpen, setPackagePopupOpen] = useState(false);
    const [packageFromPopupOpen, setPackageFormPopupOpen] = useState(false);

    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [selectedPackage, setSelectedPackage] = useState<any>(null);

    useEffect(() => {
        if (patientBillingData) {
            const { isAppointment, isPendingOrders, isPackage, appointments, packageAllocations } = patientBillingData;
            setAppointmentPopupOpen(isAppointment);
            setPendingOrderPopupOpen(isPendingOrders);
            setPackagePopupOpen(isPackage);

            if (appointments?.length) {
                setSelectedAppointment(appointments[0]);
            }

            if (packageAllocations?.length) {
                setSelectedPackage(packageAllocations[0]);
            }
        }
    }, [patientBillingData]);

    function onAgreeAppointment() {
        setAppointmentPopupOpen(false);
        if (onAgreePatientAppointment) {
            onAgreePatientAppointment();
        }
    }

    function onAgreePendingOrder() {
        setPendingOrderPopupOpen(false);
    }

    function onAgreePackage() {
        setPackagePopupOpen(false);
        setPackageFormPopupOpen(true);
    }

    function onDisAgreePackage() {
        setPackagePopupOpen(false);
        if (closeModal) {
            closeModal();
        }
    }

    function onAgreePackageAlertForm(data: any) {
        setPackageFormPopupOpen(false);
    }

    return (
        <>
            <CustomDialog
                open={appointmentPopupOpen}
                onDisagree={() => setAppointmentPopupOpen(false)}
                onAgree={onAgreeAppointment}
                title={String(formatMessage({ id: "appointment-alert" })).toUpperCase()}
                subTitle={`Patient has ${selectedAppointment?.visitTypeName} appointment with Dr. ${selectedAppointment?.medicalStaffUserDisplayName} today at ${selectedAppointment ? dayjs(selectedAppointment?.appointmentDateTime).format('hh:mm A') : null}, Do you want to add this service to the bill basket?`}
            />

            <CustomDialog
                open={pendingOrderPopupOpen}
                onDisagree={() => setPendingOrderPopupOpen(false)}
                onAgree={onAgreePendingOrder}
                title={String(formatMessage({ id: "pending-order-alert" })).toUpperCase()}
                subTitle="Patient has pending doctor orders prescribed <Date> by Dr Prof. Human Fatemi, Do you want to copy to the bill basket?"
            />

            <CustomDialog
                open={packagePopupOpen}
                onDisagree={onDisAgreePackage}
                onAgree={onAgreePackage}
                title={String(formatMessage({ id: "package-alert" })).toUpperCase()}
                subTitle={`This patient is already undergoing with ${selectedPackage?.packageName} do you want to continue?`}
            />

            <CustomDialog
                agreeLabel={formatMessage({id: "proceed"})}
                disagreeLabel={formatMessage({id: "cancel"})}
                open={packageFromPopupOpen}
                onDisagree={() => setPackageFormPopupOpen(false)}
                onAgree={handleSubmit(onAgreePackageAlertForm)}
                title={String(formatMessage({ id: "package-alert" })).toUpperCase()}
                dialogContent={<PackageAlertFormContent control={control} errors={errors} />}
            />
        </>
    )
});

export default BillUserAlert;


const PackageAlertFormContent = memo(({ control, errors }: any) => {
    const { formatMessage } = useIntl();

    return (
        <Grid container spacing={2} style={{ margin: "10px 0" }}>
            <Grid item xs={6}>
                <CustomTextBox
                    label={formatMessage({ id: "reason-for-billing" })}
                    name="billingReason"
                    control={control}
                    error={errors.billingReason}
                    rules={validationRule.textbox({ required: true })}
                />
            </Grid>
            <Grid item xs={6}>
                <CustomTextBox
                    label={formatMessage({ id: "approved-by" })}
                    name="approvedBy"
                    control={control}
                    error={errors.approvedBy}
                    rules={validationRule.textbox({ required: true })}
                />
            </Grid>
        </Grid>
    )
})