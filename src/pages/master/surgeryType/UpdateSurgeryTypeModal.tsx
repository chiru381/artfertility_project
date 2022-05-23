import { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';

import { CustomTextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule } from 'utils/global';
import RootContext from 'utils/context/RootContext';
import { services } from 'utils/services';

interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void
}

const UpdateSurgeryTypeModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const {closeModal, selectedData, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useContext<any>(RootContext);

    useEffect(() => {
        reset(selectedData);
    }, [reset])

    function onSubmit(data: any) {
        setLoading(true);
        services.updateSurgeryType({ ...selectedData, ...data })
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "update-message" }));
                    closeModal();
                }else{
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
        {loading && <HoverLoader />}
     </>
    )
}

export default UpdateSurgeryTypeModal;