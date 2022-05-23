import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';


import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { CustomTextBox, CustomSelect } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule, getFormBody } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { RootReducerState } from 'utils/types';

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}

const CreateServiceCategoryModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();


    const { serviceCategoryData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            serviceCategoryData: masterPaginationReducer[masterPaginationServices.serviceCategory].data,
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.serviceCategory, {}));
    }, []);

    let serviceCategoryOptions = serviceCategoryData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));


    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
        services.createServiceCategory(bodyData)
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
                title={formatMessage({ id: "create-service-category" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "service-category-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, type: "textWithSpace", maxLength: 125 })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelect
                            options={serviceCategoryOptions}
                            label={formatMessage({ id: "service-category-type" })}
                            name="serviceCategoryTypeId"
                            control={control}
                            error={errors.serviceCategoryTypeId}
                            rules={validationRule.textbox({ required: true, type: "number"})}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "gl-code" })}
                            name="glCode"
                            control={control}
                            error={errors.glCode}
                            rules={validationRule.textbox({ required: true, })}
                        />
                    </Grid>
                </Grid>
            </FormModal>

            {loading && <HoverLoader />}
        </>
    )
}

export default CreateServiceCategoryModal;