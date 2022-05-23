import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { CustomTextBox, CustomSelect, CustomCheckBox, RadioButton } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule, getFormBody } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}

const CreateDiagnosticCodeModal = (props: Props) => {
    const { closeModal, onApiCall } = props;
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        setLoading(true);
        services.createDepartment(bodyData)
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
                title={formatMessage({ id: "diagnostic-code" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "icd-code" })}
                            name="code"
                            control={control}
                            error={errors.code}
                            rules={validationRule.textbox({ required: true, maxLength: 20 })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "icd-description" })}
                            name="description"
                            control={control}
                            error={errors.description}
                            rules={validationRule.textbox({ required: true, maxLength: 100 })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <RadioButton
                            name=""
                            label={formatMessage({ id: "Male" })}
                         
                        />
                        <RadioButton
                            name=""
                            label={formatMessage({ id: "Female" })}
                         
                        />
                        <RadioButton
                            name=""
                            label={formatMessage({ id: "Both" })}
                        />
                    </Grid>
                  
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default CreateDiagnosticCodeModal;