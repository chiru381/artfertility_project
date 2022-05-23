import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import { treatmentPlanMenuList } from 'utils/constants/menu';
import { cycleTypePCList } from 'utils/constants';
import { services } from 'utils/services';
import { useGetOngoingTreatmentProcessId, useToastMessage } from 'utils/hooks';
import { HoverLoader } from 'components';
import { CustomRadioGroup } from 'components/forms';
import { getTreatmentPlanFormBody } from 'utils/global';

import { CustomClinicalActionHeaderWithWrap } from '../CustomClinicalActionHeader';
import TreatmentProcessCycleInfo from './TreatmentProcessCycleInfo';
import TreatmentProcessPatientInfo from './TreatmentProcessPatientInfo';
import TreatmentProcessFooterAction from './TreatmentProcessFooterAction';

interface Props {

}

const PlannedCoitus = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, setValue } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [loading, setLoading] = useState(false);
    const [isUpdateForm, setIsUpdateForm] = useState(false);
    const [plannedCoitusData, setPlannedCoitusData] = useState<any>(null);
    const plannedProcessId = useGetOngoingTreatmentProcessId();

    useEffect(() => {
        if (plannedProcessId) {
            setLoading(true);
            let params = { id: plannedProcessId };
            services.getPlannedCoitusById(params)
                .then((res) => {
                    setLoading(false);
                    if (res.data?.succeeded) {
                        setIsUpdateForm(true);
                        setPlannedCoitusData(res.data.response);
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

    function onSave(data: any) {
        let bodyData = {
            id: plannedProcessId,
            ...getTreatmentPlanFormBody(data)
        };

        // create and update api ishandled from single service
        let plannedCoitusService = services[(isUpdateForm ? 'updatePlannedCoitus' : 'createPlannedCoitus') as keyof typeof services];
        setLoading(true);
        plannedCoitusService(bodyData)
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
            title={formatMessage({ id: "planned-coitus" }) + '/' + formatMessage({ id: "timed-intercourse" })}
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
                        formData={plannedCoitusData}
                    />

                    <Grid item xs={12}>
                        <CustomRadioGroup
                            label={formatMessage({ id: 'type-of-cycle' })}
                            name="typeOfCycle"
                            control={control}
                            groupList={cycleTypePCList}
                        />
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

export default PlannedCoitus;