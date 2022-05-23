import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';

import { stimulationMenuList } from "utils/constants/menu";
import { CustomClinicalTabActionHeaderWithWrap } from "../CustomClinicalActionHeader";
import { useCreateLookupOptions, useGetOngoingTreatmentProcessId } from 'utils/hooks';
import { CustomSelect, TextBox, CustomTextBox, CustomDatePicker, CustomCheckBoxGroup } from 'components/forms';
import { RootReducerState } from 'utils/types';
import { stimulationValidationAuthorizationList, stimulationValidationConsentsList } from 'utils/constants';
import { validationRule } from 'utils/global';

interface Props {

}

const StimulationValidation = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, setValue, watch } = useForm({ mode: 'all' });
    const plannedProcessId = useGetOngoingTreatmentProcessId();
    const { formatMessage } = useIntl();

    const { treatmentPlanLookupData } = useSelector(
        ({ treatmentPlanLookupReducer }: RootReducerState) => {
            return ({
                treatmentPlanLookupData: treatmentPlanLookupReducer.data
            })
        },
        shallowEqual
    );

    // Lookup options for dropdown
    let selectOptions = useCreateLookupOptions(treatmentPlanLookupData);

    return (
        <CustomClinicalTabActionHeaderWithWrap
            menuList={stimulationMenuList}
        >
            <Box padding={2} component={Paper}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item xs={6} lg={2} md={3} sm={4}>
                                <TextBox
                                    formLabel={formatMessage({ id: "cycle-id" })}
                                    disabled
                                    value={plannedProcessId ?? ""}
                                />
                            </Grid>
                            <Grid item xs={6} lg={2} md={3} sm={4}>
                                <CustomSelect
                                    formLabel={formatMessage({ id: "patient-type" })}
                                    name="treatmentTypeId"
                                    control={control}
                                    options={selectOptions?.patientTypes ?? []}
                                />
                            </Grid>
                            <Grid item xs={6} lg={2} md={3} sm={4}>
                                <CustomSelect
                                    formLabel={formatMessage({ id: "treatment" })}
                                    name="treatmentTypeId"
                                    control={control}
                                    options={selectOptions?.treatmentTypes ?? []}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <CustomCheckBoxGroup
                            label={formatMessage({ id: 'consent-and-checklist' })}
                            name="checklist"
                            control={control}
                            groupList={stimulationValidationConsentsList}
                        />
                    </Grid>

                    {watch('checklist')?.includes('isAuthorization') && (
                        <>
                            <Grid item lg={2}>
                                <CustomTextBox
                                    formLabel={formatMessage({ id: "authorization-number" })}
                                    name="authorizationNumber"
                                    control={control}
                                />
                            </Grid>
                            <Grid item lg={2}>
                                <CustomDatePicker
                                    formLabel={formatMessage({ id: "validity-date" })}
                                    name="validityDate"
                                    control={control}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <CustomCheckBoxGroup
                                    label={formatMessage({ id: 'authorization-checklist' })}
                                    name="authChecklist"
                                    control={control}
                                    groupList={stimulationValidationAuthorizationList}
                                />
                            </Grid>

                            {watch('authChecklist')?.includes('isOthers') && (
                                <Grid item lg={2}>
                                    <CustomTextBox
                                        formLabel={formatMessage({ id: "other-text" })}
                                        name="otherText"
                                        control={control}
                                        rules={validationRule.textbox({ maxLength: 200 })}
                                    />
                                </Grid>
                            )}
                        </>
                    )}

                </Grid>
            </Box>
        </CustomClinicalTabActionHeaderWithWrap>
    )
}

export default StimulationValidation;