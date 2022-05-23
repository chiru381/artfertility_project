import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useContext, useState } from 'react';

import { FormModal } from 'components';
import { CustomTextBox } from 'components/forms';
import { validationRule } from 'utils/global';
import RootContext from 'utils/context/RootContext';
import { services } from 'utils/services';


interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}

const CreateSurgeryTypeModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useContext<any>(RootContext);

    function onSubmit(data: any) {
        setLoading(true);
        services.createSurgeryType(data)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall(false);
                    toastMessage(formatMessage({ id: "insert-message" }));
                    closeModal();
                }else{
                    toastMessage(res.data.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }
    return (
        <FormModal
            onCancel={closeModal}
            onConfirm={handleSubmit(onSubmit)}
            title={formatMessage({ id: "surgery-type" })}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CustomTextBox
                        label={formatMessage({ id: "surgery-type" })}
                        name="name"
                        control={control}
                        error={errors.name}
                        rules={validationRule.textbox({ required: true, type: "textWithNumber" })}
                    />
                </Grid>
            </Grid>
        </FormModal>
    )
}

export default CreateSurgeryTypeModal;