import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';

import { CustomTextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule, getFormBody } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}

const CreateLanguageModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
        services.createLanguage(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
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
                title={formatMessage({ id: "create-language" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "language-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                        />
                    </Grid>
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default CreateLanguageModal;