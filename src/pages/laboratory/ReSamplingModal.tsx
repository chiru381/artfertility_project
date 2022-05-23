import { useState } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from '@material-ui/core/Grid';

import { CustomSelect } from "components/forms";
import { FormModal, HoverLoader } from "components";
import { validationRule, getFormBody } from "utils/global";
import { services } from "utils/services";;
import { useToastMessage } from "utils/hooks";
import { reSamplingReasonOptions, testReportStatus } from "utils/constants";

interface Props {
  closeModal: () => void;
  selectedData: any;
  onApiCall: () => void;
}

const ReSamplingModal = (props: Props) => {
  const { closeModal, selectedData, onApiCall } = props;
  const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const [loading, setLoading] = useState(false);

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    bodyData = {
      ...bodyData,
      id: selectedData.id,
      collectionDate: null,
      dispatchDate: null,
      acknowledgeDate: null,
      draftDate: null,
      testDoneDate: null,
      verifiedDate: null,
      remarks: null,
      labNumber: null,
      isSentToIntegration: false,
      collectedById: null,
      dispatchById: null,
      acknowledgeById: null,
      draftById: null,
      testDoneById: null,
      verifiedById: null,
      dispatchClinicId: null,
      testStatusId: testReportStatus.NewOrder
    }
    setLoading(true);
    services.reSamplingTestResult(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          onApiCall();
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
        title={formatMessage({ id: "re-sampling" })}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomSelect
              options={reSamplingReasonOptions}
              label={formatMessage({ id: "re-sampling-reason" })}
              name="reSamplingReasonId"
              control={control}
              error={errors.reSamplingReasonId}
              rules={validationRule.textbox({ required: true })}
            />
          </Grid>
        </Grid>
      </FormModal>

      {loading && <HoverLoader />}
    </>
  )
}

export default ReSamplingModal;