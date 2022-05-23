import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Box from "@material-ui/core/Box";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Paper from '@material-ui/core/Paper';

import { CustomSelect, CustomTextBox, CustomDatePicker } from "components/forms";
import { HoverLoader } from "components";
import { tableInitialState, masterPaginationServices } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { surgeryMenuList } from "utils/constants/menu";
import { getTableParams } from 'utils/global';

interface Props { }

const PreOperativeAssessment = (props: Props) => {
  const [tableState, setTableState] = useState(tableInitialState);
  const dispatch = useDispatch();
  const { handleSubmit, formState: { errors }, control, watch, getValues, reset, } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const [loading, setLoading] = useState(false);
  const [isEditOn, setIsEditOn] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { fields, append, remove } = useFieldArray({ control, name: "clinicalHistoryContraceptions", });

  let patientId = useGetPatientId();

  const { medicalStaffData
  } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      medicalStaffData: masterPaginationReducer[masterPaginationServices.medicalStaff].data,
    }),
    shallowEqual
  );

  let medicalStaffOptions = medicalStaffData.modelItems?.map((option: any) => ({ label: option.userDisplayName, value: option.id }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.medicalStaff, {}));

    onAddContraceptiveMethod();
  }, []);

  function onAddContraceptiveMethod() {
    append({})
  }

  useEffect(() => {
    onApiCall();
  }, [tableState]);

  function onApiCall(withState: boolean = true) {
    const params = getTableParams(withState ? tableState : {});
    dispatch(getMasterPaginationData(masterPaginationServices.clinic, params));
  }

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    setLoading(true);

    let clinicalHistoryService = services[(isEditOn ? 'updateClinicalHistory' : 'createClinicalHistory') as keyof typeof services];

    clinicalHistoryService(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
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

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "pre-operative-assessment" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: "Save"
      }}
      menuList={surgeryMenuList}
    >
      <Box padding={2} component={Paper}>

        <Grid container spacing={2}>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "surgery-no" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomSelect
              options={medicalStaffOptions}
              label={formatMessage({ id: "professional" })}
              name="husbandParentsConsanguinityId"
              control={control}
              error={errors.husbandParentsConsanguinityId}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomDatePicker
              label={formatMessage({ id: "date" })}
              name="startDate"
              control={control}
              error={errors.startDate}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "patient-name" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={1} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "uhid" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={1} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "weight" })}
              name="weight"
              control={control}
              error={errors.weight}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={1} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "bmi" })}
              name="bmi"
              control={control}
              error={errors.bmi}
            />
          </Grid>
          <Grid item xs={12} lg={1} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "age" })}
              name="startAge"
              control={control}
              error={errors.startAge}
            />
          </Grid>

          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "bp(mmHg)" })}
              name="startAge"
              control={control}
              error={errors.startAge}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "bp(mmHg)" })}
              name="startAge"
              control={control}
              error={errors.startAge}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "hr(bpm)" })}
              name="startAge"
              control={control}
              error={errors.startAge}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "rr(cpm)" })}
              name="startAge"
              control={control}
              error={errors.startAge}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "spo2" })}
              name="startAge"
              control={control}
              error={errors.startAge}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "tempF" })}
              name="startAge"
              control={control}
              error={errors.startAge}
            />
          </Grid>

          < Grid item xs={12} lg={12} md={12} sm={12}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell><FormattedMessage id="s-no" /></TableCell>
                    <TableCell><FormattedMessage id="pre-operative-assessment" /></TableCell>
                    <TableCell><FormattedMessage id="options" /></TableCell>
                    <TableCell><FormattedMessage id="remarks" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "pre-assessment-score" })}
              name="startAge"
              control={control}
              error={errors.startAge}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "performed-by" })}
              name="startAge"
              control={control}
              error={errors.startAge}
            />
          </Grid>
        </Grid>
      </Box>
      {loading || deleteLoading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default PreOperativeAssessment;
