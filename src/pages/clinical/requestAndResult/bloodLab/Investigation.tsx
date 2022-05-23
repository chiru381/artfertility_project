import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControl from '@material-ui/core/FormControl';

import { CustomTextBox, CustomDatePicker, RadioButton } from "components/forms";
import { HoverLoader } from "components";
import { consanguinityOptions, cycleOptions, masterPaginationServices } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { requestResultMenuList } from 'utils/constants/menu';

interface Props { }

const Investigation = (props: Props) => {
  const dispatch = useDispatch();
  const location = useLocation<any>();
  const { handleSubmit, formState: { errors }, control, watch, getValues, reset, } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const [loading, setLoading] = useState(false);
  const [isEditOn, setIsEditOn] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { fields, append, remove } = useFieldArray({ control, name: "clinicalHistoryContraceptions", });
  const [isOnsiteVisit, setIsOnsiteVisit] = useState(true);
  const [value, setValue] = useState(0);
  const [expanded, setExpanded] = useState<string | false>("general");

  let patientData = location.state ?? {};

  const { medicalStaffData, consultationReasonData, dysmenorrheaData, contraceptiveMethodData, dressCodeData, skinColorData, translatorData,
  } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      medicalStaffData: masterPaginationReducer[masterPaginationServices.medicalStaff].data,
      consultationReasonData: masterPaginationReducer[masterPaginationServices.consultationReason].data,
      dysmenorrheaData: masterPaginationReducer[masterPaginationServices.dysmenorrhea].data,
      contraceptiveMethodData: masterPaginationReducer[masterPaginationServices.contraceptiveMethod].data,
      dressCodeData: masterPaginationReducer[masterPaginationServices.dressCode].data,
      skinColorData: masterPaginationReducer[masterPaginationServices.skinColor].data,
      translatorData: masterPaginationReducer[masterPaginationServices.translator].data,
    }),
    shallowEqual
  );

  let medicalStaffOptions = medicalStaffData.modelItems?.map((option: any) => ({ label: option.userDisplayName, value: option.id }));
  let consultationReasonOptions = consultationReasonData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let dysmenorrheaOptions = dysmenorrheaData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let contraceptiveMethodOptions = contraceptiveMethodData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let dressCodeOptions = dressCodeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let skinColorOptions = skinColorData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let translatorOptions = translatorData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.medicalStaff, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.consultationReason, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.dysmenorrhea, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.contraceptiveMethod, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.dressCode, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.skinColor, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.translator, {}));

    onAddContraceptiveMethod();
  }, []);


  const { modelItems } = medicalStaffData;

  const handleAccordianToggle = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  function onAddContraceptiveMethod() {
    append({
      id: 0,
      duration: 0,
      isLatest: false,
      clinicalHistoryId: 0,
      contraceptiveMethodId: 0,
      contraceptiveMethodName: "",
    })
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

  function onDelete() {
    const parms = {
      clinicalHistoryId: patientData?.id ?? 1,
    }
    setDeleteLoading(true);
    services.deleteClinicalHistory(parms)
      .then((res) => {
        setDeleteLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(false);
          resetForm();
          toastMessage(formatMessage({ id: "delete-message" }));
        } else {
          toastMessage(res.data?.message, 'error');
        }
      })
      .catch((err) => {
        setDeleteLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function onEdit() {
    let paramsData = {
      clinicalHistoryId: patientData?.id ?? 1
    };
    setLoading(true);
    services.getClinicalHistoryById(paramsData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          setIsEditOn(true);
          setFormData(res.data.response);
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

  function setFormData(resData: any) {
    let newList = resData.clinicalHistoryContraceptions.map((item: any) => ({
      ...item,
      contraceptiveMethodId: { label: item.contraceptiveMethodName, value: item.contraceptiveMethodId }
    }));

    let data = {
      ...resData,
      responsibleId: medicalStaffOptions?.find((item: any) => item.value == resData?.responsibleId) ?? null,
      consultationReasonId: consultationReasonOptions?.find((item: any) => item.value == resData?.consultationReasonId) ?? null,
      dysmenorrheaId: dysmenorrheaOptions?.find((item: any) => item.value == resData?.dysmenorrheaId) ?? null,
      consistenceLeft: contraceptiveMethodOptions?.find((item: any) => item.value == resData?.consistenceLeft) ?? null,
      dressCodeId: dressCodeOptions?.find((item: any) => item.value == resData?.dressCodeId) ?? null,
      skinColorId: skinColorOptions?.find((item: any) => item.value == resData?.skinColorId) ?? null,
      translatorId: translatorOptions?.find((item: any) => item.value == resData?.translatorId) ?? null,
      wifeParentsConsanguinityId: consanguinityOptions?.find((item: any) => item.value == resData?.wifeParentsConsanguinityId) ?? null,
      husbandParentsConsanguinityId: consanguinityOptions?.find((item: any) => item.value == resData?.husbandParentsConsanguinityId) ?? null,
      coupleConsanguinityId: consanguinityOptions?.find((item: any) => item.value == resData?.coupleConsanguinityId) ?? null,
      cycleType: cycleOptions?.find((item: any) => item.value == resData?.cycleType) ?? null,
      clinicalHistoryContraceptions: newList
    }

    reset(data);
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "blood-lab-investigation" })}
      onSave={handleSubmit(onSubmit)}
      menuList={requestResultMenuList}
    >
      <Box padding={3} component={Paper}>
        <Accordion
          key="uterus"
          style={{ marginBottom: '10px' }}
          expanded={expanded === "uterus"}
          onChange={handleAccordianToggle("uterus")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-parent-header"
            style={{ backgroundColor: "#F3F3F3", }}>

            <Grid container spacing={2}>
              <Grid item xs={12} lg={2} md={4} sm={6}>
                <CustomDatePicker
                  label={formatMessage({ id: "request-date-and-time" })}
                  name="capturingDate"
                  control={control}
                  error={errors.capturingDate}
                  disabled
                />
              </Grid>
              <Grid item xs={12} lg={2} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "request-id" })}
                  name="companyName"
                  control={control}
                  error={errors.companyName}
                  disabled
                />
              </Grid>
              <Grid item xs={12} lg={2} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "patient-name" })}
                  name="companyName"
                  control={control}
                  error={errors.companyName}
                  disabled
                />
              </Grid>
              <Grid item xs={12} lg={2} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "uhid" })}
                  name="companyName"
                  control={control}
                  error={errors.companyName}
                  disabled
                />
              </Grid>
              <Grid item xs={12} lg={2} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "profile-name" })}
                  name="companyName"
                  control={control}
                  error={errors.companyName}
                  disabled
                />
              </Grid>
              <Grid item xs={12} lg={2} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "test-status" })}
                  name="companyName"
                  control={control}
                  error={errors.companyName}
                  disabled
                />
              </Grid>
            </Grid>
          </AccordionSummary>

          <AccordionDetails>

            <Grid container spacing={3}>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "test-result-date-and-time" })}
                  name="companyName"
                  control={control}
                  error={errors.companyName}
                  rules={validationRule.textbox({ type: "textWithSpace" })}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "validated-by" })}
                  name="companyName"
                  control={control}
                  error={errors.companyName}
                  rules={validationRule.textbox({ type: "textWithSpace" })}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "validation-date-and-time" })}
                  name="companyName"
                  control={control}
                  error={errors.companyName}
                  rules={validationRule.textbox({ type: "textWithSpace" })}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "test-done" })}
                  name="companyName"
                  control={control}
                  error={errors.companyName}
                  rules={validationRule.textbox({ type: "textWithSpace" })}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "observations-from-lab" })}
                  name="companyName"
                  control={control}
                  error={errors.companyName}
                  rules={validationRule.textbox({ type: "textWithSpace" })}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomTextBox
                  label={formatMessage({ id: "observations-for-report" })}
                  name="companyName"
                  control={control}
                  error={errors.companyName}
                  rules={validationRule.textbox({ type: "textWithSpace" })}
                />
              </Grid>
              <Grid xs={12}></Grid>

              <Grid item xs={12} lg={2} md={4} sm={6}>
                <FormControl fullWidth>
                  <span className="text-14 font-medium">{formatMessage({ id: "view-results" })}</span>
                </FormControl>
                <RadioButton
                  label="All"
                  name="isOnsiteVisit"
                  onChange={() => {
                    setIsOnsiteVisit(true);
                  }}
                  checked={isOnsiteVisit}
                />
              </Grid>
              <Grid item xs={12} lg={2} md={4} sm={6}>
                <FormControl fullWidth>
                </FormControl>
                <RadioButton
                  label="Hematology"
                  name="isOnsiteVisit"
                  onChange={() => {
                    setIsOnsiteVisit(false);
                  }}
                  checked={!isOnsiteVisit}
                />
              </Grid>
              <Grid item xs={12} lg={2} md={4} sm={6}>
                <FormControl fullWidth>
                </FormControl>
                <RadioButton
                  label="Biochemistry"
                  name="isOnsiteVisit"
                  onChange={() => {
                    setIsOnsiteVisit(false);
                  }}
                  checked={!isOnsiteVisit}
                />
              </Grid>

              <Grid item xs={12}>
                <TableContainer>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell><FormattedMessage id="parameter" /></TableCell>
                        <TableCell><FormattedMessage id="result-value" /></TableCell>
                        <TableCell><FormattedMessage id="unit" /></TableCell>
                        <TableCell><FormattedMessage id="reference-range" /></TableCell>
                        <TableCell><FormattedMessage id="observation" /></TableCell>
                        <TableCell><FormattedMessage id="clinic" /></TableCell>
                        <TableCell><FormattedMessage id="laboratory" /></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
      {loading || deleteLoading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap >
  );
};

export default Investigation;
