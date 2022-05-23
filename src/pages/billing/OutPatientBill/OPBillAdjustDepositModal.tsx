import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';

import { CustomDatePicker, CustomTextBox, TextBox } from 'components/forms';
import { FormModal } from 'components';
import { ButtonGroup, PrimaryButton } from 'components/button';
import { floatNumConv } from 'utils/global';

interface Props {
    closeModal: () => void;
    patientTransactionData?: any;
    totalBillAmount?: number;
    depositAmountAvail?: null | number;
    setDepositAmountAvail: React.Dispatch<React.SetStateAction<null | number>>;
}

const OPBillAdjustDepositModal = (props: Props) => {
    const { closeModal, patientTransactionData, totalBillAmount, depositAmountAvail, setDepositAmountAvail } = props;
    const { handleSubmit, formState: { errors }, control, setValue, watch } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { totalDepositAmount, lastDepositUsedDate, lastDepositUsedAmount, balanceDepositAmount } = patientTransactionData;
    let balanceAmount = useMemo(() => totalDepositAmount - balanceDepositAmount - +watch('adjustedAmount'), [watch('adjustedAmount')]);

    useEffect(() => {
        setValue('totalDepositAmount', floatNumConv(totalDepositAmount));
        setValue('usedDepositAmount', floatNumConv(totalDepositAmount - balanceDepositAmount));
        setValue('lastUsedDate', lastDepositUsedDate);
        setValue('lastUsedAmount', floatNumConv(lastDepositUsedAmount));
        setValue('adjustedAmount', floatNumConv(depositAmountAvail ?? totalBillAmount));
    }, []);

    function onSubmit({ adjustedAmount }: any) {
        setDepositAmountAvail(+adjustedAmount);
        closeModal();
    }

    function CustomFooter() {
        return (
            <ButtonGroup>
                <PrimaryButton
                    label={formatMessage({ id: "reset" })}
                    onClick={() => setDepositAmountAvail(null)}
                />
                <PrimaryButton
                    label={formatMessage({ id: "adjust-deposit" })}
                    onClick={handleSubmit(onSubmit)}
                    disabled={balanceAmount < 0}
                />
            </ButtonGroup>
        )
    }


    return (
        <>
            <FormModal
                onCancel={closeModal}
                title={formatMessage({ id: "adjust-through-deposit" })}
                customFooter={CustomFooter()}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "deposited-amount" })}
                            name="totalDepositAmount"
                            control={control}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "total-consumed-amount" })}
                            name="usedDepositAmount"
                            control={control}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomDatePicker
                            control={control}
                            label={formatMessage({ id: "last-used-date" })}
                            name="lastUsedDate"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "last-used-amount" })}
                            name="lastUsedAmount"
                            control={control}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "amount-to-be-adjusted" })}
                            name="adjustedAmount"
                            control={control}
                            error={errors.adjustedAmount}
                            type="number"
                            rules={{
                                required: true,
                                validate: value => totalBillAmount ? (value > totalBillAmount) ? "Adjusted Amount cannot be greater than Bill Amount" : true : true
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextBox
                            label={formatMessage({ id: "balance-deposit-amount" })}
                            value={floatNumConv(balanceAmount)}
                            disabled
                        />
                    </Grid>
                </Grid>
            </FormModal>

        </>
    )
}

export default OPBillAdjustDepositModal;