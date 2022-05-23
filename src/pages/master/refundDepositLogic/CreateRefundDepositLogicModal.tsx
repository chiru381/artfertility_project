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

const CreateRefundDepositLogicModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { toastMessage } = useToastMessage();
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    // cycleData
    const { stageData,  } = useSelector( 
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
        setLoading(true);
        services.createRefundDepositLogic(bodyData)
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
                title={formatMessage({ id: "create-refundDepositLogic" })}
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
                            name="cycleName"
                            control={control}
                            error={errors.cycleName}
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
                    <CustomDatePicker
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

export default CreateRefundDepositLogicModal;