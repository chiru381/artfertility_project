import { FormattedMessage, useIntl } from 'react-intl';
import { ControllerProps, FormProviderProps } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { CustomCheckBox, CustomTextBox } from 'components/forms';
import { useEffect } from 'react';

interface Props {
    control: ControllerProps["control"];
    watch: FormProviderProps['watch'];
    setValue: FormProviderProps['setValue'];
    packageBillData?: any;
}

const SubventionAndFacilitatorView = ({ control, watch, packageBillData, setValue }: Props) => {
    const { formatMessage } = useIntl();

    useEffect(() => {
        if (packageBillData) {
            const { isSubvention, isFacilitator } = packageBillData;

            setValue("isSubvention", isSubvention);
            setValue("isFacilitator", isFacilitator);
            setValue("depositBy", "patient");
        }
    }, [packageBillData]);

    useEffect(() => {
        if (packageBillData) {
            const { merchantName, emiSchemeName, facilitatorFacilitatorPercentage, facilitatorPercentage, facilitatorName, facilitatorFacilitatorAmount, facilitatorAmount } = packageBillData;
            if (watch('isSubvention') === true) {
                setValue("merchantName", merchantName);
                setValue("emi", emiSchemeName);
            }
            if (watch('isFacilitator') === true) {
                setValue("facilitatorName", facilitatorName);
                setValue("facilitatorPercentage", facilitatorFacilitatorPercentage || facilitatorPercentage);
                setValue("facilitatorAmount", facilitatorFacilitatorAmount || facilitatorAmount);
            }
        }
    }, [watch('isSubvention'), watch('isFacilitator')]);


    return (
        <>
            <Grid item xs={12}>
                <div className="line" />
            </Grid>

            <Grid item xs={12}>
                <CustomCheckBox
                    label="Is Subvention package"
                    control={control}
                    name="isSubvention"
                    disabled
                />
                <CustomCheckBox
                    label="Is Facilitator"
                    control={control}
                    name="isFacilitator"
                    disabled
                />
            </Grid>

            {watch("isSubvention") && (
                <Grid item xs={12}>
                    <div style={{ background: "#F9F9F9", borderRadius: "7px", padding: "20px", border: "1px solid #EEEEEE" }}>
                        <Typography style={{ marginBottom: "10px" }} variant="body1" className="label-one bold">
                            <FormattedMessage id="subvention-package" />
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={6} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "merchant" })}
                                    control={control}
                                    name="merchantName"
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={6} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "emi-scheme" })}
                                    control={control}
                                    name="emi"
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            )}

            {watch("isFacilitator") && (
                <Grid item xs={12}>
                    <div style={{ background: "#F9F9F9", borderRadius: "7px", padding: "20px", border: "1px solid #EEEEEE" }}>
                        <Typography style={{ marginBottom: "10px" }} variant="body1" className="label-one bold">
                            <FormattedMessage id="facilitator-details" />
                        </Typography>

                        <Grid container spacing={3}>
                            <Grid item xs={6} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "facilitator" })}
                                    control={control}
                                    name="facilitatorName"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "facilitator" }) + " %"}
                                    control={control}
                                    name="facilitatorPercentage"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={6} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label={formatMessage({ id: "facilitator-amount" })}
                                    control={control}
                                    name="facilitatorAmount"
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            )}
        </>
    )
}

export default SubventionAndFacilitatorView;