import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import { ControllerProps, FieldErrors } from 'react-hook-form';

import { CustomCheckBox, CustomTextBox } from 'components/forms';
import { validationRule } from 'utils/global';


interface Props {
    control: ControllerProps["control"];
    errors: FieldErrors;
}

const TreatmentProcessPatientInfo = ({ control, errors }: Props) => {
    const { formatMessage } = useIntl();

    return (
        <Grid item xs={12}>
            <Paper elevation={0} style={{ background: '#FBFBFB', padding: "19px 15px", border: "1px solid #C2C2C2" }}>

                <Grid container spacing={1}>
                    <Grid item xs={12} lg={2} sm={4}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    formLabel={formatMessage({ id: "height" })}
                                    name="height"
                                    control={control}
                                    type="number"
                                    rules={validationRule.textbox({ type: "number" })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    formLabel={formatMessage({ id: "weight" })}
                                    name="weight"
                                    control={control}
                                    type="number"
                                    rules={validationRule.textbox({ type: "number" })}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomTextBox
                                    formLabel={formatMessage({ id: "bmi" })}
                                    name="bmi"
                                    control={control}
                                    type="number"
                                    rules={validationRule.textbox({ type: "number" })}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} lg={10} sm={8}>
                        <Grid container spacing={1}>

                            <Grid item sm={1} style={{ display: "flex", justifyContent: "center" }}>
                                <div style={{ height: "100%", width: "1px", background: "#C2C2C2" }} />
                            </Grid>

                            <Grid item xs={12} sm={11} >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} >
                                        <CustomTextBox
                                            formLabel={formatMessage({ id: "interesting-observations-from-laboratory" })}
                                            name="interestingObservationsForlab"
                                            control={control}
                                            fullWidth
                                            rules={validationRule.textbox({ maxLength: 500 })}
                                            error={errors?.interestingObservationsForlab}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomTextBox
                                            formLabel={formatMessage({ id: "observation-stimulation" })}
                                            name="observationStimulation"
                                            control={control}
                                            rules={validationRule.textbox({ maxLength: 500 })}
                                            error={errors?.observationStimulation}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={1}>
                                                <FormControl fullWidth style={{ alignItems: "flex-start" }}>
                                                    <span className="text-13 font-medium">Alert, OR</span>
                                                    <CustomCheckBox
                                                        name="isAlertOperation"
                                                        control={control}
                                                        label=""
                                                        size="medium"
                                                        color="secondary"
                                                    />
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={11}>
                                                <CustomTextBox
                                                    formLabel={formatMessage({ id: "specify" })}
                                                    name="specify"
                                                    control={control}
                                                    rules={validationRule.textbox({ maxLength: 500 })}
                                                    error={errors?.specify}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>

                </Grid>

            </Paper>
        </Grid>
    )
}

export default TreatmentProcessPatientInfo;