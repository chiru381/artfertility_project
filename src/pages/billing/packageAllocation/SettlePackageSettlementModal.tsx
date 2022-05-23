import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';

import Grid from '@material-ui/core/Grid';

import { CustomTextBox, TextBox } from 'components/forms';
import { FormModal } from 'components';
import SubventionAndFacilitatorView from './SubventionAndFacilitatorView';
import { useCalculateFolioServiceItem } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    packageBillData: { [key: string]: any };
    onConfirmBillSettlement: () => void;
    folioServiceItem: { [key: string]: any }[];
}


const SettlePackageSettlementModal = (props: Props) => {
    const { closeModal, packageBillData, onConfirmBillSettlement, folioServiceItem } = props;
    const { handleSubmit, control, watch, setValue } = useForm();
    const { formatMessage } = useIntl();

    const { totalNetAmount } = useCalculateFolioServiceItem(folioServiceItem);
    let packageAmount = packageBillData?.packageAmount;
    let depositedAmount = packageBillData?.totalDepositAmount;


    function onSubmit(data: any) {
        if (onConfirmBillSettlement) {
            onConfirmBillSettlement();
            closeModal();
        }
    }

    return (
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                confirmLabel="Settle"
                title={formatMessage({ id: "package-settlement" })}
                modalSize="medium"
            >
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextBox
                            label={formatMessage({ id: "package-amount" })}
                            disabled
                            value={packageAmount}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextBox
                            label={formatMessage({ id: "deposited-amount" })}
                            disabled
                            value={depositedAmount}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextBox
                            label={formatMessage({ id: "billed-amount" })}
                            value={totalNetAmount}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "unused-amount" })}
                            control={control}
                            name="unusedAmount"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextBox
                            label={formatMessage({ id: "to-be-adjusted" })}
                            value={depositedAmount > totalNetAmount ? totalNetAmount : depositedAmount}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextBox
                            label={formatMessage({ id: "out-of-package" })}
                            value={packageAmount < totalNetAmount ? (totalNetAmount - packageAmount) : 0}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextBox
                            label={formatMessage({ id: "patient-payable" })}
                            value={depositedAmount > totalNetAmount ? 0 : (totalNetAmount - depositedAmount)}
                            disabled
                        />
                    </Grid>

                    <SubventionAndFacilitatorView
                        control={control}
                        watch={watch}
                        setValue={setValue}
                        packageBillData={packageBillData}
                    />

                </Grid>
            </FormModal>
        </>
    )
}

export default SettlePackageSettlementModal;