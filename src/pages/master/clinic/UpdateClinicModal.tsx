import { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomSelect, CustomTextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule, getFormBody } from 'utils/global';
import RootContext from 'utils/context/RootContext';
import { services } from 'utils/services';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';

interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void
}

const UpdateClinicModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { closeModal, selectedData, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useContext<any>(RootContext);

    const { cityData, locationData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            cityData: masterPaginationReducer[masterPaginationServices.city].data,
            locationData: masterPaginationReducer[masterPaginationServices.location].data
        }),
        shallowEqual
    );

    let cityOptions = cityData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let locationOptions = locationData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.city, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.location, {}));
        reset(selectedData);
    }, [reset]);

    useEffect(() => {
        if (cityOptions.length && locationOptions.length) {
            let data = {
                ...selectedData,
                cityId: cityOptions?.find((item: any) => item.value == selectedData?.cityId) ?? null,
                provinceId: locationOptions?.find((item: any) => item.value == selectedData?.provinceId) ?? null,
            };
            reset(data);
        }
    }, [reset, cityOptions.length, locationOptions.length]);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: selectedData.id
        }
        setLoading(true);
        services.updateClinic(bodyData)
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
                title={formatMessage({ id: "update-clinic" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "clinic-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "address" })}
                            name="address"
                            control={control}
                            error={errors.address}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "report-header" })}
                            name="header"
                            control={control}
                            error={errors.header}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "report-footer" })}
                            name="footer"
                            control={control}
                            error={errors.footer}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelect
                            options={cityOptions}
                            label={formatMessage({ id: "city" })}
                            name="cityId"
                            control={control}
                            error={errors.city}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelect
                            options={locationOptions}
                            label={formatMessage({ id: "location" })}
                            name="provinceId"
                            control={control}
                            error={errors.location}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "tin" })}
                            name="taxIdentificationNumber"
                            control={control}
                            error={errors.taxIdentificationNumber}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "code" })}
                            name="code"
                            control={control}
                            error={errors.code}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "chn-prefix" })}
                            name="chnPrefix"
                            control={control}
                            error={errors.chnPrefix}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "telephone" })}
                            name="telephone"
                            control={control}
                            error={errors.telephone}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "email" })}
                            name="email"
                            control={control}
                            error={errors.email}
                            rules={validationRule.textbox({ type: "email" })}
                        />
                    </Grid>
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default UpdateClinicModal;