import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';

import { FormModal } from "components";
import { CustomSelect, CustomDatePicker, } from "components/forms";
import { masterPaginationServices, usgStatus } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { getFormBody } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import { services } from "utils/services";

interface Props {
  closeModal: () => void;
}

const CreateRequestModal = (props: Props) => {
  const { closeModal } = props;
  const dispatch = useDispatch();
  const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: 'all' });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  let patientId = useGetPatientId();

  const { medicalStaffData, clinicData, ultrasoundTypeData } =
    useSelector(({ masterPaginationReducer }: RootReducerState) => ({
      medicalStaffData: masterPaginationReducer[masterPaginationServices.medicalStaff].data,
      clinicData: masterPaginationReducer[masterPaginationServices.clinic].data,
      ultrasoundTypeData: masterPaginationReducer[masterPaginationServices.ultrasoundType].data
    }),
      shallowEqual
    );

  let medicalStaffOptions = medicalStaffData.modelItems?.map((option: any) => ({ label: option.userDisplayName, value: option.id, }));
  let clinicOptions = clinicData.modelItems?.map((option: any) => ({ label: option.name, value: option.id, }));
  let ultrasoundTypeOptions = ultrasoundTypeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id, }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.medicalStaff, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.clinic, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.ultrasoundType, {}));
  }, []);

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    bodyData = {
      ...bodyData,
      patientId: patientId,
      usgStatus: usgStatus.Requested
    }
    services.createUltrasoundRequest(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          toastMessage(formatMessage({ id: "create-message" }));
          closeModal();
          history.push(`ultrasound-scan-general`, { ultrasoundRequestId: res.data.result });
        } else {
          toastMessage(res.data?.message, "error");
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, "error");
      });
  }

  return (
    <>
      <FormModal
        onCancel={closeModal}
        onConfirm={handleSubmit(onSubmit)}
        title={formatMessage({ id: "create-new-request" })}
        confirmLabel="Place Order"
      >
        <Grid container spacing={2}>

          <Grid item xs={12}>
            <CustomDatePicker
              label={formatMessage({ id: "date" })}
              name="requestDate"
              control={control}
              error={errors.requestDate}
              minDate={new Date()}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomSelect
              label={formatMessage({ id: "doctor" })}
              options={medicalStaffOptions}
              name="doctorId"
              control={control}
              error={errors.doctorId}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomSelect
              label={formatMessage({ id: "ultrasound-type" })}
              options={ultrasoundTypeOptions}
              name="ultrasoundTypeId"
              control={control}
              error={errors.ultrasoundTypeId}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomSelect
              label={formatMessage({ id: "clinic" })}
              options={clinicOptions}
              name="clinicId"
              control={control}
              error={errors.clinicId}
            />
          </Grid>
        </Grid>
      </FormModal>
    </>
  )
}

export default CreateRequestModal;