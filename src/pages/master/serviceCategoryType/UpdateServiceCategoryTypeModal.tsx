import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { CustomTextBox, CustomSelect } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule, getFormBody } from 'utils/global';
import { useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';

interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void;
}

const UpdateServiceCategoryTypeModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, selectedData, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();

    useEffect(() => {
        reset(selectedData);
    }, [reset, selectedData]);

    const { serviceCategoryTypeData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            serviceCategoryTypeData: masterPaginationReducer[masterPaginationServices.serviceCategoryType].data,
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.serviceCategoryType, {}));
    }, []);

    // let serviceCategoryOptions = serviceCategoryTypeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));


    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: selectedData.id
        }
        setLoading(true);
        services.updateServiceCategoryType(bodyData)
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
                title={formatMessage({ id: "update-service-category-type" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "service-category-type-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, type: "textWithSpace", maxLength: 50 })}
                        />
                    </Grid>

                </Grid>
            </FormModal>

            {loading && <HoverLoader />}
        </>
    )
}

export default UpdateServiceCategoryTypeModal;