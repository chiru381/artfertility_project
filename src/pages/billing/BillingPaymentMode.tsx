import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { ControllerProps, FieldErrors, FormProviderProps, useFieldArray } from 'react-hook-form';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import { masterPaginationServices } from 'utils/constants';
import { SecondaryButton } from 'components/button';
import { CustomSelect, CustomTextBox } from 'components/forms';
import { RootReducerState } from 'utils/types';
import { useCreateDropdownOptions, useCreateLookupOptions, useToastMessage } from 'utils/hooks';
import { getMasterPaginationData } from 'redux/actions';
import { validationRule } from 'utils/global';

interface Props {
    control: ControllerProps["control"];
    watch: FormProviderProps['watch'];
    setValue: FormProviderProps['setValue'];
    getValues?: FormProviderProps['getValues'];
    errors?: FieldErrors;
    billAmount?: number;
    transactionType?: number;
}

const BillingPaymentMode = ({ control, errors, watch, setValue, billAmount, getValues, transactionType }: Props) => {
    const { append, fields, remove } = useFieldArray({ control, name: 'paymentBreakups' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();

    const { billingLookupData, paymentModeData } = useSelector(
        ({ masterPaginationReducer, billingLookupReducer }: RootReducerState) => {
            return ({
                billingLookupData: billingLookupReducer.data,
                paymentModeData: masterPaginationReducer[masterPaginationServices.paymentMode].data,
            })
        },
        shallowEqual
    );
    let selectOptions = useCreateLookupOptions(billingLookupData);
    let paymentModeOptions = useCreateDropdownOptions(paymentModeData.modelItems, 'isReletedToDeposit', true);

    useEffect(() => {
        if (billAmount) {
            append({ transactionType: transactionType, amount: billAmount });
        } else {
            append({ transactionType: transactionType });
        }
        if (!paymentModeData.modelItems.length) {
            dispatch(getMasterPaginationData(masterPaginationServices.paymentMode, {}));
        }
    }, []);

    useEffect(() => {
        if (paymentModeOptions?.length) {
            setValue("paymentBreakups[0][paymentModeId]", paymentModeOptions[0]);
            setValue(`paymentBreakups[0][paymentModeName]`, paymentModeOptions[0].label);
        }
    }, [paymentModeOptions]);

    function addPaymentMode() {
        if (getValues && billAmount) {
            const { paymentBreakups } = getValues();
            let totalPaymentAmount = paymentBreakups.reduce((acc: any, curr: any) => {
                return acc + +curr.amount;
            }, 0);
            if (totalPaymentAmount >= billAmount) {
                toastMessage("Amount already exceed.", "error");
            } else {
                append({ transactionType: transactionType, amount: billAmount - totalPaymentAmount });
            }
        } else {
            append({ transactionType: transactionType });
        }
    }

    return (
        <>
            {fields.map(({ id }, index) => (
                <Grid item xs={12} key={id}>
                    <Grid container spacing={3}>
                        <Grid item xs={6} lg={3} md={4} sm={6}>
                            <CustomSelect
                                label={formatMessage({ id: "mode-of-payment" })}
                                options={paymentModeOptions}
                                control={control}
                                rules={{
                                    required: true,
                                    validate: (value) => {
                                        if (value) {
                                            let filterPaymentData = fields.filter(payment => payment.id !== id);
                                            let dublicatePaymentMode = filterPaymentData.find((payment: any) => +payment?.paymentModeId?.value === +value.value);
                                            return dublicatePaymentMode ? "This payment mode is already selected." : true;
                                        } else {
                                            return true;
                                        }
                                    }
                                }}
                                name={`paymentBreakups[${index}][paymentModeId]`}
                                error={errors?.[`paymentBreakups`]?.[index]?.['paymentModeId']}
                                onChangeValue={data => {
                                    if (data) {
                                        setValue(`paymentBreakups[${index}][paymentModeName]`, data.label);
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} lg={3} md={4} sm={6}>
                            <CustomTextBox
                                label={formatMessage({ id: "amount" })}
                                name={`paymentBreakups[${index}][amount]`}
                                error={errors?.[`paymentBreakups`]?.[index]?.['amount']}
                                rules={validationRule.textbox({ required: true, type: "numberWithDecimal" })}
                                control={control}
                                type="number"
                            />
                        </Grid>

                        {(index !== 0 || fields.length > 1) && (
                            <Grid item xs={6} lg={3} md={4} sm={6}>
                                <SecondaryButton
                                    label={formatMessage({ id: "remove-this-payment-mode" })}
                                    color="secondary"
                                    onClick={() => remove(index)}
                                />
                            </Grid>
                        )}

                        {(watch(`paymentBreakups[${index}][paymentModeId]`) && watch(`paymentBreakups[${index}][paymentModeId]`)?.value !== 1) && (
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6} lg={3} md={4} sm={6}>
                                        <CustomTextBox
                                            label={formatMessage({ id: "enter-card-number" })}
                                            name={`paymentBreakups[${index}][cardNumber]`}
                                            error={errors?.[`paymentBreakups`]?.[index]?.['cardNumber']}
                                            rules={{ required: true }}
                                            control={control}
                                        />
                                    </Grid>
                                    <Grid item xs={6} lg={3} md={4} sm={6}>
                                        <CustomTextBox
                                            label={formatMessage({ id: "enter-approval-code" })}
                                            name={`paymentBreakups[${index}][approvalCode]`}
                                            error={errors?.[`paymentBreakups`]?.[index]?.['approvalCode']}
                                            rules={{ required: true }}
                                            control={control}
                                        />
                                    </Grid>
                                    <Grid item xs={6} lg={3} md={4} sm={6}>
                                        <CustomSelect
                                            label={formatMessage({ id: "bank" })}
                                            options={selectOptions?.bankDetails ?? []}
                                            control={control}
                                            rules={{ required: true }}
                                            name={`paymentBreakups[${index}][bankDetailId]`}
                                            error={errors?.[`paymentBreakups`]?.[index]?.['bankDetailId']}
                                            onChangeValue={data => {
                                                if (data) {
                                                    setValue(`paymentBreakups[${index}][bankDetailName]`, data.label)
                                                }
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            ))}

            {(fields.length < paymentModeOptions.length) && (
                <Grid item xs={6} lg={3} md={4} sm={6}>
                    <SecondaryButton
                        label={formatMessage({ id: "add-other-payment-mode" })}
                        onClick={addPaymentMode}
                    />
                </Grid>
            )}
        </>
    )
}

export default BillingPaymentMode;