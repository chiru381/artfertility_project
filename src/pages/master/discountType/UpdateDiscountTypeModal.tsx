import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from '@material-ui/core/Grid';

import { CustomTextBox } from "components/forms";
import { FormModal, HoverLoader } from "components";
import { validationRule, getFormBody } from "utils/global";
import { services } from "utils/services";
import { useToastMessage } from "utils/hooks";

interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void;
}
const UpdateDiscountTypeModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { toastMessage } = useToastMessage();
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall, selectedData } = props;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        reset(selectedData)
    }, [reset, selectedData]);
    
    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: selectedData.id
        }
        setLoading(true);
        services.updateDiscountType(bodyData)
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
            title={formatMessage({ id: "update-discounttype"})}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomTextBox
                        label={formatMessage({ id: "name" })}
                        name="name"
                        control={control}
                        error={errors.name}
                        rules={validationRule.textbox({ required: true, type: "textWithSpace" })}
                    />
                </Grid>
            </Grid>
        </FormModal>

        {loading && <HoverLoader />}
        </>
    )
}

export default UpdateDiscountTypeModal;