import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { CustomTextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    onApiCall: () => void,
    formMode: 'create' | 'update';
    selectedData: any;
    headerText: string;
}

const Form = (props: Props) => {
    const { closeModal, onApiCall, formMode, selectedData, headerText } = props;
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useToastMessage();

    function onSubmit(data: any) {
        setLoading(true);
        if (formMode === 'update') data.id = selectedData?.id;
        const apiFunc = formMode === 'create' ? 'createClinicalDocumentType' : 'updateClinicalDocumentType';
        const message = formMode === 'create' ? 'insert-message' : 'update-message';
        services[apiFunc](data)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: message }));
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

    useEffect(() => {
        if (formMode === 'update' && selectedData) {
            reset(selectedData);
        }
    }, [formMode, selectedData]);

    return (
        <>
            <FormModal
                onCancel={closeModal}
                onConfirm={handleSubmit(onSubmit)}
                title={headerText}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "document-type-name" })}
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

export default Form;