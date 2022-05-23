import { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomSelect, CustomTextBox, CustomDatePicker } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule, getFormBody } from 'utils/global';
import RootContext from 'utils/context/RootContext';
import { services } from 'utils/services';
import { getMasterPaginationData } from 'redux/actions';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';

interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void
}

const UpdateTariffModal = (props: Props) => {
    const [tableState, setTableState] = useState(tableInitialState);
    const dispatch = useDispatch();
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, selectedData, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useContext<any>(RootContext);

    const { countryData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            countryData: masterPaginationReducer[masterPaginationServices.country].data
        }),
        shallowEqual
    );

    useEffect(() => {
        onCountryApiCall();
    }, [tableState]);

    function onCountryApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.country, params));
    }

    let countryOptions = countryData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));


    useEffect(() => {
        reset(selectedData);
    }, [reset])

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: selectedData.id
        }
        setLoading(true);
        services.updateTariff(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "update-tariff" }));
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
                title={formatMessage({ id: "update-province" })}
            >
                <Grid container spacing={2}>
                <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "tariff-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                        />
                    </Grid>
                    
                    <Grid item xs={12}>
                        <CustomDatePicker
                            label={formatMessage({ id: "effective-from" })}
                            name="effectiveFrom"
                            control={control}
                            error={errors.effectiveFrom}
                        />
                    </Grid>

                    
                    <Grid item xs={12}>
                        <CustomDatePicker
                            label={formatMessage({ id: "effective-to" })}
                            name="effectiveTo"
                            control={control}
                            error={errors.effectiveFrom}
                        />
                    </Grid>

                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default UpdateTariffModal;