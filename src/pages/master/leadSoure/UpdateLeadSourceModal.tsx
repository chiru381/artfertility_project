import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';

import { CustomSelect, CustomTextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { getFormBody, validationRule } from 'utils/global';
import { leadSourceOrderList } from 'utils/constants';
import RootContext from 'utils/context/RootContext';
import { services } from 'utils/services';

interface Props {
    closeModal: () => void;
    selectedData: any;
    onApiCall: () => void
}

const UpdateLeadSourceModal = (props: Props) => {
    const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
    const { formatMessage } = useIntl();
    const { closeModal, selectedData, onApiCall } = props;
    const [loading, setLoading] = useState(false);
    const { toastMessage } = useContext<any>(RootContext);

    useEffect(() => {
        let data = {
            ...selectedData,
            leadSourceOrder: leadSourceOrderList?.find(item => item.value == selectedData?.leadSourceOrder)
        }
        reset(data);
    }, [reset]);

    function onSubmit(data: any) {
        let bodyData = getFormBody(data);
        bodyData['id'] = selectedData.id;

        setLoading(true);
        services.updateLeadSource(bodyData)
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
                title={formatMessage({ id: "update-lead-source" })}>

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

export default UpdateLeadSourceModal;