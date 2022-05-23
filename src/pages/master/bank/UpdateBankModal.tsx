import { useEffect, useState, useContext } from "react";
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

const UpdateBankModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, selectedData, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();

    useEffect(() => {
        reset(selectedData);
    }, [reset, selectedData]);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData = {
            ...bodyData,
            id: selectedData.id
        }
        setLoading(true);
        services.updateBankDetail(bodyData)
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
            title={formatMessage({ id: "update-bank" })}
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

export default UpdateBankModal;