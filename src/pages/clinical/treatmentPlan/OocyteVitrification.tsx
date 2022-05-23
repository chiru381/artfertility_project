import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import { CustomRadioGroup, CustomSelect } from 'components/forms';
import { CustomClinicalActionHeaderWithWrap } from '../CustomClinicalActionHeader';
import TreatmentProcessCycleInfo from './TreatmentProcessCycleInfo';
import TreatmentProcessPatientInfo from './TreatmentProcessPatientInfo';
import TreatmentProcessFooterAction from './TreatmentProcessFooterAction';

import { treatmentPlanMenuList } from 'utils/constants/menu';
import { useCreateLookupOptions, useGetOngoingTreatmentProcessId, useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { HoverLoader, PaperWithLabel } from 'components';
import { cycleTypeList } from 'utils/constants';
import { getTreatmentPlanFormBody } from 'utils/global';
import { RootReducerState, SelectOptionsState } from 'utils/types';

interface Props {

}

const OocyteVitrification = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [loading, setLoading] = useState(false);
    const [isUpdateForm, setIsUpdateForm] = useState(false);
    const [oocytreData, setOocytreData] = useState<any>(null);
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
            services.getOocyteVitrificationById(params)
                .then((res) => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        setOocytreData(res.data.response);
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
        if (oocytreData && Object.keys(selectOptions).length) {
            const { oocyteOriginId, oocyteStateId, useOocyteId, oocyteReasonVitrifications } = oocytreData;
            let oocyteOrigin = selectOptions?.oocyteOrigins?.find((item: SelectOptionsState) => item.value === String(oocyteOriginId));
            let oocyteState = selectOptions?.oocyteStates?.find((item: SelectOptionsState) => item.value === String(oocyteStateId));
            let useOocyte = selectOptions?.useOocytes?.find((item: SelectOptionsState) => item.value === String(useOocyteId));
            let reasonVitrification = oocyteReasonVitrifications.map((item: any) => ({ label: item.reasonVitrificationName, value: String(item.reasonVitrificationId) }));

            setValue('oocyteOriginId', oocyteOrigin ?? null);
            setValue('oocyteStateId', oocyteState ?? null);
            setValue('useOocyteId', useOocyte ?? null);
            setValue('oocyteReasonVitrifications', reasonVitrification);
        }
    }, [oocytreData, selectOptions]);

    function onSave({ treatmentPlanCycle, ...rest }: any) {
        let bodyData = {
            ...rest,
            id: plannedProcessId,
            ...getTreatmentPlanFormBody(rest),
            oocyteReasonVitrifications: rest.oocyteReasonVitrifications.map((item: SelectOptionsState) => ({ reasonVitrificationId: +item.value, reasonVitrificationName: item.label })),
        };

        // create and update api ishandled from single service
        let oocyteVitrificationService = services[(isUpdateForm ? 'updateOocyteVitrification' : 'createOocyteVitrification') as keyof typeof services];
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
            title={formatMessage({ id: "oocyte-vitrification" })}
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
                        formData={oocytreData}
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
                        <PaperWithLabel label={formatMessage({ id: "oocytes" })}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} lg={2} md={4} sm={6}>
                                    <CustomSelect
                                        formLabel={formatMessage({ id: "source" })}
                                        name="oocyteOriginId"
                                        control={control}
                                        options={selectOptions?.oocyteOrigins ?? []}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={2} md={4} sm={6}>
                                    <CustomSelect
                                        formLabel={formatMessage({ id: "state" })}
                                        name="oocyteStateId"
                                        control={control}
                                        options={selectOptions?.oocyteStates ?? []}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={2} md={4} sm={6}>
                                    <CustomSelect
                                        formLabel={formatMessage({ id: "use-of-oocyte" })}
                                        name="useOocyteId"
                                        control={control}
                                        options={selectOptions?.useOocytes ?? []}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6} sm={6}>
                                    <CustomSelect
                                        options={selectOptions?.reasonVitrifications ?? []}
                                        formLabel={formatMessage({ id: "reason-for-vitrification" })}
                                        name="oocyteReasonVitrifications"
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

export default OocyteVitrification;