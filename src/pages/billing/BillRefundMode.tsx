import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { FormProviderProps, ControllerProps, Controller, FieldErrors } from 'react-hook-form';

import Radio from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { CustomDatePicker, CustomTextBox } from 'components/forms';


interface Props {
    setValue: FormProviderProps["setValue"];
    watch: FormProviderProps["watch"];
    control: ControllerProps["control"];
    errors: FieldErrors;
    refundData?: any;
}

const BillpaymentModeId = ({ setValue, control, watch, errors, refundData }: Props) => {
    const { formatMessage } = useIntl();

    useEffect(() => {
        if (refundData) {
            const { paymentModeId, payableName, remarks, cardNumber, issueDate, ifscCode } = refundData;
            setValue("paymentModeId", String(paymentModeId));
            setValue("payableName", payableName);
            setValue("remarks", remarks);
            setValue("cardNumber", cardNumber);
            setValue("issueDate", issueDate);
            setValue("IFSCCode", ifscCode);
        } else {
            setValue("paymentModeId", "1");
        }
    }, []);

    return (
        <>
            <Grid item xs={12} style={{ paddingBottom: "0px" }}>
                <div className="flex-center">
                    <Typography variant="body1" className="label-one">
                        {formatMessage({ id: 'refund-mode' })}:
                    </Typography>

                    <FormControl component="fieldset" style={{ marginLeft: "20px" }}>
                        <Controller
                            name="paymentModeId"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup row aria-label="refund-mode" {...field} value={field.value || ""}>
                                    <FormControlLabel disabled={refundData ? true : false} value="1" control={<Radio color="primary" />} label="Cash" />
                                    <FormControlLabel disabled={refundData ? true : false} value="5" control={<Radio color="primary" />} label="Cheque" />
                                    <FormControlLabel disabled={refundData ? true : false} value="4" control={<Radio color="primary" />} label="NEFT" />
                                </RadioGroup>
                            )}
                        />
                    </FormControl>
                </div>
            </Grid>

            {watch('paymentModeId') !== "1" && (
                <Grid item xs={12} style={{ paddingTop: "0px" }}>
                    <div className="line" />
                </Grid>
            )}

            {watch('paymentModeId') === "5" && (
                <>
                    <Grid item xs={6} lg={3} md={4} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "payable-name" })}
                            control={control}
                            name="payableName"
                            rules={{ required: refundData ? false : true }}
                            error={errors.payableName}
                            disabled={refundData ? true : false}
                        />
                    </Grid>
                    <Grid item xs={6} lg={3} md={4} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "remarks" })}
                            control={control}
                            name="remarks"
                            disabled={refundData ? true : false}
                        />
                    </Grid>
                    <Grid item xs={6} lg={3} md={4} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "cheque" }) + "#"}
                            control={control}
                            name="cardNumber"
                            rules={{ required: refundData ? false : true }}
                            error={errors.cardNumber}
                            type="number"
                            disabled={refundData ? true : false}
                        />
                    </Grid>
                    <Grid item xs={6} lg={3} md={4} sm={6}>
                        <CustomDatePicker
                            label={formatMessage({ id: "transfer-date" })}
                            control={control}
                            name="issueDate"
                            rules={{ required: refundData ? false : true }}
                            error={errors.issueDate}
                            minDate={new Date()}
                            disabled={refundData ? true : false}
                        />
                    </Grid>
                </>
            )}

            {watch('paymentModeId') === "4" && (
                <>
                    <Grid item xs={6} lg={3} md={4} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "payable-name" })}
                            control={control}
                            name="payableName"
                            rules={{ required: refundData ? false : true }}
                            error={errors.payableName}
                            disabled={refundData ? true : false}
                        />
                    </Grid>
                    <Grid item xs={6} lg={3} md={4} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "remarks" })}
                            control={control}
                            name="remarks"
                            disabled={refundData ? true : false}
                        />
                    </Grid>
                    <Grid item xs={6} lg={3} md={4} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "ac-no" })}
                            control={control}
                            name="cardNumber"
                            rules={{ required: refundData ? false : true }}
                            error={errors.cardNumber}
                            type="number"
                            disabled={refundData ? true : false}
                        />
                    </Grid>
                    <Grid item xs={6} lg={3} md={4} sm={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "ifsc-code" })}
                            control={control}
                            name="IFSCCode"
                            rules={{ required: refundData ? false : true }}
                            error={errors.IFSCCode}
                            disabled={refundData ? true : false}
                        />
                    </Grid>
                    <Grid item xs={6} lg={3} md={4} sm={6}>
                        <CustomDatePicker
                            label={formatMessage({ id: "issue-date" })}
                            control={control}
                            name="issueDate"
                            rules={{ required: refundData ? false : true }}
                            error={errors.issueDate}
                            minDate={new Date()}
                            disabled={refundData ? true : false}
                        />
                    </Grid>
                </>
            )}

        </>
    )
}

export default BillpaymentModeId;