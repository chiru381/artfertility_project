import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from '@material-ui/core/Grid';

import { FormModal } from "components";
import { CustomTextBox } from "components/forms";
import { getFormBody, validationRule } from "utils/global";

interface Props {
  closeModal: () => void;
  onAddNormalUltrasoundData: (data: any) => void;
}

const NormalUltrasoundModal = (props: Props) => {
  const { closeModal, onAddNormalUltrasoundData } = props;
  const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
  const { formatMessage } = useIntl();

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    onAddNormalUltrasoundData(bodyData);
    closeModal();
  }

  return (
    <>
      <FormModal
        onCancel={closeModal}
        onConfirm={handleSubmit(onSubmit)}
        title={formatMessage({ id: "antral-folicle" })}
        confirmLabel="Accept"
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "right-ovary" })}
              name="folliclesRight"
              control={control}
              error={errors.folliclesRight}
              rules={validationRule.textbox({ type: "number", required: true })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "left-ovary" })}
              name="folliclesLeft"
              control={control}
              error={errors.folliclesLeft}
              rules={validationRule.textbox({ type: "number", required: true })}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "endometrial-thickness" })}
              name="endometrialThickness"
              control={control}
              error={errors.endometrialThickness}
              rules={validationRule.textbox({ type: "number", required: true })}
            />
          </Grid>
        </Grid>
      </FormModal>
    </>
  )
}

export default NormalUltrasoundModal;