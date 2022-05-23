import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomSelect, CustomTextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule, getFormBody } from 'utils/global';
import { services } from 'utils/services';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { useToastMessage } from 'utils/hooks';
import { RootReducerState } from 'utils/types';

interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void
}

const UpdateBedModal = (props: Props) => {
    const dispatch = useDispatch();
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, selectedData, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();

    const { stationData, clinicData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            stationData: masterPaginationReducer[masterPaginationServices.station].data,
            clinicData: masterPaginationReducer[masterPaginationServices.clinic].data
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.station, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.clinic, {}));
    }, []);

    let clinicOptions = clinicData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let stationOptions = stationData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    useEffect(() => {
        reset(selectedData);
    }, [reset])

    useEffect(() => {
        if (stationOptions.length && clinicOptions.length) {
            let data = {
                ...selectedData,
                stationId: stationOptions?.find((item: any) => item.value == selectedData?.stationId) ?? null,
                stationClinicId: clinicOptions?.find((item: any) => item.value == selectedData?.stationClinicId) ?? null
            };

            reset(data);
        }
    }, [reset, stationOptions.length, clinicOptions.length]);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: selectedData.id
        }
        setLoading(true);
        services.updateBed(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "update-message" }));
                    closeModal();
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
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={formatMessage({ id: "update-bed" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "bed-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelect
                            options={clinicOptions}
                            label={formatMessage({ id: "clinic-name" })}
                            name="stationClinicId"
                            control={control}
                            error={errors.stationClinicId}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelect
                            options={stationOptions}
                            label={formatMessage({ id: "station-name" })}
                            name="stationId"
                            control={control}
                            error={errors.stationId}
                        />
                    </Grid>
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default UpdateBedModal;