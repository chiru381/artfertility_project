import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import { CustomRadioGroup, CustomSelect, CustomTextBox, DatePicker } from 'components/forms';
import { CustomClinicalActionHeaderWithWrap } from '../CustomClinicalActionHeader';
import TreatmentProcessCycleInfo from './TreatmentProcessCycleInfo';
import TreatmentProcessPatientInfo from './TreatmentProcessPatientInfo';
import TreatmentProcessFooterAction from './TreatmentProcessFooterAction';

import { treatmentPlanMenuList } from 'utils/constants/menu';
import { services } from 'utils/services';
import { useGetOngoingTreatmentProcessId, useToastMessage } from 'utils/hooks';
import { HoverLoader, PaperWithLabel } from 'components';
import { cycleTypeList, evaluationTypeList, outcomeOfTestList } from 'utils/constants';
import { getTreatmentPlanFormBody, validationRule } from 'utils/global';
import { SelectOptionsState } from 'utils/types';


interface Props {

}

const EvaluationCycle = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [loading, setLoading] = useState(false);
    const [isUpdateForm, setIsUpdateForm] = useState(false);
    const [eraRequestDate, setEraRequestDate] = useState(null);
    const [evaluationCycleData, setEvaluationCycleData] = useState<any>(null);
    const plannedProcessId = useGetOngoingTreatmentProcessId();

    useEffect(() => {
        if (plannedProcessId) {
            setIsUpdateForm(true);
            setLoading(true);
            let params = { id: plannedProcessId };
            services.getEvaluationCycleById(params)
                .then((res) => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        setEvaluationCycleData(res.data.response);
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    toastMessage(err.message, 'error');
                })
        }
    }, []);

    useEffect(() => {
        if (evaluationCycleData) {
            const { typeOfEvaluation, outcomeofTest, hours } = evaluationCycleData;
            let evaluationtype = evaluationTypeList.find((item: SelectOptionsState) => item.value === String(typeOfEvaluation));
            let testOutcome = outcomeOfTestList.find((item: SelectOptionsState) => item.value === String(outcomeofTest));

            setValue('typeOfEvaluation', evaluationtype ?? null);
            setValue('outcomeofTest', testOutcome ?? null);
            setValue('hours', hours);
        }
    }, [evaluationCycleData]);

    function onSave({ treatmentPlanCycle, diagnosisEpisodes, ...rest }: any) {
        let bodyData = {
            ...rest,
            id: plannedProcessId,
            ...getTreatmentPlanFormBody(rest),
            typeOfEvaluation: +(rest.typeOfEvaluation ?? 0),
            outcomeofTest: +(rest.typeOfEvaluation ?? 0),
        };

        // create and update api ishandled from single service
        let oocyteVitrificationService = services[(isUpdateForm ? 'updateEvaluationCycle' : 'createEvaluationCycle') as keyof typeof services];
        setLoading(true);
        oocyteVitrificationService(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: "insert-message" }));
                    if (!isUpdateForm) {
                        setIsUpdateForm(true);
                    }
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
        <CustomClinicalActionHeaderWithWrap
            title={formatMessage({ id: "evaluation-cycle" })}
            onSave={handleSubmit(onSave)}
            menuList={treatmentPlanMenuList}
        >

            <Box padding={2} component={Paper}>
                <Grid container spacing={3}>
                    <TreatmentProcessCycleInfo
                        control={control}
                        setValue={setValue}
                        formData={evaluationCycleData}
                    />

                    <Grid item xs={12}>
                        <CustomRadioGroup
                            label={formatMessage({ id: 'type-of-cycle' })}
                            name="typeofCycle"
                            control={control}
                            groupList={cycleTypeList}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <PaperWithLabel label={formatMessage({ id: "evaluation" })}>
                            <Grid container spacing={3}>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <CustomSelect
                                        formLabel={formatMessage({ id: "type-of-evaluation" })}
                                        name="typeOfEvaluation"
                                        control={control}
                                        options={evaluationTypeList}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <CustomSelect
                                        formLabel={formatMessage({ id: "outcome-of-the-test" })}
                                        name="outcomeofTest"
                                        control={control}
                                        options={outcomeOfTestList}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <CustomTextBox
                                        formLabel={formatMessage({ id: "hours" })}
                                        name="hours"
                                        control={control}
                                        type="number"
                                        rules={validationRule.textbox({ type: "number" })}
                                        error={errors?.hours}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <DatePicker
                                        formLabel={formatMessage({ id: "era" }) + " " + formatMessage({ id: "request-date" })}
                                        onChange={() => { }}
                                        value={eraRequestDate}
                                        disabled={true}
                                    />
                                </Grid>
                            </Grid>
                        </PaperWithLabel>
                    </Grid>

                    <TreatmentProcessPatientInfo
                        control={control}
                        errors={errors}
                    />

                    <TreatmentProcessFooterAction />

                </Grid>
            </Box>

            {loading && <HoverLoader />}
        </CustomClinicalActionHeaderWithWrap>
    )
}

export default EvaluationCycle;