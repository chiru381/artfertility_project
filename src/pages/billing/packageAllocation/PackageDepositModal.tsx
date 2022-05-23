import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useForm, Controller } from 'react-hook-form';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import { services } from 'utils/services';
import { HoverLoader } from 'components';
import { getFormBody } from 'utils/global';
import { buttonIconStyle, images, transactionType } from 'utils/constants';
import { useToastMessage } from 'utils/hooks';
import { ButtonGroup, PrimaryButton, SecondaryButton } from 'components/button';
import { CustomTextBox, FormPrimaryHeading } from 'components/forms';
import SubventionAndFacilitatorView from './SubventionAndFacilitatorView';
import BillingPaymentMode from '../BillingPaymentMode';
import InPatientUserDetailForm from './InPatientUserDetailForm';

interface Props {
    closeModal: () => void;
    selectedPackageBill: any
}


const PackageDepositModal = React.memo((props: Props) => {
    const { closeModal, selectedPackageBill } = props;
    const { handleSubmit, formState: { errors }, control, watch, register, getValues, setValue, clearErrors } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [loading, setLoading] = useState(false);
    const [depositData, setDepositData] = useState<any>(null);
    let billAmount = depositData?.minimumDepositAmountRequired ?? null;

    useEffect(() => {
        setValue("depositBy", "patient");

        if (selectedPackageBill) {
            setLoading(true);
            services.getPackageDepositByPatientId({ patientId: selectedPackageBill.patientId })
                .then(res => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        setDepositData(res.data.response);
                        setValue('minimumDeposit', res.data.response?.minimumDepositAmountRequired);
                        setValue("packageAmount", res.data.response.packageAmount);
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch(() => setLoading(false))
        }
    }, []);

    function onSubmit({ depositBy, paymentBreakups, minimumDeposit, packageAmount }: any) {
        let totalPayment = 0;
        let totalPaymentBreakups = paymentBreakups.map((payment: any) => {
            totalPayment += +payment.amount;
            return ({ ...getFormBody(payment, true), amount: +payment.amount });
        })

        let params = {
            packageAllocationId: selectedPackageBill.id,
            isAmountPending: minimumDeposit ? (minimumDeposit < totalPayment) : false,
            isDepositAvailedfromMerchant: depositBy === "merchant",
            depositAmount: totalPayment,
            paymentBreakups: totalPaymentBreakups,
        }

        setLoading(true);
        services.createPackageDeposit(params)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: "Package deposited successfully" }));
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
                                label={formatMessage({ id: "package-deposit" })}
                            />

                            <ButtonGroup>
                                <PrimaryButton
                                    label="Deposit"
                                    endIcon={<img src={images.packageWhiteIcon} style={buttonIconStyle} alt="package-deposit" />}
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={!depositData}
                                />

                                <SecondaryButton
                                    label={formatMessage({ id: "cancel" })}
                                    onClick={closeModal}
                                />
                            </ButtonGroup>
                        </div>

                        <div className="full-modal-body-container">
                            <Grid container spacing={3}>

                                <InPatientUserDetailForm
                                    control={control}
                                    setValue={setValue}
                                    packageBillData={depositData}
                                />

                                <SubventionAndFacilitatorView
                                    control={control}
                                    watch={watch}
                                    setValue={setValue}
                                    packageBillData={depositData}
                                />

                                <Grid item xs={12}>
                                    <div className="line" />
                                </Grid>

                                <Grid item xs={12} style={{ paddingTop: "0px" }}>
                                    <div className="flex-center">
                                        <Typography variant="body1" className="label-one">
                                            {formatMessage({ id: 'deposit-by' })}:
                                        </Typography>

                                        <FormControl component="fieldset" style={{ marginLeft: "20px" }}>
                                            <Controller
                                                name="depositBy"
                                                control={control}
                                                render={({ field }) => (
                                                    <RadioGroup row aria-label="deposit-by" {...field} value={field.value || ""}>
                                                        <FormControlLabel value="patient" control={<Radio color="primary" />} label={formatMessage({ id: 'patient' })} />
                                                        <FormControlLabel value="merchant" control={<Radio color="primary" />} label={formatMessage({ id: 'merchant' })} />
                                                    </RadioGroup>
                                                )}
                                            />
                                        </FormControl>
                                    </div>
                                </Grid>

                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "package-amount" })}
                                        control={control}
                                        name="packageAmount"
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={3} md={4} sm={6}>
                                    <CustomTextBox
                                        label={formatMessage({ id: "minimum-deposit" })}
                                        control={control}
                                        name="minimumDeposit"
                                        InputProps={{ readOnly: true }}
                                    />
                                </Grid>

                                {billAmount !== null ? (
                                    <BillingPaymentMode
                                        control={control}
                                        watch={watch}
                                        errors={errors}
                                        setValue={setValue}
                                        transactionType={transactionType.PackageDeposit}
                                        billAmount={billAmount}
                                    />
                                ) : null}

                            </Grid>
                        </div>

                    </Box>
                </div>

                {loading && <HoverLoader />}
            </>
        </Modal>
    )
});

export default PackageDepositModal;