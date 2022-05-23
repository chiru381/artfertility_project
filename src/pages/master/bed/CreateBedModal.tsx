
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomSelect, CustomTextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { getFormBody, validationRule } from 'utils/global';
import { RootReducerState } from 'utils/types';

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}
const CreateBedModal = (props: Props) => {
    const dispatch = useDispatch();
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall } = props;
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

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
        services.createBed(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall(false);
                    toastMessage(formatMessage({ id: "insert-message" }));
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
                title={formatMessage({ id: "create-bed" })}
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

export default CreateBedModal;