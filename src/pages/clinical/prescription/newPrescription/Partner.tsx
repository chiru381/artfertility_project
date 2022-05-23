
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Header from "pages/clinical/Header";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { RootReducerState } from 'utils/types';
import { CustomSelect, CustomTextBox, CustomDatePicker, CustomCheckBox, } from "components/forms";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { useCreateLookupOptions, useToastMessage } from "utils/hooks";
import { getPrescriptionLookUp } from 'redux/actions';
import { getMasterPaginationData } from "redux/actions";
import { masterPaginationServices, durationUnitOptions } from "utils/constants";

interface Props {

}

function PartnerPrescription() {
  const location = useLocation<any>();
  const history = useHistory();
  const { handleSubmit, formState: { errors }, control, reset, watch } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const { toastMessage } = useToastMessage();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditOn, setIsEditOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | false>("patientDetails");

  let prescriptionData = location.state ?? {};

  const { medicalStaffData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => {
      return ({
        medicalStaffData: masterPaginationReducer[masterPaginationServices.medicalStaff].data

      })
    },
    shallowEqual
  );


  let medicalStaffOptions = medicalStaffData.modelItems?.map((option: any) => ({ label: option.userDisplayName, value: option.id }));


  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.medicalStaff, {}));
  }, []);

  useEffect(() => {
    if (prescriptionData?.id && medicalStaffOptions.length) {
      onEdit();
    }
  }, [prescriptionData?.id && medicalStaffOptions.length]);


  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    bodyData = {
      ...bodyData,
      id: prescriptionData?.id ?? 1,
    };

    setLoading(true);

    let prescriptionService = services[(prescriptionData?.id ? 'updatePrescription' : 'createPrescription') as keyof typeof services];

    prescriptionService(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          toastMessage(formatMessage({ id: isEditOn ? "update-message" : "create-message" }));
        } else {
          toastMessage(res.data?.message, "error");
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, "error");
      });
  }

  function onEdit() {
    let paramsData = {
      Id: prescriptionData?.id ?? 1
    };
    setLoading(true);
    services.getPrescriptionById(paramsData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          // reset(res.data.response);
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function resetForm() {
    reset({});
  }

  const handleAccordianToggle = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "new-prescription-partner" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        // disabled: !vitalData?.id,
      }}
      goBack={() => history.goBack()}
      backButtonProps={{ label: formatMessage({ id: "summary" }) }}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <Box>
              <h3 className="patientName">
                <FormattedMessage id="partner" />
              </h3>
            </Box>
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomDatePicker
              label={formatMessage({ id: "start-date" })}
              name="prescriptionDate"
              control={control}
              error={errors.prescriptionDate}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "start-age" })}
              name="patientAge"
              control={control}
              error={errors.patientAge}
            // rules={validationRule.textbox({ type: "number" })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={medicalStaffOptions}
              label={formatMessage({ id: "professional" })}
              name="professionalId"
              control={control}
              error={errors.professionalId}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "clinic" })}
              name="workingCenter"
              control={control}
              error={errors.workingCenter}
            // rules={validationRule.textbox({ type: "number" })}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "primary-diagonsis" })}
              name="primaryDiagnosiscode"
              control={control}
              error={errors.primaryDiagnosiscode}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "secondary-diagonsis" })}
              name="secondaryDiagnosiscode"
              control={control}
              error={errors.secondaryDiagnosiscode}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "weight(kg)" })}
              name="vitalWeight"
              control={control}
              error={errors.vitalWeight}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "bmi" })}
              name="vitalBMI"
              control={control}
              error={errors.vitalBMI}
            // rules={validationRule.textbox({ type: "number" })}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "allergies" })}
              name="allergies"
              control={control}
              error={errors.allergies}
            // rules={validationRule.textbox({ type: "number" })}
            />
          </Grid>
          <Grid item xs={12} lg={10} md={8} sm={8}>
            <Box>
              <h3 className="patientName">
                <FormattedMessage id="add-medication" />
              </h3>
            </Box>
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={4}>
            <CustomSelect
              options={[]}
              label={formatMessage({ id: "select-category" })}
              name="parentalConsanguinityFemale"
              control={control}
            />
          </Grid>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "2%" }}>
                    <FormattedMessage id="s-no" />
                  </TableCell>
                  <TableCell style={{ width: "5%" }}>
                    <FormattedMessage id="brand-name" />
                  </TableCell>
                  <TableCell style={{ width: "5%" }}>
                    <FormattedMessage id="generic-name" />
                  </TableCell>
                  <TableCell style={{ width: "3%" }}>
                    <FormattedMessage id="route" />
                  </TableCell>
                  <TableCell style={{ width: "5%" }}>
                    <FormattedMessage id="strength" />
                  </TableCell>
                  <TableCell style={{ width: "5%" }}>
                    <FormattedMessage id="dosage" />
                  </TableCell>
                  <TableCell style={{ width: "5%" }}>
                    <FormattedMessage id="frequency" />
                  </TableCell>
                  <TableCell style={{ width: "8%" }} colSpan={2} align="center">
                    <FormattedMessage id="duration" />
                  </TableCell>
                  <TableCell style={{ width: "5%" }}>
                    <FormattedMessage id="instructions" />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    1
                  </TableCell>
                  <TableCell style={{ padding: "4px" }}>
                    <CustomSelect
                      options={[]}
                      label=""
                      name="medicationId"
                      control={control}
                      error={errors.medicationId}
                    />
                  </TableCell>
                  <TableCell style={{ padding: "4px" }}>
                    <CustomSelect
                      options={[]}
                      label=""
                      name="genericName"
                      control={control}
                    />
                  </TableCell>
                  <TableCell style={{ padding: "4px" }}>
                    <CustomSelect
                      options={[]}
                      label=""
                      name="prescriptionRouteId"
                      control={control}
                      error={errors.prescriptionRouteId}
                    />
                  </TableCell>
                  <TableCell style={{ padding: "4px" }}>
                    <CustomSelect
                      options={[]}
                      label=""
                      name="strengthUnitId"
                      control={control}
                      error={errors.strengthUnitId}
                    />
                  </TableCell>
                  <TableCell style={{ padding: "4px" }}>
                    <CustomTextBox
                      label=""
                      name="dosage"
                      control={control}
                      error={errors.dosage}
                    // rules={validationRule.textbox({ type: "number" })}
                    />
                  </TableCell>
                  <TableCell style={{ padding: "4px" }}>
                    <CustomSelect
                      options={[]}
                      label=""
                      name="prescriptionFrequencyId"
                      control={control}
                      error={errors.prescriptionFrequencyId}
                    />
                  </TableCell>
                  <TableCell style={{ padding: "4px" }}>
                    <CustomTextBox
                      label=""
                      name="duration"
                      control={control}
                      error={errors.duration}
                    />
                  </TableCell>
                  <TableCell style={{ padding: "4px" }}>
                    <CustomSelect
                      options={durationUnitOptions}
                      label=""
                      name="durationUnit"
                      control={control}
                      error={errors.durationUnit}
                    />
                  </TableCell>
                  <TableCell style={{ padding: "4px" }}>
                    <CustomTextBox
                      label=""
                      name="instruction"
                      control={control}
                      error={errors.instruction}
                    // rules={validationRule.textbox({ type: "number" })}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Box>
    </CustomClinicalActionHeaderWithWrap>
  )
}
export default PartnerPrescription;