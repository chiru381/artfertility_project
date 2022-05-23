import { useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from '@material-ui/core/Grid';

import { CustomTextBox } from "components/forms";
import { FormModal, HoverLoader } from "components";
import { validationRule, getFormBody } from "utils/global";
import { services } from "utils/services";;
import { useToastMessage } from "utils/hooks";

interface Props {
    closeModal: () => void;
    onApiCall: () => void;
}

const CreateBankModal = (props: Props) => {
    const { closeModal, onApiCall } = props;
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const [loading, setLoading] = useState(false);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
        services.createBankDetail(bodyData)
        .then((res) => {
            setLoading(false);
            if (res.data?.succeeded) {
                onApiCall();
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
            title={formatMessage({ id: "create-bank" })}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomTextBox
                        label={formatMessage({ id: "bank-name" })}
                        name="name"
                        control={control}
                        error={errors.name}
                        rules={validationRule.textbox({ required: true, type: "textWithSpace" })}
                    />
                </Grid>
                <Grid item xs={12}>
                    <CustomTextBox
                        label={formatMessage({ id: "branch-address" })}
                        name="address"
                        control={control}
                        error={errors.branchaddress}
                    />
                </Grid>
                <Grid item xs={12}>
                    <CustomTextBox
                        label={formatMessage({ id: "branch-contact-person" })}
                        name="contactPerson"
                        control={control}
                        error={errors.branchcontactperson}
                    />
                </Grid>
                <Grid item xs={12}>
                    <CustomTextBox
                        label={formatMessage({ id: "branch-contact" })}
                        name="telephone"
                        control={control}
                        error={errors.branchcontact}
                    />
                </Grid>
                <Grid item xs={12}>
                    <CustomTextBox
                        label={formatMessage({ id: "ifsc-code" })}
                        name="ifsc"
                        control={control}
                        error={errors.ifsccode}
                    />
                </Grid>
            </Grid>
        </FormModal>
        
        {loading && <HoverLoader />}
        </>
    )
}

export default CreateBankModal;