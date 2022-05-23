
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Radio from '@material-ui/core/Radio';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@material-ui/core/Link';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';

import { CustomSelect, CustomTextBox, CustomCheckBox, CheckBox, Select, DatePicker, TextBox } from 'components/forms';
import { FormModal, HoverLoader } from 'components';
import { masterPaginationServices } from 'utils/constants';
import { getMasterPaginationData } from 'redux/actions';
import { services } from 'utils/services';
import { getUserLookup } from 'redux/actions';
import { getFormBody, validationRule } from 'utils/global';
import { RootReducerState } from 'utils/types';
import { useCreateLookupOptions, useToastMessage } from 'utils/hooks';

const CreateUser = () => {
  const dispatch = useDispatch();
  const { handleSubmit, formState: { errors }, control, watch, setValue } = useForm({ mode: 'all' });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [userClinics, setUserClinics] = useState<any[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const { userLookupData, stationData } = useSelector(
    ({ userLookupReducer, masterPaginationReducer }: RootReducerState) => ({
      userLookupData: userLookupReducer.data,
      stationData: masterPaginationReducer[masterPaginationServices.station].data,
    }),
    shallowEqual
  );

  // Lookup options for dropdown
  let selectOptions = useCreateLookupOptions(userLookupData);

  useEffect(() => {
    if (!Object.keys(userLookupData).length) {
      dispatch(getUserLookup());
    }
    dispatch(getMasterPaginationData(masterPaginationServices.station, {}));
    setValue("isEnabled", true);
    setValue("hasPasswordExpiry", true);
  }, []);

  useEffect(() => {
    if (selectOptions?.clinics?.length) {
      setUserClinics(selectOptions?.clinics?.map((option: any) => ({
        userId: 0,
        clinicId: option.value,
        clinicName: option.label,
        isSelected: false,
        isDefault: false,
        roleIds: [],
        stationIds: [],
        medicalLicenseNumber: null,
        licenseValidFrom: null,
        licenseValidTo: null
      })));
    }
  }, [selectOptions?.clinics?.length]);

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    let selectedUserClinics = userClinics?.filter((item: any) => item.isSelected === true && item.roleIds?.length);
    let selectedDefaultUserClinics = userClinics?.filter((item: any) => item.isSelected === true && item.isDefault);

    if (!selectedUserClinics?.length) {
      toastMessage(formatMessage({ id: "user-clinic-role-validation-message" }), 'error');
      return false;
    }

    if (!selectedDefaultUserClinics?.length) {
      toastMessage(formatMessage({ id: "default-clinic-validation-message" }), 'error');
      return false;
    }

    bodyData = {
      ...bodyData,
      userClinics: selectedUserClinics
    }

    setLoading(true);
    services.createUser(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
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

  const handleSelectAllClinicChange = (status: any) => {
    const newList = userClinics?.map((item: any) => ({
      ...item,
      isSelected: status,
      isDefault: status ? item.isDefault : false
    }));
    setUserClinics(newList);
  }

  const handleSelectClinicChange = (id: any) => {
    const newList = userClinics?.map((item: any) => ({
      ...item,
      isSelected: item.clinicId == id ? !item.isSelected : item.isSelected,
    }));

    setUserClinics(newList);
    const AllSelected = newList?.filter((item: any) => item.isSelected === false);
    setSelectAll(AllSelected?.length ? false : true);
  }

  const handleRoleChange = (data: any, clinicId: any) => {
    let roleIds = data.map((item: any) => { return item.value });

    const newList = userClinics?.map((item: any) => ({
      ...item,
      roleIds: item.clinicId === clinicId ? roleIds : item.roleIds
    }));

    setUserClinics(newList);
  }

  const handleStationChange = (data: any, clinicId: any) => {
    let stationIds = data.map((item: any) => { return item.value });

    const newList = userClinics?.map((item: any) => ({
      ...item,
      stationIds: item.clinicId === clinicId ? stationIds : item.stationIds
    }));

    setUserClinics(newList);
  }

  const handleDefaultClinicChange = (clinicId: any) => {

    const newList = userClinics?.map((item: any) => ({
      ...item,
      isDefault: item.clinicId === clinicId ? true : false,
      isSelected: item.clinicId === clinicId ? true : item.isSelected
    }));

    setUserClinics(newList);
  };

  const closeModal = () => {
    history.goBack();
  }

  return (
    <>
      <FormModal
        onCancel={closeModal}
        onConfirm={handleSubmit(onSubmit)}
        title={formatMessage({ id: "create-user" })}
        modalSize='full-page'
        slideAnimation={false}
      >
        <Paper elevation={2}>
          <Box p={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "first-name" })}
                  name="firstName"
                  control={control}
                  error={errors.firstName}
                  rules={validationRule.textbox({ required: true, type: "textWithSpace" })}
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              </Grid>

              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "last-name" })}
                  name="lastName"
                  control={control}
                  error={errors.lastName}
                  rules={validationRule.textbox({ required: true, type: "textWithSpace" })}
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                  options={selectOptions?.genders ?? []}
                  label={formatMessage({ id: "gender" })}
                  name="genderId"
                  control={control}
                  rules={validationRule.textbox({ required:true })}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "mobile-number" })}
                  name="phoneNumber"
                  control={control}
                  error={errors.phoneNumber}
                  rules={validationRule.textbox({ type: "number" })}
                />
              </Grid>

              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "email" })}
                  name="email"
                  control={control}
                  error={errors.email}
                  rules={validationRule.textbox({ type: "email",required:true })}
                />
              </Grid>

              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "login-id" })}
                  name="userName"
                  control={control}
                  error={errors.userName}
                  rules={validationRule.textbox({ required: true, type: "text" })}
                />
              </Grid>

              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "password" })}
                  name="password"
                  control={control}
                  error={errors.password}
                  type="password"
                  rules={{
                    ...validationRule.textbox({ required: true, type: 'passwordPolicy' }),
                    validate: (value: any) => (watch('confirmPassword') ? (watch('confirmPassword') === value) : true) || formatMessage({ id: "password-confirm-validation-message" })
                  }}
                  autoComplete="off"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title={formatMessage({ id: "password-policy-message" })}>
                          <Link className="cursorPointer inpt_back">
                            <InfoIcon />
                          </Link>
                        </Tooltip>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "confirm-password" })}
                  name="confirmPassword"
                  control={control}
                  error={errors.confirmPassword}
                  type="password"
                  rules={{
                    ...validationRule.textbox({ required: true, type: 'passwordPolicy' }),
                    validate: (value: any) => (watch('password') ? (watch('password') === value) : true) || formatMessage({ id: "password-confirm-validation-message" })
                  }}
                  autoComplete="off"
                />
              </Grid>

              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomCheckBox
                  name="hasPasswordExpiry"
                  label={formatMessage({ id: "is-password-expiry" })}
                  control={control}
                  error={errors.hasPasswordExpiry}
                  required={true}
                />
              </Grid>

              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                  options={selectOptions?.departments ?? []}
                  label={formatMessage({ id: "department" })}
                  name="departmentId"
                  control={control}
                  error={errors.departmentId}
                  rules={validationRule.textbox({ required: true })}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                  options={selectOptions?.designations ?? []}
                  label={formatMessage({ id: "designation" })}
                  name="designationId"
                  control={control}
                  error={errors.designationId}
                  rules={validationRule.textbox({ required: true })}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                  options={selectOptions?.employeeTypes ?? []}
                  label={formatMessage({ id: "employee-type" })}
                  name="employeeTypeId"
                  control={control}
                  error={errors.employeeTypeId}
                  rules={validationRule.textbox({ required: true })}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                  options={selectOptions?.employeeCategories ?? []}
                  label={formatMessage({ id: "employee-category" })}
                  name="employeeCategoryId"
                  control={control}
                  error={errors.employeeCategoryId}
                  rules={validationRule.textbox({ required: true })}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomCheckBox
                  name="isEnabled"
                  label={formatMessage({ id: "is-active" })}
                  control={control}
                />
              </Grid>

              <Grid item xs={12}>
                <Box>
                  <h3 className="formHeading">
                    <FormattedMessage id="role-and-station-mapping" />
                  </h3>
                </Box>
              </Grid>
              <Grid item xs={12} lg={12} md={12} sm={12}>
                <TableContainer>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: "5%" }}>
                          <CheckBox
                            label={formatMessage({ id: "select-all" })}
                            onChange={(e: any) => {
                              let status = e.target.checked;
                              setSelectAll(status);
                              handleSelectAllClinicChange(status);
                            }}
                            checked={selectAll}
                          />
                        </TableCell>
                        <TableCell style={{ width: "5%" }}><FormattedMessage id="default-clinic" /></TableCell>
                        <TableCell style={{ width: "15%" }}><FormattedMessage id="clinic-name" /></TableCell>
                        <TableCell style={{ width: "15%" }}><FormattedMessage id="role-name" /></TableCell>
                        <TableCell style={{ width: "15%" }}><FormattedMessage id="station-name" /></TableCell>
                        <TableCell style={{ width: "15%" }}><FormattedMessage id="medical-license-number" /></TableCell>
                        <TableCell style={{ width: "15%" }}><FormattedMessage id="valid-from" /></TableCell>
                        <TableCell style={{ width: "15%" }}><FormattedMessage id="valid-to" /></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {userClinics?.map((clinic: any, index: any) => {
                        return (
                          <TableRow hover key={index} role="checkbox" tabIndex={-1} >
                            <TableCell>
                              <CheckBox
                                label=""
                                onChange={(e: any) => {
                                  handleSelectClinicChange(clinic.clinicId)
                                }}
                                name="isSelected"
                                checked={clinic.isSelected}
                              />
                            </TableCell>
                            <TableCell>
                              <Radio
                                checked={clinic.isDefault}
                                onChange={(e: any) => {
                                  handleDefaultClinicChange(clinic.clinicId)
                                }}
                                name="isDefault"
                                inputProps={{ 'aria-label': 'A' }}
                                color="primary"
                                size="small"
                                required={true}
                              />
                            </TableCell>
                            <TableCell> {clinic.clinicName} </TableCell>
                            <TableCell>
                              <Select
                                label={formatMessage({ id: "role" })}
                                options={selectOptions?.roles ?? []}
                                onChange={(_, data: any) => {
                                  handleRoleChange(data, clinic.clinicId);
                                }}
                                multiple
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                label={formatMessage({ id: "station" })}
                                options={
                                  stationData.modelItems?.filter((item: any) => item.clinicId == clinic.clinicId)?.map((option: any) => ({ label: option.name, value: option.id }))
                                  ?? []
                                }
                                onChange={(_, data: any) => {
                                  handleStationChange(data, clinic.clinicId);
                                }}
                                multiple
                              />
                            </TableCell>
                            <TableCell>
                              <TextBox
                                label={formatMessage({ id: "medical-license-number" })}
                                name="medicalLicenseNumber"
                                value={clinic.medicalLicenseNumber}
                                onChange={(e: any) => {
                                  let newList = userClinics?.map((item: any, idx: any) => ({
                                    ...item,
                                    medicalLicenseNumber: index === idx ? e.target?.value : item.medicalLicenseNumber
                                  }))
                                  setUserClinics(newList)
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <DatePicker
                                label={formatMessage({ id: "valid-from" })}
                                onChange={(val: any, data: any) => {
                                  let newList = userClinics?.map((item: any, idx: any) => ({
                                    ...item,
                                    licenseValidFrom: index === idx ? val : item.licenseValidFrom
                                  }))
                                  setUserClinics(newList)
                                }}
                                name="licenseValidFrom"
                                value={clinic.licenseValidFrom}
                                maxDate={new Date()}
                              />
                            </TableCell>
                            <TableCell>
                              <DatePicker
                                label={formatMessage({ id: "valid-to" })}
                                onChange={(val: any, data: any) => {
                                  let newList = userClinics?.map((item: any, idx: any) => ({
                                    ...item,
                                    licenseValidTo: index === idx ? val : item.licenseValidTo
                                  }))
                                  setUserClinics(newList)
                                }}
                                name="licenseValidTo"
                                value={clinic.licenseValidTo}
                                minDate={clinic.licenseValidFrom}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </FormModal>
      {loading && <HoverLoader />}
    </>
  )
}

export default CreateUser;