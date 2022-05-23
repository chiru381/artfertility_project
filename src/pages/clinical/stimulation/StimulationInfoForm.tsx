import Grid from '@material-ui/core/Grid';
import { useIntl } from 'react-intl';
import { ControllerProps } from "react-hook-form";

import { CustomTextBox } from 'components/forms';


interface Props {
    control: ControllerProps["control"];
}

const StimulationInfoForm = ({ control }: Props) => {
    const { formatMessage } = useIntl();

    return (
        <>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={6} lg={2} md={3} sm={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "patient-type" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={6} lg={2} md={3} sm={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "sperm-source" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={6} lg={2} md={3} sm={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "sperm-state" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={6} lg={2} md={3} sm={4}>
                        <CustomTextBox
                            label={formatMessage({ id: "pgt" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4} lg={1} md={2} sm={3}>
                        <CustomTextBox
                            label={formatMessage({ id: "weight" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4} lg={1} md={2} sm={3}>
                        <CustomTextBox
                            label={formatMessage({ id: "bmi" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={4} lg={1} md={2} sm={3}>
                        <CustomTextBox
                            label={formatMessage({ id: "age" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>

                </Grid>
            </Grid>


            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={6} lg={2} md={3} sm={4}>
                        <CustomTextBox
                            label={"#" + formatMessage({ id: "available-oocytes" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={6} lg={2} md={3} sm={4}>
                        <CustomTextBox
                            label={"#" + formatMessage({ id: "available-embryos" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                    <Grid item xs={6} lg={2} md={3} sm={4}>
                        <CustomTextBox
                            label={"#" + formatMessage({ id: "frozen-semen-remaining" })}
                            name="patientType"
                            control={control}
                        />
                    </Grid>
                </Grid>
            </Grid>

            <Grid item xs={6} lg={2} md={3} sm={4}>
                <CustomTextBox
                    label={formatMessage({ id: "treatment" })}
                    name="patientType"
                    control={control}
                />
            </Grid>
            <Grid item xs={6} lg={2} md={3} sm={4}>
                <CustomTextBox
                    label={formatMessage({ id: "cycle-id" })}
                    name="patientType"
                    control={control}
                />
            </Grid>
            <Grid item xs={12} lg={4} md={6} sm={8}>
                <CustomTextBox
                    label={formatMessage({ id: "treatment-indication" })}
                    name="patientType"
                    control={control}
                />
            </Grid>
        </>
    )
}

export default StimulationInfoForm;