import Grid from '@material-ui/core/Grid';
import { useIntl } from 'react-intl';
import { ControllerProps } from "react-hook-form";

import { CustomCheckBox, CustomSelect, CustomTextBox } from 'components/forms';
import { PrimaryButton, SecondaryButton } from 'components/button';


interface Props {
    control: ControllerProps["control"];
}

const IVFLabRequestInfo = ({ control }: Props) => {
    const { formatMessage } = useIntl();

    return (
        <>
            <Grid item lg={5} md={6} sm={12} xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "request-id" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "request-date" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "request-doctor" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "requesting-comments" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <CustomSelect
                            label={formatMessage({ id: "sample-type" })}
                            name="patientType"
                            control={control}
                            options={[]}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <CustomTextBox
                            label={formatMessage({ id: "sample-id" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item lg={5} md={6} sm={12} xs={12} style={{ borderLeft: "1px solid #CFCBCB" }}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "patient-name" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "patient-uhid" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "test-name" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "partner-name" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "partner-uhid" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "cycle-id" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "validated-by" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "witness" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "test-result-date-and-time" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "validation-date-and-time" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <CustomCheckBox
                            name="isExternal"
                            label={formatMessage({ id: "external" })}
                            control={control}
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item lg={2} md={4} sm={6} xs={12} style={{ borderLeft: "1px solid #CFCBCB" }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomSelect
                            name="isExternal"
                            label={formatMessage({ id: "test-request-status" })}
                            control={control}
                            options={[]}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            name="isExternal"
                            label={formatMessage({ id: "billing-test-order" })}
                            control={control}
                            options={[]}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <PrimaryButton
                            label={formatMessage({ id: "place-order" })}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <SecondaryButton
                            label={formatMessage({ id: "freeze-sample" })}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default IVFLabRequestInfo;