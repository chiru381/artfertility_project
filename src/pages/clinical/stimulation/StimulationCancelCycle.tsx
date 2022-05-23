import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import { RootReducerState } from 'utils/types';
import { CustomDatePicker, CustomSelect, CustomTextBox } from 'components/forms';
import { stimulationMenuList } from "utils/constants/menu";
import { CustomClinicalTabActionHeaderWithWrap } from "../CustomClinicalActionHeader";
import { useCreateLookupOptions, useGetClinicalUrlFirstRoute, useGetOngoingTreatmentProcessId, useToastMessage } from 'utils/hooks';
import { validationRule } from 'utils/global';
import { PrimaryButton } from 'components/button';
import { services } from 'utils/services';
import { HoverLoader } from 'components';


interface Props {

}

const StimulationCancelCycle = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const history = useHistory();

    const plannedProcessId = useGetOngoingTreatmentProcessId();
    const { toastMessage } = useToastMessage();
    const firstPath = useGetClinicalUrlFirstRoute();
    const [loading, setLoading] = useState(false);


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

    useEffect(() => {
        setValue('cancelDate', new Date());
    }, []);

    function onSave({ treatmentPlanCycle, diagnosisEpisodes, ...rest }: any) {
        let bodyData = {
            ...rest,
            id: plannedProcessId,
            cancellationReasonId: +rest.cancellationReasonId
        };

        setLoading(true);
        services.cancelStimulationSheet(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: "stimulation-cycle-cancel-message" }));
                    history.push(`/${firstPath}/treatment-plan/summary`);
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    return (
        <CustomClinicalTabActionHeaderWithWrap
            menuList={stimulationMenuList}
        >
            <Box padding={2} component={Paper} style={{ minHeight: "325px" }}>
                <Grid container spacing={2}>
                    <Grid item lg={2} md={3} sm={6} xs={6}>
                        <CustomDatePicker
                            label={formatMessage({ id: "date" })}
                            name="cancelDate"
                            control={control}
                            disabled
                        />
                    </Grid>
                    <Grid item lg={4} md={3} sm={6} xs={6}>
                        <CustomSelect
                            label={formatMessage({ id: "reason-for-cancellation" })}
                            name="cancellationReasonId"
                            control={control}
                            error={errors.cancellationReasonId}
                            options={selectOptions?.cancellationReason ?? []}
                            rules={{ required: true }}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "other-reason" })}
                            name="otherReason"
                            control={control}
                            error={errors.otherReason}
                            rules={validationRule.textbox({ maxLength: 500 })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "observation" })}
                            name="observations"
                            control={control}
                            error={errors.observations}
                            rules={validationRule.textbox({ maxLength: 500 })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <PrimaryButton
                            color="secondary"
                            label={formatMessage({ id: "cancel" })}
                            disabled={plannedProcessId ? false : true}
                            onClick={handleSubmit(onSave)}
                        />
                    </Grid>
                </Grid>
            </Box>

            {loading && <HoverLoader />}
            
        </CustomClinicalTabActionHeaderWithWrap>
    )
}

export default StimulationCancelCycle;