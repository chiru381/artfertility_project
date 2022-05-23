
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomSelect, CustomTextBox, CustomDatePicker } from 'components/forms';
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
const CreateTariffModal = (props: Props) => {
    const dispatch = useDispatch();
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();

    const { countryData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            countryData: masterPaginationReducer[masterPaginationServices.country].data
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.country, {}));
    }, []);

    let countryOptions = countryData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
        services.createTariff(bodyData)
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
                title={formatMessage({ id: "create-tarrif" })}
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

export default CreateTariffModal;