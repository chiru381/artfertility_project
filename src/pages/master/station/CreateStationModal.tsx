
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomSelect, CustomTextBox, CustomCheckBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { getFormBody,validationRule } from 'utils/global';
import { RootReducerState } from 'utils/types';

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}

const CreateStationModal = (props: Props) => {
    const dispatch = useDispatch();
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();

    const { clinicData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            clinicData: masterPaginationReducer[masterPaginationServices.clinic].data
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.clinic, {}));
    }, []);

    let clinicOptions = clinicData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
        services.createStation(bodyData)
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
                title={formatMessage({ id: "create-station" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "station-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelect
                            options={clinicOptions}
                            label={formatMessage({ id: "clinic" })}
                            name="clinicId"
                            control={control}
                            error={errors.clinicId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup>
                            <CustomCheckBox
                                name="isStore"
                                label={formatMessage({ id: "is-store" })}
                                control={control}
                                error={errors.isStore}
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup>
                            <CustomCheckBox
                                name="isPharmacyStore"
                                label={formatMessage({ id: "is-pharmacy-store" })}
                                control={control}
                                error={errors.isPharmacyStore}
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup>
                            <CustomCheckBox
                                name="isWard"
                                label={formatMessage({ id: "is-ward" })}
                                control={control}
                                error={errors.isWard}
                            />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup>
                            <CustomCheckBox
                                name="isLabStation"
                                label={formatMessage({ id: "is-lab-station" })}
                                control={control}
                                error={errors.isLabStation}
                            />
                        </FormGroup>
                    </Grid>
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default CreateStationModal;