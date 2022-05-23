import { useEffect, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { ControllerProps, FormProviderProps } from 'react-hook-form';
import Grid from '@material-ui/core/Grid';

import { CustomCheckBoxGroup, CustomRadioGroup, CustomSelect, CustomTextBox } from 'components/forms';
import { PaperWithLabel } from 'components';
import { PGTA_DiagnosisEpisodesList, PGTSR_DiagnosisEpisodesList, PGTM_DiagnosisEpisodesList, pgtDataList, pgtPlannedList } from 'utils/constants';


let abnormalNormalList = [
    { value: '1', label: "Abnormal" },
    { value: '2', label: "Normal" },
]

let yesNoList = [
    { value: '1', label: "Yes" },
    { value: '2', label: "No" },
]

interface Props {
    control: ControllerProps["control"];
    watch: FormProviderProps["watch"];
    setValue: FormProviderProps['setValue'];
    register: FormProviderProps['register'];
    formData: { [key: string]: any } | null;
}

const PGTDataForm = ({ control, watch, setValue, formData, register }: Props) => {
    const { formatMessage } = useIntl();

    useEffect(() => {
        if (formData) {
            const { isHLAMatching, pgT_SRCode, pgT_MCode, isFemaleKaryotypePerformed, isMaleKaryotypePerformed } = formData;
            const pgtData = pgtDataList.filter(item => formData?.[item.value] === true).map(item => item.value);
            const pgtPlannedData = pgtPlannedList.filter(item => formData?.[item.value] === true).map(item => item.value);
            const diagnosisEpisodesPGTA = PGTA_DiagnosisEpisodesList.filter(item => formData?.[item.value] === true).map(item => item.value);
            const diagnosisEpisodesPGTM = PGTM_DiagnosisEpisodesList.filter(item => formData?.[item.value] === true).map(item => item.value);
            const diagnosisEpisodesPGTSR = PGTSR_DiagnosisEpisodesList.filter(item => formData?.[item.value] === true).map(item => item.value);

            setValue('pgtData', pgtData);
            setValue('pgtPlannedData', pgtPlannedData);
            setValue('diagnosisEpisodesPGTA', diagnosisEpisodesPGTA);
            setValue('diagnosisEpisodesPGTM', diagnosisEpisodesPGTM);
            setValue('diagnosisEpisodesPGTSR', diagnosisEpisodesPGTSR);

            setValue('isHLAMatching', isHLAMatching ? "1" : "2");
            setValue('pgT_SRCode', pgT_SRCode);
            setValue('pgT_MCode', pgT_MCode);
            setValue('isFemaleKaryotypePerformed', abnormalNormalList.find(item => item.value === String(isFemaleKaryotypePerformed)) ?? null);
            setValue('isMaleKaryotypePerformed', abnormalNormalList.find(item => item.value === String(isMaleKaryotypePerformed)) ?? null);
        }
    }, [formData]);

    return (
        <>
            <Grid item xs={12}>
                <Grid container spacing={3}>
                    <Grid item lg={5} md={7} sm={12} xs={12}>
                        <CustomCheckBoxGroup
                            label={formatMessage({ id: 'pgt-data' })}
                            name="pgtData"
                            control={control}
                            groupList={pgtDataList}
                        />
                    </Grid>

                    {watch('pgtData')?.some((item: string) => item === "isoPlannedPGT") && (
                        <Grid item lg={4} md={5} sm={12} xs={12}>
                            <CustomCheckBoxGroup
                                label={formatMessage({ id: 'pgt-planned' })}
                                name="pgtPlannedData"
                                control={control}
                                groupList={pgtPlannedList}
                            />
                        </Grid>
                    )}

                </Grid>
            </Grid>

            {watch('pgtPlannedData')?.some((item: string) => item === "isPGTA") && (
                <Grid item xs={12}>
                    <PaperWithLabel
                        label={formatMessage({ id: "diagnosis-of-the-episodes" }) + " - " + formatMessage({ id: "pgt-a" })}
                        labelClassName="text-14"
                    >
                        <Grid container spacing={3}>

                            <Grid item xs={12} lg={4} md={6} sm={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <CustomSelect
                                            options={abnormalNormalList}
                                            formLabel={formatMessage({ id: "female-karyotype-performed" })}
                                            name="isFemaleKaryotypePerformed"
                                            control={control}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <CustomSelect
                                            options={abnormalNormalList}
                                            formLabel={formatMessage({ id: "male-karyotype-performed" })}
                                            name="isMaleKaryotypePerformed"
                                            control={control}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} lg={8} md={6} sm={12}>
                                <Grid container spacing={3}>
                                    <CustomCheckBoxGroup
                                        name="diagnosisEpisodesPGTA"
                                        control={control}
                                        groupList={PGTA_DiagnosisEpisodesList}
                                        gridProps={{ item: true, lg: 6, xs: 12 }}
                                        formGroupProps={{
                                            style: { marginLeft: "15px", marginTop: "6px" }
                                        }}
                                    // defaultValue={diagnosisEpisodesPGTA}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                    </PaperWithLabel>
                </Grid>
            )}


            {watch('pgtPlannedData')?.some((item: string) => item === "isPGTM") && (
                <Grid item xs={12}>
                    <PaperWithLabel
                        label={formatMessage({ id: "diagnosis-of-the-episodes" }) + " - " + formatMessage({ id: "pgt-m" })}
                        labelClassName="text-14"
                    >
                        <Grid container spacing={3}>

                            <Grid item xs={12} lg={4} md={6} sm={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <CustomTextBox
                                            formLabel={formatMessage({ id: 'pgt-m' }) + " " + formatMessage({ id: 'code' })}
                                            name="pgT_MCode"
                                            control={control}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} lg={8} md={6} sm={12}>
                                <Grid container spacing={3}>
                                    <CustomCheckBoxGroup
                                        name="diagnosisEpisodesPGTM"
                                        control={control}
                                        groupList={PGTM_DiagnosisEpisodesList}
                                        gridProps={{ item: true, lg: 6, xs: 12 }}
                                        formGroupProps={{
                                            style: { marginLeft: "15px", marginTop: "6px" }
                                        }}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                    </PaperWithLabel>
                </Grid>
            )}


            {watch('pgtPlannedData')?.some((item: string) => item === "isPGTSR") && (
                <Grid item xs={12}>
                    <PaperWithLabel
                        label={formatMessage({ id: "diagnosis-of-the-episodes" }) + " - " + formatMessage({ id: "pgt-sr" })}
                        labelClassName="text-14"
                    >
                        <Grid container spacing={3}>

                            <Grid item xs={12} lg={4} md={6} sm={12}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <CustomTextBox
                                            formLabel={formatMessage({ id: 'pgt-sr' }) + " " + formatMessage({ id: 'code' })}
                                            name="pgT_SRCode"
                                            control={control}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <CustomRadioGroup
                                            label={formatMessage({ id: 'hla-matching' })}
                                            name="isHLAMatching"
                                            control={control}
                                            groupList={yesNoList}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} lg={8} md={6} sm={12}>
                                <Grid container spacing={3}>
                                    <CustomCheckBoxGroup
                                        name="diagnosisEpisodesPGTSR"
                                        control={control}
                                        groupList={PGTSR_DiagnosisEpisodesList}
                                        gridProps={{ item: true, lg: 6, xs: 12 }}
                                        formGroupProps={{
                                            style: { marginLeft: "15px", marginTop: "6px" }
                                        }}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>
                    </PaperWithLabel>
                </Grid>
            )}
        </>
    )
};

export default PGTDataForm;