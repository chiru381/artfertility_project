import { useState, useEffect } from 'react';
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
  selectedData: any;
  onApiCall: () => void
}

const UpdateEncounterEndTypeModal = (props: Props) => {
  const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);
  const { toastMessage } = useToastMessage();
  const { closeModal, selectedData, onApiCall } = props;

  useEffect(() => {
    reset(selectedData);
  }, [reset]);

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    bodyData = {
      ...bodyData,
      id: selectedData.id
    }
    setLoading(true);
    services.updateEncounterEndTypes(bodyData)
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
        title={formatMessage({ id: "update-encounter-end-type" })}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "end-type" })}
              name="endType"
              control={control}
              error={errors.startType}
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

export default UpdateEncounterEndTypeModal;