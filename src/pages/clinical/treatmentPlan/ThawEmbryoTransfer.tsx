import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';

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

const ThawEmbryoTransfer = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, setValue, watch, register } = useForm({ mode: 'all' });
    const { toastMessage } = useToastMessage();
    const { formatMessage } = useIntl();

    const [loading, setLoading] = useState(false);
    const [isUpdateForm, setIsUpdateForm] = useState(false);
    const [thawEmbryoData, setThawEmbryoData] = useState<any>(null);
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
            services.getThawEmbryoTransferById(params)
                .then((res) => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        setThawEmbryoData(res.data.response);
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
        if (thawEmbryoData && Object.keys(selectOptions).length) {
            const { isPlanningHysteroscopy, thawEmbryoTransferReasonVitrifications, isMixed, embryoDestinationId, noOfEmbryoTransfer, dateOfEmbryoTransfer } = thawEmbryoData;

            let embryoDestination = selectOptions?.embryoDestinations?.find((item: SelectOptionsState) => item.value === String(embryoDestinationId));
            let reasonVitrification = thawEmbryoTransferReasonVitrifications?.map((item: any) => ({ label: item.reasonVitrificationName, value: String(item.reasonVitrificationId) }));

            setValue('isPlanningHysteroscopy', isPlanningHysteroscopy ? "1" : "2");
            setValue('isMixed', isMixed);
            setValue('embryoDestinationId', embryoDestination ?? null);
            setValue('noOfEmbryoTransfer', noOfEmbryoTransfer);
            setValue('dateOfEmbryoTransfer', dateOfEmbryoTransfer);
            setValue('thawEmbryoTransferReasonVitrifications', reasonVitrification ?? []);
        }
    }, [thawEmbryoData, selectOptions]);

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
            thawEmbryoTransferReasonVitrifications: rest.thawEmbryoTransferReasonVitrifications.map((item: SelectOptionsState) => ({ reasonVitrificationId: +item.value, reasonVitrificationName: item.label })),
            ...diagEps
        };

        // create and update api ishandled from single service
        let oocyteVitrificationService = services[(isUpdateForm ? 'updateThawEmbryoTransfer' : 'createThawEmbryoTransfer') as keyof typeof services];
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
            title={formatMessage({ id: "thaw-embryo-transfer" })}
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
                        formData={thawEmbryoData}
                    />

                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item lg={3} md={4} sm={6} xs={12}>
                                <CustomRadioGroup
                                    label={formatMessage({ id: 'type-of-cycle' })}
                                    name="typeOfCycle"
                                    control={control}
                                    groupList={cycleTypeList}
                                />
                            </Grid>

                            <Grid item lg={3} md={4} sm={6} xs={12}>
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
                        formData={thawEmbryoData}
                        register={register}
                    />

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
                                        name="thawEmbryoTransferReasonVitrifications"
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

export default ThawEmbryoTransfer;