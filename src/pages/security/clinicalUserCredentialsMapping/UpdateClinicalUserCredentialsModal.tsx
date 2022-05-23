
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';

import { CustomSelect, CustomTextBox, SignatureImagePicker } from 'components/forms';
import { HoverLoader } from 'components';
import { getMasterPaginationData } from 'redux/actions';
import { SaveButton, SecondaryButton } from 'components/button';
import { services } from 'utils/services';
import { masterPaginationServices } from 'utils/constants';
import { getFormBody, validationRule } from 'utils/global';
import { RootReducerState } from 'utils/types';
import { useToastMessage } from 'utils/hooks';
import { FormPrimaryHeading } from 'components/forms';

interface Props {
  closeModal: () => void;
  selectedData: any;
  onApiCall: () => void
}

const UpdateClinicalUserCredentialsMapping = (props: Props) => {
  const { closeModal, selectedData, onApiCall } = props;
  const { handleSubmit, formState: { errors }, control, watch, register, setValue, clearErrors, getValues, reset } = useForm({ mode: 'all' });
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const [loading, setLoading] = useState(false);

  const { userData, specialityData, qualificationData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      userData: masterPaginationReducer[masterPaginationServices.user].data,
      specialityData: masterPaginationReducer[masterPaginationServices.department].data,
      qualificationData: masterPaginationReducer[masterPaginationServices.qualification].data
    }),
    shallowEqual
  );

  let userOptions = userData.modelItems?.map((option: any) => ({ label: option.displayName, value: option.id }));
  let specialityOptions = specialityData.modelItems?.filter((item: any) => item.hasSpeciality == true)?.map((option: any) => ({ label: option.name, value: option.id }));
  let qualificationOptions = qualificationData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

  // specialityData.modelItems
  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.user, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.department, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.qualification, {}));
  }, []);

  useEffect(() => {
    if (userOptions?.length && specialityData.modelItems?.length && qualificationOptions?.length) {
      getClinicalUserCredentialsByIdOnApiCall();
    }
  }, [reset, userOptions?.length && specialityData.modelItems?.length && qualificationOptions?.length])

  function getClinicalUserCredentialsByIdOnApiCall() {
    let paramsData = {
      doctorId: selectedData.id
    };
    setLoading(true);
    services.getMedicalStaffId(paramsData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setFormData(res.data.response);
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function setFormData(formData: any) {

    let associates = formData?.doctorAssociates.map((item: any) => item.associateId).filter((value: any, index: any, self: any) => self.indexOf(value) === index)

    let data = {
      ...formData,
      id: userOptions?.find((item: any) => item.value == formData?.id) ?? null,

      medicalStaffQualificationIds: formData?.medicalStaffQualifications?.map((item: any) => (
        qualificationOptions?.find((option: any) => option.value == item.qualificationId)
      )),
      medicalStaffSpecialityIds: formData?.medicalStaffSpecialities?.map((item: any) => (
        specialityOptions?.find((option: any) => option.value == item.specialityId)
      )),
      doctorAssociateIds: associates?.map((item: any) => (
        userOptions?.find((option: any) => option.value == item)
      ))
    }

    reset(data);
  }

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    let formData = new FormData();
    formData.append("id", bodyData.id);
    formData.append("smsReceivingNumber", bodyData.smsReceivingNumber);

    bodyData.medicalStaffQualificationIds?.map((item: any) => {
      formData.append("medicalStaffQualificationIds", item);
    });
    bodyData.medicalStaffSpecialityIds?.map((item: any) => {
      formData.append("medicalStaffSpecialityIds", item);
    });
    bodyData.doctorAssociateIds?.map((item: any) => {
      formData.append("doctorAssociateIds", item);
    });

    formData.append("signature", bodyData.image?.[0]);

    setLoading(true);
    services.updateMedicalStaff(formData)
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
    <Modal open={true}>
      <>
        <div className="full-modal-container">
          <Box className="full-modal-scroll-container">
            <div className="full-modal-head-container">
              <FormPrimaryHeading label={"CLINICAL USER CREDENTIALS MAPPING"} />
              <CustomFooter
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                closeModal={() => {
                  closeModal();
                }}
              />
            </div>
            <Paper elevation={2}>
              <Box p={4}>
                <Grid container spacing={2}>
                  <Grid container spacing={2} item lg={9}>
                    <Grid item xs={12} lg={4} md={4} sm={6}>
                      <CustomSelect
                        options={userOptions}
                        label={formatMessage({ id: "user" })}
                        name="id"
                        control={control}
                        error={errors.id}
                        rules={validationRule.textbox({ required: true })}
                        disabled={true}
                      />
                    </Grid>
                    <Grid item xs={12} lg={4} md={4} sm={6}>
                      <CustomTextBox
                        label={formatMessage({ id: "designation" })}
                        name="userDesignationName"
                        control={control}
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} lg={4} md={4} sm={6}>
                      <CustomTextBox
                        label={formatMessage({ id: "sms-receiving-number" })}
                        name="smsReceivingNumber"
                        control={control}
                        error={errors.smsReceivingNumber}
                        rules={validationRule.textbox({ required: true, type: "number" })}
                      />
                    </Grid>
                    <Grid item xs={12} lg={4} md={4} sm={6}>
                      <CustomSelect
                        options={qualificationOptions}
                        label={formatMessage({ id: "qualification" })}
                        name="medicalStaffQualificationIds"
                        control={control}
                        error={errors?.medicalStaffQualificationIds}
                        rules={validationRule.textbox({ required: true })}
                        multiple
                      />
                    </Grid>
                    <Grid item xs={12} lg={4} md={4} sm={6}>
                      <CustomSelect
                        options={specialityOptions}
                        label={formatMessage({ id: "speciality" })}
                        name="medicalStaffSpecialityIds"
                        control={control}
                        error={errors?.medicalStaffSpecialityIds}
                        rules={validationRule.textbox({ required: true })}
                        multiple
                      />
                    </Grid>
                    <Grid item xs={12} lg={4} md={4} sm={6}>
                      <CustomSelect
                        options={userOptions}
                        label={formatMessage({ id: "associate" })}
                        name="doctorAssociateIds"
                        control={control}
                        error={errors?.doctorAssociateIds}
                        rules={validationRule.textbox({ required: true })}
                        multiple
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={3} item lg={3}>
                    <Grid item xs={12} lg={12} md={12} sm={6}>
                      <SignatureImagePicker
                        register={register}
                        watch={watch}
                        errors={errors}
                        setValue={setValue}
                        clearErrors={clearErrors}
                        imageUrl={selectedData.signatureDataBase64String}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </div>
        {loading && <HoverLoader />}
      </>
    </Modal>
  )
}

export default UpdateClinicalUserCredentialsMapping;

const CustomFooter = ({ handleSubmit, onSubmit, closeModal }: any) => {
  return (
    <div>
      <SecondaryButton
        label="Cancel"
        style={{ marginRight: "15px" }}
        onClick={closeModal}
      />
      <SaveButton
        onClick={handleSubmit(onSubmit)}
        label="Update"
      />
    </div>
  )
}