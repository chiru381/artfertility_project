import { useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from '@material-ui/core/Grid';

import { CustomTextBox } from "components/forms";
import { FormModal, HoverLoader } from "components";
import { useToastMessage } from "utils/hooks";
import { validationRule, getFormBody } from "utils/global";
import { services } from "utils/services";

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void;
}
const CreateStageModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();
    const { formatMessage } = useIntl();

    function onSubmit(data: any) {
        setLoading(true);
        services.createStage(data)
        .then((res) => {
            setLoading(false);
            if(res.data?.succeeded) {
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
            title={formatMessage({ id: "create-stage" })}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomTextBox
                        label={formatMessage({ id: "stages"})}
                        name="name"
                        control={control}
                        error={errors.name}
                    />
                </Grid>
                <Grid item xs={12}>
                    <CustomTextBox
                        label={formatMessage({ id: "cycle"})}
                        name="cycleName"
                        control={control}
                        error={errors.cycleName}
                    />
                </Grid>
            </Grid>
        </FormModal>

        {loading && <HoverLoader />}
        </>
    )
}

export default CreateStageModal;