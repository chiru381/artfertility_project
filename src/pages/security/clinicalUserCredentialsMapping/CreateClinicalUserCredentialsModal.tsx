
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Modal from '@material-ui/core/Modal';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';

import { CustomSelect, CustomTextBox, SignatureImagePicker, TextBox } from 'components/forms';
import { HoverLoader } from 'components';
import { getMasterPaginationData } from 'redux/actions';
import { SaveButton, SecondaryButton } from 'components/button';
import { services } from 'utils/services';
import { masterPaginationServices, userPopupColumns } from 'utils/constants';
import { getFormBody, validationRule, createCustomCompositeFilter } from 'utils/global';
import { RootReducerState } from 'utils/types';

import { useToastMessage } from 'utils/hooks';
import { FormPrimaryHeading } from 'components/forms';

import { PopupSearchTable } from 'components';
import { useAsyncDebounce } from 'utils/hooks';

interface Props {
  closeModal: () => void;
  onApiCall: () => void
}
const CreateClinicalUserCredentialsMapping = (props: Props) => {
  const { closeModal, onApiCall } = props;
  const { handleSubmit, formState: { errors }, control, watch, register, setValue, clearErrors } = useForm({ mode: 'all' });
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const [loading, setLoading] = useState(false);

  const [userPopupOpen, setUserPopupOpen] = useState(false);
  const [userText, setUserText] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(0);

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

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.user, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.department, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.qualification, {}));
  }, []);

  const onChangeValue = useAsyncDebounce((value: string) => {
    let members = ["displayName", "userName"];
    let params = createCustomCompositeFilter(members, value);

    dispatch(getMasterPaginationData(masterPaginationServices.user, params));
    if (!value) {
      resetExistingRecord();
    }
  }, 500);

  function onFocus() {
    setTimeout(() => {
      setUserPopupOpen(true);
    }, 300);
  }

  function resetExistingRecord() {
    setUserText("");
    setSelectedUserId(0);
  }

  function onRowClick(row: any) {
    if (row.id) {
      setUserPopupOpen(false);
      setUserText(row.displayName);
      setSelectedUserId(row.id);
    }
  }

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    let formData = new FormData();
    formData.append("id", `${selectedUserId}`);
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
    services.createMedicalStaff(formData)
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
                    {/* <Grid item xs={12} lg={4} md={4} sm={6}>
                      <CustomSelect
                        options={userOptions}
                        label={formatMessage({ id: "user" })}
                        name="id"
                        control={control}
                        error={errors.id}
                        rules={validationRule.textbox({ required: true })}
                      />
                    </Grid> */}
                    <Grid item xs={12} lg={4} md={4} sm={6}>
                      <TextBox
                        placeholder={formatMessage({ id: "search" })}
                        value={userText}
                        name="userName"
                        required={true}
                        error={errors.userName}
                        autoComplete="off"
                        onChange={e => {
                          setUserText(e.target.value);
                          onChangeValue(e.target.value);
                        }}
                        onFocus={onFocus}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {userText ? (
                                <IconButton
                                  onClick={() => {
                                    setUserText("");
                                    setSelectedUserId(0);
                                    resetExistingRecord();
                                  }}
                                  size="small"
                                >
                                  <CancelIcon color="primary" />
                                </IconButton>
                              ) : (
                                <SearchIcon />
                              )}
                            </InputAdornment>
                          )
                        }}
                      />

                      <PopupSearchTable
                        popupOpen={userPopupOpen && userData?.modelItems?.length}
                        closePopup={() => setUserPopupOpen(false)}
                        tableData={userData.modelItems}
                        columns={[...userPopupColumns(formatMessage)]}
                        onRowClick={onRowClick}
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
                        error={errors.medicalStaffQualificationIds}
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
                        error={errors.medicalStaffSpecialityIds}
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
                        error={errors.doctorAssociateIds}
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

export default CreateClinicalUserCredentialsMapping;

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
      />
    </div>
  )
}