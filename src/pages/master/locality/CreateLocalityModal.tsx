
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
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import { getTableParams } from 'utils/global';
import { getFormBody } from 'utils/global';
import { RootReducerState } from 'utils/types';

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}
const CreateLocalityModal = (props: Props) => {
    const [tableState, setTableState] = useState(tableInitialState);
    const dispatch = useDispatch();
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();

    const { cityData, provinceData, countryData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            cityData: masterPaginationReducer[masterPaginationServices.city].data,
            provinceData: masterPaginationReducer[masterPaginationServices.province].data,
            countryData: masterPaginationReducer[masterPaginationServices.country].data

        }),
        shallowEqual
    );

    useEffect(() => {
        onCityApiCall();
    }, [tableState]);

    function onCityApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.city, params));
        dispatch(getMasterPaginationData(masterPaginationServices.province, params));
        dispatch(getMasterPaginationData(masterPaginationServices.country, params));
    }

    let cityOptions = cityData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let provinceOptions = provinceData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let countryOptions = countryData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
        services.createLocality(bodyData)
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
                title={formatMessage({ id: "create-locality" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "locality-name" })}
                            name="name"
                            control={control}
                        // error={errors.address}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelect
                            options={cityOptions}
                            label={formatMessage({ id: "city" })}
                            name="cityId"
                            control={control}
                            error={errors.cityId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={provinceOptions}
                            label={formatMessage({ id: "province" })}
                            name="cityProvinceId"
                            control={control}
                            error={errors.cityProvinceId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={countryOptions}
                            label={formatMessage({ id: "country" })}
                            name="cityProvinceCountryId"
                            control={control}
                            error={errors.cityProvinceCountryId}
                        />
                    </Grid>

                </Grid>

            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default CreateLocalityModal;