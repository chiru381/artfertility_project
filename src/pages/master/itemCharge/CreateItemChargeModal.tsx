import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { CustomTextBox, CustomDatePicker, CustomSelect, CustomCheckBox } from 'components/forms';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { FormModal, HoverLoader } from 'components';
import { getFormBody, validationRule } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void;
}

const CreateItemChargeModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { toastMessage } = useToastMessage();
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const { itemChargeData, } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            itemChargeData: masterPaginationReducer[masterPaginationServices.itemCharge].data
        }),
        shallowEqual
    );

    let stageOptions = itemChargeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.itemCharge, {}));
    }, []);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
        services.createItemCharge(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall(false);
                    toastMessage(formatMessage({ id: "insert-message" }));
                    closeModal();
                } else {
                    toastMessage(res.data?.messge, 'error');
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
                title={formatMessage({ id: "item-charge" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "search-by-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "charge-code" })}
                            name="chargeCode"
                            control={control}
                            error={errors.chargeCode}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "percentage" })}
                            name="percentage"
                            control={control}
                            error={errors.percentage}
                            rules={validationRule.textbox({ type: "textWithNumber" })}
                        />
                    </Grid>
                </Grid>
            </FormModal>

            {loading && <HoverLoader />}
        </>
    )
}

export default CreateItemChargeModal;