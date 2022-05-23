import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { CustomSelect, CustomTextBox, CustomDatePicker } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { validationRule, getFormBody } from 'utils/global';
import { useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';


interface Props {
  closeModal: () => void;
  onApiCall: (status: boolean) => void
}

const AddNewRequest = (props: Props) => {
  const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { closeModal, onApiCall } = props;
  const [loading, setLoading] = useState(false);
  const { toastMessage } = useToastMessage();

  const { medicalStaffData, profileData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      medicalStaffData: masterPaginationReducer[masterPaginationServices.medicalStaff].data,
      profileData: masterPaginationReducer[masterPaginationServices.profile].data
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.medicalStaff, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.profile, {}));
  }, []);

  let medicalStaffOptions = medicalStaffData.modelItems?.map((option: any) => ({ label: option.userDisplayName, value: option.id }));
  let profileOptions = profileData.modelItems?.map((option: any) => ({ label: option.profileName, value: option.id }));

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    setLoading(true);
    services.createBloodLabRequest(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          onApiCall(false);
          toastMessage(formatMessage({ id: "create-message" }));
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
        title={formatMessage({ id: "add-new-request" })}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "patient-partner-name" })}
              name="name"
              control={control}
              error={errors.name}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "uhid" })}
              name="uhid"
              control={control}
              error={errors.name}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <CustomSelect
              options={medicalStaffOptions}
              label={formatMessage({ id: "requested-by" })}
              name="drRequestId"
              control={control}
              error={errors.drRequestId}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomSelect
              options={medicalStaffOptions}
              label={formatMessage({ id: "assistant" })}
              name="assistantId"
              control={control}
              error={errors.assistantId}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomSelect
              options={profileOptions}
              label={formatMessage({ id: "profile" })}
              name="profileId"
              control={control}
              error={errors.profileId}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomDatePicker
              label={formatMessage({ id: "date" })}
              name="requestDate"
              control={control}
              error={errors.requestDate}
              rules={validationRule.textbox({ required: true })}
            />
          </Grid>
        </Grid>
      </FormModal>

      {loading && <HoverLoader />}
    </>
  )
}

export default AddNewRequest;