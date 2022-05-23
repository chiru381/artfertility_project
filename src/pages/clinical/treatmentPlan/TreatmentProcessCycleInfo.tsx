import { useEffect } from 'react';
import { ControllerProps, FormProviderProps } from 'react-hook-form';
import { useIntl } from 'react-intl';
import { shallowEqual, useSelector } from 'react-redux';
import Grid from '@material-ui/core/Grid';

import { CustomSelect, TextBox } from 'components/forms';
import { RootReducerState, SelectOptionsState } from 'utils/types';
import { useCreateLookupOptions, useGetOngoingTreatmentProcessId } from 'utils/hooks';


interface Props {
    control: ControllerProps["control"];
    setValue: FormProviderProps['setValue'];
    formData: { [key: string]: any } | null;
}

const TreatmentProcessCycleInfo = ({ control, formData, setValue }: Props) => {
    const { formatMessage } = useIntl();
    const plannedProcessId = useGetOngoingTreatmentProcessId();

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
        if (formData && Object.keys(selectOptions).length) {
            const { treatmentTypeId, patientTypeId } = formData;
            let treatmentType = selectOptions?.treatmentTypes?.find((item: SelectOptionsState) => item.value === String(treatmentTypeId));
            let patientType = selectOptions?.patientTypes?.find((item: SelectOptionsState) => item.value === String(patientTypeId));
            setValue('treatmentTypeId', treatmentType ?? null);
            setValue('patientTypeId', patientType ?? null);
        }
    }, [formData, selectOptions]);

    useEffect(() => {
        if (formData) {
            const { typeOfCycle, interestingObservationsForlab, observationStimulation, isAlertOperation, specify } = formData;
            setValue("typeOfCycle", typeOfCycle + "");
            setValue("interestingObservationsForlab", interestingObservationsForlab);
            setValue("observationStimulation", observationStimulation);
            setValue("specify", specify);
            setValue("isAlertOperation", isAlertOperation);
        }
    }, [formData]);

    return (
        <>
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
        </>
    )
}

export default TreatmentProcessCycleInfo;