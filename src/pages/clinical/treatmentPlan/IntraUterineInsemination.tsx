import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import { CustomClinicalActionHeaderWithWrap } from '../CustomClinicalActionHeader';
import TreatmentProcessCycleInfo from './TreatmentProcessCycleInfo';
import TreatmentProcessPatientInfo from './TreatmentProcessPatientInfo';
import TreatmentProcessFooterAction from './TreatmentProcessFooterAction';
import { CustomRadioGroup, CustomSelect } from 'components/forms';

import { treatmentPlanMenuList } from 'utils/constants/menu';
import { cycleTypePCList } from 'utils/constants';
import { useCreateLookupOptions, useGetOngoingTreatmentProcessId, useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { HoverLoader, PaperWithLabel } from 'components';
import { getTreatmentPlanFormBody } from 'utils/global';
import { RootReducerState, SelectOptionsState } from 'utils/types';


interface Props {

}

const IntraUterineInsemination = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [loading, setLoading] = useState(false);
    const [isUpdateForm, setIsUpdateForm] = useState(false);
    const [intraUterineData, setIntraUterineData] = useState<any>(null);
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
            services.getIntraUterineInseminationById(params)
                .then((res) => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        setIntraUterineData(res.data.response);
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
        if (intraUterineData && Object.keys(selectOptions).length) {
            const { spermOriginId, spermStateId, spermCollectionOriginId, spermBackupId } = intraUterineData;
            let spermOrigin = selectOptions?.spermOrigins?.find((item: SelectOptionsState) => item.value === String(spermOriginId));
            let spermState = selectOptions?.spermStates?.find((item: SelectOptionsState) => item.value === String(spermStateId));
            let spermCollectionOrigin = selectOptions?.spermCollectionOrigins?.find((item: SelectOptionsState) => item.value === String(spermCollectionOriginId));
            let spermBackup = selectOptions?.spermBackups?.find((item: SelectOptionsState) => item.value === String(spermBackupId));

            setValue('spermOriginId', spermOrigin ?? null);
            setValue('spermStateId', spermState ?? null);
            setValue('spermCollectionOriginId', spermCollectionOrigin ?? null);
            setValue('spermBackupId', spermBackup ?? null);
        }
    }, [intraUterineData, selectOptions]);

    function onSave({ treatmentPlanCycle, ...rest }: any) {
        let bodyData = {
            ...rest,
            id: plannedProcessId,
            ...getTreatmentPlanFormBody(rest)
        };

        // create and update api ishandled from single service
        let intraUterineInseminationService = services[(isUpdateForm ? 'updateIntraUterineInsemination' : 'createIntraUterineInsemination') as keyof typeof services];
        setLoading(true);
        intraUterineInseminationService(bodyData)
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
            title={formatMessage({ id: "intra-uterine-insemination" })}
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
                        formData={intraUterineData}
                    />

                    <Grid item xs={12}>
                        <CustomRadioGroup
                            label={formatMessage({ id: 'type-of-cycle' })}
                            name="typeofCycle"
                            control={control}
                            groupList={cycleTypePCList}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <PaperWithLabel label={formatMessage({ id: "sperm" })}>
                            <Grid container spacing={3}>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <CustomSelect
                                        formLabel={formatMessage({ id: "source" })}
                                        name="spermOriginId"
                                        control={control}
                                        options={selectOptions?.spermOrigins ?? []}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <CustomSelect
                                        formLabel={formatMessage({ id: "state" })}
                                        name="spermStateId"
                                        control={control}
                                        options={selectOptions?.spermStates ?? []}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <CustomSelect
                                        formLabel={formatMessage({ id: "origin" })}
                                        name="spermCollectionOriginId"
                                        control={control}
                                        options={selectOptions?.spermCollectionOrigins ?? []}
                                    />
                                </Grid>
                                <Grid item xs={6} lg={2} md={3} sm={4}>
                                    <CustomSelect
                                        formLabel={formatMessage({ id: "back-up" })}
                                        name="spermBackupId"
                                        control={control}
                                        options={selectOptions?.spermBackups ?? []}
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

export default IntraUterineInsemination;