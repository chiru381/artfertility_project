import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { CustomTextBox, CustomDatePicker, CustomSelect } from 'components/forms';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { FormModal, HoverLoader } from 'components';
import { getFormBody, validationRule } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}

const CreateTariffItemModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();

    const { clinicData, tariffItemData, serviceCategoryData, serviceData} = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            clinicData: masterPaginationReducer[masterPaginationServices.clinic].data,
            tariffItemData: masterPaginationReducer[masterPaginationServices.tariffItem].data,
            serviceCategoryData: masterPaginationReducer[masterPaginationServices.serviceCategory].data,
            serviceData: masterPaginationReducer[masterPaginationServices.service].data
        }),
        shallowEqual
    );

    let clinicOptions = clinicData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let tariffItemOptions = tariffItemData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let serviceCategoryOptions = serviceCategoryData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let serviceOptions = serviceData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    
    useEffect(()=>{
        dispatch(getMasterPaginationData(masterPaginationServices.clinic, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.tariffItem, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.serviceCategory, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.service, {}));
    }, []);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
        services.createTariffItem(bodyData)
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
                title={formatMessage({ id: "create-tariff" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={tariffItemOptions}
                            label={formatMessage({ id: "tariff" })}
                            name="tariffId"
                            control={control}
                            error={errors.tariffId}
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
                        <CustomSelect
                            options={serviceCategoryOptions}
                            label={formatMessage({ id: "service-category" })}
                            name="serviceCategoryId"
                            control={control}
                            error={errors.serviceCategoryId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={serviceOptions}
                            label={formatMessage({ id: "service" })}
                            name="serviceItemName"
                            control={control}
                            error={errors.serviceItemName}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomDatePicker
                            label={formatMessage({ id: "effective-form" })}
                            name="effectiveFrom"
                            control={control}
                            error={errors.effectiveFrom}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "price" })}
                            name="price"
                            control={control}
                            rules={validationRule.textbox({ type: "number" })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "mark-up" })}
                            name="markupPer"
                            control={control}
                            rules={validationRule.textbox({  type: "number" })}
                        />
                    </Grid>
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default CreateTariffItemModal;