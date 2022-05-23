import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';

import { RootReducerState } from 'utils/types';
import { CustomDatePicker, CustomSelect, CustomTextBox, CustomTimePicker, TextBox } from 'components/forms';
import { stimulationMenuList } from "utils/constants/menu";
import { CustomClinicalTabActionHeaderWithWrap } from "../CustomClinicalActionHeader";
import { useCreateLookupOptions, useGetClinicalUrlFirstRoute, useGetOngoingTreatmentProcessId, useToastMessage } from 'utils/hooks';
import { validationRule } from 'utils/global';
import { services } from 'utils/services';
import { HoverLoader, PaperWithLabel } from 'components';


interface Props {

}

const StimulationERA = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, setValue, watch } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const history = useHistory();

    const plannedProcessId = useGetOngoingTreatmentProcessId();
    const { toastMessage } = useToastMessage();
    const firstPath = useGetClinicalUrlFirstRoute();
    
    const [loading, setLoading] = useState(false);
    const [elapsedp4Biospy, setElapsedp4Biospy] = useState('');
    const [elapsedp4Transfer, setElapsedp4Transfer] = useState('');


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
        let preparationStartDate = watch('preparationStartDate');
        let preparationStartTime = watch('preparationStartTime');
        let biopsyDate = watch('biopsyDate');
        let biopsyTime = watch('biopsyTime');
        if (preparationStartDate && preparationStartTime && biopsyDate && biopsyTime) {
            let preparationHour = dayjs(preparationStartTime).hour();
            let preparationMinute = dayjs(preparationStartTime).minute();
            let preparationDateTime = dayjs(preparationStartDate).set('hours', preparationHour).set('minutes', preparationMinute).set('seconds', 0).toDate();

            let biopsyHour = dayjs(biopsyTime).hour();
            let biopsyMinute = dayjs(biopsyTime).minute();
            let biopsyDateTime = dayjs(biopsyDate).set('hours', biopsyHour).set('minutes', biopsyMinute).set('seconds', 0).toDate();

            let diffMinute = dayjs(biopsyDateTime).diff(preparationDateTime, 'minute');
            setElapsedp4Biospy(`${parseInt(String(diffMinute / 60))}:${diffMinute % 60}:00`)
        } else {
            setElapsedp4Biospy('00:00:00');
        }
    }, [watch('preparationStartDate'), watch('preparationStartTime'), watch('biopsyDate'), watch('biopsyTime')]);

    useEffect(() => {
        let preparationStartDate = watch('preparationStartDate');
        let preparationStartTime = watch('preparationStartTime');
        let transferDate = watch('transferDate');
        let transferTime = watch('transferTime');
        if (preparationStartDate && preparationStartTime && transferDate && transferTime) {
            let preparationHour = dayjs(preparationStartTime).hour();
            let preparationMinute = dayjs(preparationStartTime).minute();
            let preparationDateTime = dayjs(preparationStartDate).set('hours', preparationHour).set('minutes', preparationMinute).set('seconds', 0).toDate();

            let transferHour = dayjs(transferTime).hour();
            let transferMinute = dayjs(transferTime).minute();
            let transferDateTime = dayjs(transferDate).set('hours', transferHour).set('minutes', transferMinute).set('seconds', 0).toDate();

            let diffMinute = dayjs(transferDateTime).diff(preparationDateTime, 'minute');
            setElapsedp4Transfer(`${parseInt(String(diffMinute / 60))}:${diffMinute % 60}:00`)
        } else {
            setElapsedp4Transfer('00:00:00');
        }
    }, [watch('preparationStartDate'), watch('preparationStartTime'), watch('transferDate'), watch('transferTime')]);

    function onSave(data: any) {
        let bodyData = {
            ...data,
            id: plannedProcessId,
            progesteroneId: +data.progesteroneId,
            testEndometrialReceptiveId: +data.testEndometrialReceptiveId
        };

        setLoading(true);
        services.createStimulationEra(bodyData)
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
            onSave={handleSubmit(onSave)}
        >
            <Box padding={2} component={Paper} style={{ minHeight: "325px" }}>
                <Grid container spacing={2}>
                    <Grid item lg={2} md={4} sm={8} xs={8}>
                        <CustomSelect
                            label={formatMessage({ id: "progesterone" })}
                            name="progesteroneId"
                            control={control}
                            error={errors.progesteroneId}
                            options={selectOptions?.progesteroneId ?? []}
                        />
                    </Grid>
                    <Grid item lg={1} md={2} sm={4} xs={4}>
                        <CustomDatePicker
                            label={formatMessage({ id: "start-date" })}
                            name="preparationStartDate"
                            control={control}
                        />
                    </Grid>
                    <Grid item lg={1} md={2} sm={4} xs={4}>
                        <CustomTimePicker
                            label={formatMessage({ id: "start-time" })}
                            name="preparationStartTime"
                            control={control}
                        />
                    </Grid>
                    <Grid item lg={2} md={4} sm={8} xs={8}>
                        <CustomTextBox
                            label={formatMessage({ id: "dose" })}
                            name="preparationDose"
                            control={control}
                            error={errors.preparationDose}
                            type="number"
                            rules={validationRule.textbox({ type: "number" })}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">mg/day</InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    <Grid item lg={6} md={12}>
                        <Grid container spacing={2}>
                            <Grid item sm={6} xs={12}>
                                <Grid container spacing={2} alignItems='center'>
                                    <Grid item xs={2}>
                                        <span className='text-14 font-bold' style={{ float: "right" }}>LH:</span>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <CustomDatePicker
                                            label={formatMessage({ id: "start-date" })}
                                            name="lhStartDate"
                                            control={control}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <CustomTimePicker
                                            label={formatMessage({ id: "start-time" })}
                                            name="lhStartTime"
                                            control={control}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item sm={6} xs={12}>
                                <Grid container spacing={2} alignItems='center'>
                                    <Grid item xs={2}>
                                        <span className='text-14 font-bold' style={{ float: "right" }}>HcG:</span>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <CustomDatePicker
                                            label={formatMessage({ id: "start-date" })}
                                            name="hcgStartDate"
                                            control={control}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <CustomTimePicker
                                            label={formatMessage({ id: "start-time" })}
                                            name="hcgStartTime"
                                            control={control}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item lg={4} md={5} sm={6} xs={12}>
                        <PaperWithLabel label={formatMessage({ id: "biopsy" })}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <CustomDatePicker
                                        label={formatMessage({ id: "biopsy-date" })}
                                        name="biopsyDate"
                                        control={control}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomTimePicker
                                        label={formatMessage({ id: "biopsy-time" })}
                                        name="biopsyTime"
                                        control={control}
                                    />
                                </Grid>
                            </Grid>
                        </PaperWithLabel>
                    </Grid>

                    <Grid item lg={4} md={5} sm={6} xs={12}>
                        <PaperWithLabel label={formatMessage({ id: "transfer" })}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <CustomDatePicker
                                        label={formatMessage({ id: "transfer-date" })}
                                        name="transferDate"
                                        control={control}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <CustomTimePicker
                                        label={formatMessage({ id: "transfer-time" })}
                                        name="transferTime"
                                        control={control}
                                    />
                                </Grid>
                            </Grid>
                        </PaperWithLabel>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item lg={2} md={3} sm={5} xs={6}>
                                <TextBox
                                    formLabel={formatMessage({ id: "elapsed-p4-biopsy" })}
                                    value={elapsedp4Biospy}
                                    disabled
                                />
                            </Grid>

                            <Grid item lg={2} md={3} sm={5} xs={6}>
                                <TextBox
                                    formLabel={formatMessage({ id: "elapsed-p4-transfer" })}
                                    value={elapsedp4Transfer}
                                    disabled
                                />
                            </Grid>
                        </Grid>
                    </Grid>


                    <Grid item xs={12}>
                        <Grid container spacing={2}>
                            <Grid item lg={2} md={3} sm={5} xs={6}>
                                <CustomDatePicker
                                    label={formatMessage({ id: "era-request-date" })}
                                    name="requestDateERA"
                                    control={control}
                                />
                            </Grid>
                            <Grid item lg={2} md={3} sm={5} xs={6}>
                                <CustomSelect
                                    label={formatMessage({ id: "test-endometrial-receptivity" })}
                                    name="testEndometrialReceptiveId"
                                    control={control}
                                    options={selectOptions?.receptivity ?? []}
                                />
                            </Grid>
                            <Grid item lg={4} md={6} sm={12} xs={12}>
                                <CustomTextBox
                                    label={formatMessage({ id: "observation" })}
                                    name="remarks"
                                    control={control}
                                    error={errors.remarks}
                                    rules={validationRule.textbox({ maxLength: 200 })}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Box>

            {loading && <HoverLoader />}

        </CustomClinicalTabActionHeaderWithWrap>
    )
}

export default StimulationERA;