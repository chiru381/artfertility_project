import {useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomTextBox, CustomSelect } from 'components/forms';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { FormModal, HoverLoader } from 'components';
import { getFormBody, validationRule } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void
}

const UpdateCityModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const { closeModal, selectedData, onApiCall } = props;

    const { provinceData, countryData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            provinceData: masterPaginationReducer[masterPaginationServices.province].data,
            countryData: masterPaginationReducer[masterPaginationServices.country].data,

        }),
        shallowEqual
    );

    let provinceOptions = provinceData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let countryOptions = countryData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.province, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.country, {}));
    }, []);

    useEffect(() => {
        if (provinceOptions.length && countryOptions.length) {
            let data = {
                ...selectedData,
                provinceId: provinceOptions?.find((item: any) => item.value == selectedData?.provinceId) ?? null,
                provinceCountryId: countryOptions?.find((item: any) => item.value == selectedData?.provinceCountryId) ?? null,
            };
            reset(data);
        }
    }, [reset, provinceOptions.length, countryOptions.length]);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: selectedData.id
        }
        setLoading(true);
        services.updateCity(bodyData)
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
                title={formatMessage({ id: "update-city" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "city-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, type: "textWithSpace" })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={provinceOptions}
                            label={formatMessage({ id: "province-name" })}
                            name="provinceId"
                            control={control}
                            error={errors.provinceId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={countryOptions}
                            label={formatMessage({ id: "country" })}
                            name="provinceCountryId"
                            control={control}
                            error={errors.provinceCountryId}
                        />
                    </Grid>
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default UpdateCityModal;