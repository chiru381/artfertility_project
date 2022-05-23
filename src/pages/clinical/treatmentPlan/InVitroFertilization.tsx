import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';

import { CustomCheckBox, CustomDatePicker, CustomRadioGroup, CustomSelect, CustomTextBox } from 'components/forms';
import { CustomClinicalActionHeaderWithWrap } from '../CustomClinicalActionHeader';
import TreatmentProcessCycleInfo from './TreatmentProcessCycleInfo';
import TreatmentProcessPatientInfo from './TreatmentProcessPatientInfo';
import TreatmentProcessFooterAction from './TreatmentProcessFooterAction';

import { treatmentPlanMenuList } from 'utils/constants/menu';
import { cycleTypeList, PGTA_DiagnosisEpisodesList, PGTSR_DiagnosisEpisodesList, PGTM_DiagnosisEpisodesList, pgtDataList, pgtPlannedList } from 'utils/constants';
import { useCreateLookupOptions, useGetOngoingTreatmentProcessId, useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { HoverLoader, PaperWithLabel } from 'components';
import { getTreatmentPlanFormBody, validationRule } from 'utils/global';
import { RootReducerState, SelectOptionsState } from 'utils/types';
import PGTDataForm from './PGTDataForm';

let yesNoList = [
    { value: '1', label: "Yes" },
    { value: '2', label: "No" },
]

interface Props {

}

const InVitroFertilization = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, setValue, watch, register } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [loading, setLoading] = useState(false);
    const [isUpdateForm, setIsUpdateForm] = useState(false);
    const [inVitroData, setInVitroData] = useState<any>(null);
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
        if (plannedProcessId) {
            setIsUpdateForm(true);
            setLoading(true);
            let params = { id: plannedProcessId };
            services.getInVitroFertilizationById(params)
                .then((res) => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        setInVitroData(res.data.response);
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
        if (inVitroData && Object.keys(selectOptions).length) {
            const { isPlanningHysteroscopy, oocyteOriginId, oocyteStateId, devitrificationReasonId, ivfReasonVitrifications, spermOriginId, spermStateId,
                spermCollectionOriginId, spermBackupId, isMixed, embryoDestinationId, noOfEmbryoTransfer, dateOfEmbryoTransfer } = inVitroData;

            let oocyteOrigin = selectOptions?.oocyteOrigins?.find((item: SelectOptionsState) => item.value === String(oocyteOriginId));
            let oocyteState = selectOptions?.oocyteStates?.find((item: SelectOptionsState) => item.value === String(oocyteStateId));
            let devitrificationReason = selectOptions?.devitrification?.find((item: SelectOptionsState) => item.value === String(devitrificationReasonId));

            let spermOrigin = selectOptions?.spermOrigins?.find((item: SelectOptionsState) => item.value === String(spermOriginId));
            let spermState = selectOptions?.spermStates?.find((item: SelectOptionsState) => item.value === String(spermStateId));
            let spermCollectionOrigin = selectOptions?.spermCollectionOrigins?.find((item: SelectOptionsState) => item.value === String(spermCollectionOriginId));
            let spermBackup = selectOptions?.spermBackups?.find((item: SelectOptionsState) => item.value === String(spermBackupId));
            let embryoDestination = selectOptions?.embryoDestinations?.find((item: SelectOptionsState) => item.value === String(embryoDestinationId));

            let reasonVitrification = ivfReasonVitrifications.map((item: any) => ({ label: item.reasonVitrificationName, value: String(item.reasonVitrificationId) }));

            setValue('isPlanningHysteroscopy', isPlanningHysteroscopy ? "1" : "2");
            setValue('oocyteOriginId', oocyteOrigin ?? null);
            setValue('oocyteStateId', oocyteState ?? null);
            setValue('devitrificationReasonId', devitrificationReason ?? null);

            setValue('spermOriginId', spermOrigin ?? null);
            setValue('spermStateId', spermState ?? null);
            setValue('spermCollectionOriginId', spermCollectionOrigin ?? null);
            setValue('spermBackupId', spermBackup ?? null);

            setValue('isMixed', isMixed);
            setValue('embryoDestinationId', embryoDestination ?? null);
            setValue('noOfEmbryoTransfer', noOfEmbryoTransfer);
            setValue('dateOfEmbryoTransfer', dateOfEmbryoTransfer);
            setValue('ivfReasonVitrifications', reasonVitrification);
        }
    }, [inVitroData, selectOptions]);

    function onSave({ treatmentPlanCycle, pgtData, pgtPlannedData, diagnosisEpisodesPGTA, diagnosisEpisodesPGTM, diagnosisEpisodesPGTSR, ...rest }: any) {
        let diagnosisEpisodes = [...pgtData ?? [], ...pgtPlannedData ?? [], ...diagnosisEpisodesPGTA ?? [], ...diagnosisEpisodesPGTM ?? [], ...diagnosisEpisodesPGTSR ?? []];
        let diagnosisEpisodesList = [...PGTA_DiagnosisEpisodesList, ...PGTSR_DiagnosisEpisodesList, ...PGTM_DiagnosisEpisodesList, ...pgtDataList, ...pgtPlannedList];

        let diagEps = diagnosisEpisodesList.reduce((acc, curr) => {
            return {
                ...acc,
                [curr.value]: diagnosisEpisodes?.some((eps: string) => eps === curr.value)
            };
        }, {});

        let bodyData = {
            ...rest,
            id: plannedProcessId,
            ...getTreatmentPlanFormBody(rest),
            isHLAMatching: rest.isHLAMatching === "1",
            isPlanningHysteroscopy: rest.isPlanningHysteroscopy === "1",
            isFemaleKaryotypePerformed: rest.isFemaleKaryotypePerformed ? +rest.isFemaleKaryotypePerformed.value : 0,
            isMaleKaryotypePerformed: rest.isMaleKaryotypePerformed ? +rest.isMaleKaryotypePerformed.value : 0,
            ivfReasonVitrifications: rest.ivfReasonVitrifications.map((item: SelectOptionsState) => ({ reasonVitrificationId: +item.value, reasonVitrificationName: item.label })),
            ...diagEps
        };

        // create and update api ishandled from single service
        let oocyteVitrificationService = services[(isUpdateForm ? 'updateInVitroFertilization' : 'createInVitroFertilization') as keyof typeof services];
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
            title={formatMessage({ id: "in-vitro-fertilization" })}
            onSave={handleSubmit(onSave)}
            saveButtonProps={{
                label: formatMessage({ id: isUpdateForm ? "update" : "save" }),
                disabled: !plannedProcessId
            }}
            menuList={treatmentPlanMenuList}
        >

            <Box padding={2} component={Paper}>
                <Grid container spacing={3}>
                    <TreatmentProcessCycleInfo
                        control={control}
                        setValue={setValue}
                        formData={inVitroData}
                    />

                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item lg={3} md={4} sm={6} xs={12}>
                                <CustomRadioGroup
                                    label={formatMessage({ id: 'type-of-cycle' })}
                                    name="typeofCycle"
                                    control={control}
                                    groupList={cycleTypeList}
                                />
                            </Grid>

                            <Grid item lg={2} md={3} sm={6} xs={12}>
                                <CustomRadioGroup
                                    label={formatMessage({ id: 'planning-hysteroscopy' })}
                                    name="isPlanningHysteroscopy"
                                    control={control}
                                    groupList={yesNoList}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <PGTDataForm
                        watch={watch}
                        control={control}
                        setValue={setValue}
                        formData={inVitroData}
                        register={register}
                    />

                    <Grid item xs={12}>
                        <PaperWithLabel label={formatMessage({ id: "oocytes" })}>
                            <Grid container spacing={3}>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <CustomSelect
                                        options={selectOptions?.oocyteOrigins ?? []}
                                        formLabel={formatMessage({ id: "source" })}
                                        name="oocyteOriginId"
                                        control={control}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <CustomSelect
                                        options={selectOptions?.oocyteStates ?? []}
                                        formLabel={formatMessage({ id: "state" })}
                                        name="oocyteStateId"
                                        control={control}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <CustomSelect
                                        options={selectOptions?.devitrification ?? []}
                                        formLabel={formatMessage({ id: "devitrification-reason" })}
                                        name="devitrificationReasonId"
                                        control={control}
                                    />
                                </Grid>
                            </Grid>
                        </PaperWithLabel>
                    </Grid>

                    <Grid item xs={12}>
                        <PaperWithLabel label={formatMessage({ id: "sperm" })}>
                            <Grid container spacing={3}>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <CustomSelect
                                        options={selectOptions?.spermOrigins ?? []}
                                        formLabel={formatMessage({ id: "source" })}
                                        name="spermOriginId"
                                        control={control}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <CustomSelect
                                        options={selectOptions?.spermStates ?? []}
                                        formLabel={formatMessage({ id: "state" })}
                                        name="spermStateId"
                                        control={control}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <CustomSelect
                                        options={selectOptions?.spermCollectionOrigins ?? []}
                                        formLabel={formatMessage({ id: "origin" })}
                                        name="spermCollectionOriginId"
                                        control={control}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <CustomSelect
                                        options={selectOptions?.spermBackups ?? []}
                                        formLabel={formatMessage({ id: "back-up" })}
                                        name="spermBackupId"
                                        control={control}
                                    />
                                </Grid>
                            </Grid>
                        </PaperWithLabel>
                    </Grid>

                    <Grid item xs={12}>
                        <PaperWithLabel label={formatMessage({ id: "embryos" })}>
                            <Grid container spacing={3}>
                                <Grid item xs={2} lg={1} md={1} sm={2}>
                                    <FormControl fullWidth style={{ alignItems: "flex-start" }}>
                                        <span className="text-13 font-medium">Mixed</span>
                                        <CustomCheckBox
                                            name="isMixed"
                                            control={control}
                                            label=""
                                            size="medium"
                                            color="secondary"
                                        />
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} lg={2} md={3} sm={5}>
                                    <CustomSelect
                                        options={selectOptions?.embryoDestinations ?? []}
                                        formLabel={formatMessage({ id: "destination" })}
                                        name="embryoDestinationId"
                                        control={control}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={2} md={3} sm={5}>
                                    <CustomTextBox
                                        formLabel={"#" + formatMessage({ id: "embryo-transfer" })}
                                        name="noOfEmbryoTransfer"
                                        control={control}
                                        type="number"
                                        rules={validationRule.textbox({ type: "number" })}
                                        error={errors?.noOfEmbryoTransfer}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={2} md={3} sm={5}>
                                    <CustomDatePicker
                                        formLabel={formatMessage({ id: "date-of-et" })}
                                        name="dateOfEmbryoTransfer"
                                        control={control}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={5} sm={6}>
                                    <CustomSelect
                                        options={selectOptions?.reasonVitrifications ?? []}
                                        formLabel={formatMessage({ id: "reason-for-vitrification" })}
                                        name="ivfReasonVitrifications"
                                        control={control}
                                        multiple
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

export default InVitroFertilization;