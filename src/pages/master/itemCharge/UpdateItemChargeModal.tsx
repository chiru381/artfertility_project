import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { CustomTextBox, CustomDatePicker, CustomSelect, CustomCheckBox, CustomRadioGroup } from 'components/forms';
import { getMasterPaginationData } from "redux/actions";
import { masterPaginationServices, calculationBehaviour } from 'utils/constants';
import { RootReducerState } from "utils/types";
import { FormModal, HoverLoader } from "components";
import { getFormBody, validationRule } from "utils/global";
import { services } from "utils/services";
import { useToastMessage } from "utils/hooks";

interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void;
}
const UpdateItemChargeModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const { closeModal, selectedData, onApiCall } = props;

    // cycleData
    const { itemChargeData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            itemChargeData: masterPaginationReducer[masterPaginationServices.itemCharge].data
        }),
        shallowEqual
    );

    // let stageOptions = itemChargeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    // let cycleOptions = cycleData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.itemCharge, {}));
        // dispatch(getMasterPaginationData(masterPaginationServices.cycle, {}));
    }, []);


    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: selectedData.id
        }
        setLoading(true);
        services.updateItemCharge(bodyData)
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
                title={formatMessage({ id: "update-refundDepositLogic" })}
            >
              <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "search-by-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, type: "textWithNumber", maxLength: 25, minLength: 0 })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "charge-code" })}
                            name="chargeCode"
                            control={control}
                            error={errors.chargeCode}
                            rules={validationRule.textbox({ required: true, type: "textWithNumber", maxLength: 10, minLength: 0 })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "percentage" })}
                            name="itemValue"
                            control={control}
                            error={errors.itemValue}
                            rules={validationRule.textbox({ type: "textWithNumber" })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomCheckBox
                            name="isCalculationOnGross"
                            label={formatMessage({ id: "calculate-on-gross" })}
                            control={control}
                            error={errors.isCalculationOnGross}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomRadioGroup
                            label={formatMessage({ id: "calculate-on-behaviour" })}
                            name="calculationBehaviour"
                            control={control}
                            groupList={calculationBehaviour}
                        />
                    </Grid>
                </Grid>
            </FormModal>

            {loading && <HoverLoader />}
        </>
    )
}

export default UpdateItemChargeModal;