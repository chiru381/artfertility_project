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
const UpdateRefundDepositLogicModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const { closeModal, selectedData, onApiCall } = props;

    // cycleData
    const { stageData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            stageData: masterPaginationReducer[masterPaginationServices.stage].data
            // cycleData: masterPaginationReducer[masterPaginationServices.cycle].data
        }),
        shallowEqual
    );

    let stageOptions = stageData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    // let cycleOptions = cycleData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.stage, {}));
        // dispatch(getMasterPaginationData(masterPaginationServices.cycle, {}));
    }, []);


    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: selectedData.id
        }
        setLoading(true);
        services.updateRefundDepositLogic(bodyData)
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
                        <CustomSelect
                            options={stageOptions}
                            label={formatMessage({ id: "stage" })}
                            name="stageId"
                            control={control}
                            error={errors.stageId}
                        />
                    </Grid>
                    {/* <Grid item xs={12}>
                        <CustomSelect
                            options={cycleOptions}
                            label={formatMessage({ id: "cycle" })}
                            name="cycle"
                            control={control}
                            error={errors.cycle}
                        />
                    </Grid> */}
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "advance" })}
                            name="advancePercentage"
                            control={control}
                            error={errors.advancePercentage}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "refund" })}
                            name="refundPercentage"
                            control={control}
                            error={errors.refundPercentage}
                            rules={validationRule.textbox({type: "textWithNumber" })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "effective-from" })}
                            name="effectiveFrom"
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

export default UpdateRefundDepositLogicModal;