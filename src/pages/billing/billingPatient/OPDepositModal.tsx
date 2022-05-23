import React, { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';

import { buttonIconStyle, images, transactionType } from 'utils/constants';
import { ButtonGroup, PrimaryButton, SecondaryButton } from 'components/button';
import { FormPrimaryHeading } from 'components/forms';
import BillingUserDetailForm from '../OutPatientBill/BillingUserDetailForm';
import BillingPaymentMode from '../BillingPaymentMode';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { HoverLoader } from 'components';
import { getFormBody } from 'utils/global';

interface Props {
    closeModal: () => void;
    patientId: number;
}

const OPDepositModal = React.memo((props: Props) => {
    const { closeModal, patientId } = props;
    const { handleSubmit, formState: { errors }, control, watch, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    let paymentBreakups = watch('paymentBreakups');
    let depositAmount = useMemo(() => {
        return paymentBreakups?.reduce((acc: number, curr: any) => acc + +(curr.amount ?? 0), 0) ?? 0;
    }, [paymentBreakups]);

    function onSubmit({ paymentBreakups }: any) {
        const { id: patientId, uhid: patientUHID, clinicId } = selectedPatient;
        let bodyData = {
            patientId, patientUHID, clinicId, depositAmount,
            "paymentBreakups": paymentBreakups.map((payment: any) => ({ ...getFormBody(payment, true), amount: +payment.amount }))
        }

        setLoading(true);
        services.createOPDeposit(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage("OP depsoited Successfully");
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
        <Modal open={true}>
            <>
                <div className="full-modal-container">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading
                                textTransform="uppercase"
                                label={formatMessage({ id: "op-deposit" })}
                            />

                            <ButtonGroup>
                                <PrimaryButton
                                    label={formatMessage({ id: "deposit" })}
                                    endIcon={<img src={images.packageWhiteIcon} style={buttonIconStyle} alt="op-deposit" />}
                                    onClick={handleSubmit(onSubmit)}
                                />

                                <SecondaryButton
                                    label={formatMessage({ id: "cancel" })}
                                    onClick={() => {
                                        closeModal();
                                    }}
                                />
                            </ButtonGroup>
                        </div>

                        <div className="full-modal-body-container">
                            <Grid container spacing={3}>

                                <BillingUserDetailForm
                                    control={control}
                                    setValue={setValue}
                                    patientId={patientId}
                                    setSelectedPatientData={setSelectedPatient}
                                />

                                <Grid item xs={12}>
                                    <div className="line" />
                                </Grid>


                                <Grid item xs={12}>
                                    <div className="flex-center">
                                        <div className="flex-center" style={{ marginRight: "30px" }}>
                                            <Typography variant="body1" className="label-one uppercase">
                                                {formatMessage({ id: 'deposit-amount' })}:
                                            </Typography>
                                            <Typography variant="body1" className="label-input">{depositAmount}</Typography>
                                        </div>
                                    </div>
                                </Grid>

                                <BillingPaymentMode
                                    control={control}
                                    watch={watch}
                                    setValue={setValue}
                                    transactionType={transactionType.OPDeposit}
                                    errors={errors}
                                />

                            </Grid>
                        </div>

                    </Box>
                </div>

                {loading && <HoverLoader />}

            </>
        </Modal>
    )
});

export default OPDepositModal;