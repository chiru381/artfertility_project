import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { useForm } from "react-hook-form";

import { ButtonGroup, SaveButton } from "components/button";
import { CustomCheckBox, CustomDatePicker, CustomSelect, CustomTextBox, TextBox } from "components/forms";
import { currencyOptions, patientFolioStage } from "utils/constants";
import { Paper } from "@material-ui/core";

interface Props {

}

const BillingParameter = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });

    return (
        <div>

            <Box className="container scroll-root-container">
                <Paper className="scroll-root-body">
                    <Box p={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} lg={3} md={4} sm={6}>
                                        <TextBox
                                            label="Clinic"
                                            value="ART Fertility Clinic Abu Dabhi"
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={3} md={4} sm={6}>
                                        <CustomDatePicker
                                            label="Effective From"
                                            control={control}
                                            name="effectiveDate"
                                        />
                                    </Grid>
                                    <Grid item xs={12} lg={3} md={4} sm={6}>
                                        <CustomCheckBox
                                            label="Registration Fee to be Refunded"
                                            name="isRefunded"
                                            control={control}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <div className="line" />
                            </Grid>

                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label="Pending Order Validity"
                                    name="validity"
                                    control={control}
                                    helperText="in days"
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label="Refund Days Limit"
                                    name="refundDays"
                                    control={control}
                                    helperText="in days"
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomSelect
                                    label="Default Currency"
                                    name="currency"
                                    control={control}
                                    options={currencyOptions}
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomTextBox
                                    label="Email Trigerred on Payer Expiry"
                                    name="emailTrigerredDays"
                                    control={control}
                                    helperText="in days"
                                />
                            </Grid>
                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomSelect
                                    label="Email sent to?"
                                    name="emailRole"
                                    control={control}
                                    options={currencyOptions}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <div className="line" />
                            </Grid>

                            <Grid item xs={12} lg={3} md={4} sm={6}>
                                <CustomSelect
                                    label="Stage of Patient Folio - Daycare"
                                    name="emailRole"
                                    control={control}
                                    options={patientFolioStage}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <ButtonGroup>
                                    <SaveButton />
                                </ButtonGroup>
                            </Grid>

                        </Grid>
                    </Box>
                </Paper>

            </Box>
        </div>
    )
}

export default BillingParameter;