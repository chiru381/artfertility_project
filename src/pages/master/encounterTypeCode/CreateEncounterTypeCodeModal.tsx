import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';

import { CustomTextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { getFormBody, validationRule } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';

interface Props {
  closeModal: () => void;
  onApiCall: (status: boolean) => void
}

const CreateEncounterTypeCodeModal = (props: Props) => {
  const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
  const { formatMessage } = useIntl();
  const { closeModal, onApiCall } = props;
  const [loading, setLoading] = useState(false);
  const { toastMessage } = useToastMessage();

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    setLoading(true);
    services.createEncounterTypesCode(bodyData)
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
        title={formatMessage({ id: "create-encounter-type-code" })}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "type-code" })}
              name="code"
              control={control}
              error={errors.code}
              rules={validationRule.textbox({ required: true, maxLength: 125 })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "description" })}
              name="description"
              control={control}
              error={errors.description}
              rules={validationRule.textbox({ maxLength: 200 })}
              rows={4}
              multiline
            />
          </Grid>
        </Grid>
      </FormModal>
      {loading && <HoverLoader />}
    </>
  )
}

export default CreateEncounterTypeCodeModal;