import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { CustomTextBox, CustomSelect } from "components/forms";
import { getMasterPaginationData } from "redux/actions";
import { masterPaginationServices } from "utils/constants";
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
const UpdateDiscountAuthorityMatrixModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const { closeModal, selectedData, onApiCall } = props;

    const { roleData, discountTypeData, discountReasonData} = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            roleData: masterPaginationReducer[masterPaginationServices.role].data,
            discountTypeData: masterPaginationReducer[masterPaginationServices.discountType].data,
            discountReasonData: masterPaginationReducer[masterPaginationServices.discountReason].data
        }),
        shallowEqual
    );

    let roleOptions = roleData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let discountTypeOptions = discountTypeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let discountReasonOptions = discountReasonData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    
    useEffect(()=>{
        dispatch(getMasterPaginationData(masterPaginationServices.role, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.discountType, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.discountReason, {}));
    }, []);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: selectedData.id
        }
        setLoading(true);
        services.updateDiscountAuthorityMatrix(bodyData)
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
                title={formatMessage({ id: "update-discountAuthorityMatrix" })}
            >
                <Grid container spacing={2}>
                <Grid item xs={12}>
                        <CustomSelect
                            options={roleOptions}
                            label={formatMessage({ id: "role" })}
                            name="userRoleId"
                            control={control}
                            error={errors.userRoleId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={discountTypeOptions}
                            label={formatMessage({ id: "discount-type" })}
                            name="discountTypeId"
                            control={control}
                            error={errors.discountTypeId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomSelect
                            options={discountReasonOptions}
                            label={formatMessage({ id: "discount-reason" })}
                            name="discountReasonId"
                            control={control}
                            error={errors.discountReasonId}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "max-discount" })}
                            name="maxDiscountPer"
                            control={control}
                            error={errors.maxDiscountPer}
                            rules={validationRule.textbox({ required: true, type: "number" })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "discount-limit-amt" })}
                            name="discountLimit"
                            control={control}
                            error={errors.discountLimit}
                            rules={validationRule.textbox({ required: true, type: "number" })}
                        />
                    </Grid>
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default UpdateDiscountAuthorityMatrixModal;