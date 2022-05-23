import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';

import { CustomSelect, CustomTextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule, getFormBody } from 'utils/global';
import { leadSourceOrderList } from 'utils/constants';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';

interface Props {
    closeModal: () => void;
    onApiCall: (status: boolean) => void
}

const CreateLeadSourceModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useContext<any>(RootContext);

    function onSubmit(data: any) {
        const bodyData = getFormBody(data);
        setLoading(true);
        services.createLeadSource(bodyData)
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
                title={formatMessage({ id: "create-lead-source" })}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <CustomTextBox
                            label={formatMessage({ id: "lead-source-name" })}
                            name="name"
                            control={control}
                            error={errors.name}
                            rules={validationRule.textbox({ required: true, type: "textWithSpace" })}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CustomSelect
                            options={leadSourceOrderList}
                            label={formatMessage({ id: "lead-source-order" })}
                            name="leadSourceOrder"
                            control={control}
                            error={errors.leadSourceOrder}
                        />
                    </Grid>
                </Grid>
            </FormModal>
            {loading && <HoverLoader />}
        </>
    )
}

export default CreateLeadSourceModal;