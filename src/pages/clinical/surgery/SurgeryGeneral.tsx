import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import FormLabel from "@material-ui/core/FormLabel";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import BorderColorOutlinedIcon from "@material-ui/icons/BorderColorOutlined";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Tooltip from '@material-ui/core/Tooltip';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

import { TableButtonGroup, DeleteButton } from 'components/button';
import { CustomSelect, CustomCheckBox, CustomTextBox, CustomDatePicker, RadioButton, CustomRadioButton } from "components/forms";
import { HoverLoader } from "components";
import { consanguinityOptions, cycleOptions, masterPaginationServices } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import Header from "pages/clinical/Header";
import { surgeryMenuList } from "utils/constants/menu";
import { PaperWithLabel } from "components";
import { getTableParams } from 'utils/global';
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';

import TabPanel from './TabPanel';
import GeneralDetails from "./GeneralDetails";
import OperativeNote from "./OperativeNote";
import DischargeSummery from "./DischargeSummery";
import DischargeInstruction from "./DischargeInstruction";
import AnesthesiaDetails from "./AnesthesiaDetails";
import SpecialForms from "./SpecialForms";

interface Props { }
const useStyles = makeStyles((theme: Theme) => ({
  root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
  },
}));

const SurgeryGeneral = (props: Props) => {
  const dispatch = useDispatch();
  const location = useLocation<any>();
  const { handleSubmit, formState: { errors }, control, watch, getValues, reset, } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const [loading, setLoading] = useState(false);
  const [isEditOn, setIsEditOn] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [richTextModalOpen, setRichTextModalOpen] = useState(false);
  const { fields, append, remove } = useFieldArray({ control, name: "clinicalHistoryContraceptions", });
  const [headerLabel, setHeaderLabel] = useState("");
  const [relevantNotes, setRelevantNote] = useState(null);
  const [treatmentPlan, setTreatmentPlan] = useState(null);
  const [isContraceptions, setIsContraceptions] = useState(false);
  const [isOnsiteVisit, setIsOnsiteVisit] = useState(true);
  const [value, setValue] = useState(0);
  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

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

  function a11yProps(index: any) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
  }
  
  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "surgery-general" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: "Save"
      }}
      menuList={surgeryMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3} md={4} sm={12}>
            <CustomTextBox
              label={formatMessage({ id: "surgery-no" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={12}>
            <CustomDatePicker
              label={formatMessage({ id: "date" })}
              name="startDate"
              control={control}
              error={errors.startDate}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={12}>
            <CustomTextBox
              label={formatMessage({ id: "patient-name" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={12}>
            <CustomTextBox
              label={formatMessage({ id: "uhid" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={12}>
            <CustomSelect
              options={consanguinityOptions}
              label={formatMessage({ id: "surgery-name" })}
              name="husbandParentsConsanguinityId"
              control={control}
              error={errors.husbandParentsConsanguinityId}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={12}>
            <CustomSelect
              options={consanguinityOptions}
              label={formatMessage({ id: "operating-room" })}
              name="husbandParentsConsanguinityId"
              control={control}
              error={errors.husbandParentsConsanguinityId}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={12}>
            <CustomDatePicker
              label={formatMessage({ id: "surgery-start-date-time" })}
              name="startDate"
              control={control}
              error={errors.startDate}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={12}>
            <CustomDatePicker
              label={formatMessage({ id: "anesthesia-start-date-time" })}
              name="startDate"
              control={control}
              error={errors.startDate}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={12}>
            <CustomSelect
              options={consanguinityOptions}
              label={formatMessage({ id: "surgery-type" })}
              name="husbandParentsConsanguinityId"
              control={control}
              error={errors.husbandParentsConsanguinityId}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={12}>
            <CustomSelect
              options={consanguinityOptions}
              label={formatMessage({ id: "destination" })}
              name="husbandParentsConsanguinityId"
              control={control}
              error={errors.husbandParentsConsanguinityId}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={12}>
            <CustomDatePicker
              label={formatMessage({ id: "surgery-end-date-time" })}
              name="startDate"
              control={control}
              error={errors.startDate}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={12}>
            <CustomDatePicker
              label={formatMessage({ id: "anesthesia-end-date-time" })}
              name="startDate"
              control={control}
              error={errors.startDate}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={12}>
            <CustomSelect
              options={consanguinityOptions}
              label={formatMessage({ id: "surgeon" })}
              name="husbandParentsConsanguinityId"
              control={control}
              error={errors.husbandParentsConsanguinityId}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={12}>
            <CustomSelect
              options={consanguinityOptions}
              label={formatMessage({ id: "anesthetist" })}
              name="husbandParentsConsanguinityId"
              control={control}
              error={errors.husbandParentsConsanguinityId}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={12}>
            <CustomTextBox
              label={formatMessage({ id: "surgery-duration" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={12}>
            <CustomTextBox
              label={formatMessage({ id: "anesthesia-duration" })}
              name="companyName"
              control={control}
              error={errors.companyName}
              rules={validationRule.textbox({ type: "textWithSpace" })}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={12}>
            <CustomSelect
              options={consanguinityOptions}
              label={formatMessage({ id: "embryologist" })}
              name="husbandParentsConsanguinityId"
              control={control}
              error={errors.husbandParentsConsanguinityId}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={12}>
            <CustomSelect
              options={consanguinityOptions}
              label={formatMessage({ id: "referral-doctor" })}
              name="husbandParentsConsanguinityId"
              control={control}
              error={errors.husbandParentsConsanguinityId}
            />
          </Grid>


          <Grid item xs={12}>
            <div className={classes.root}>
              <AppBar position="static" color="default">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  aria-label="scrollable auto tabs example"
                >
                  <Tab label={formatMessage({ id: "general-details" })} {...a11yProps(0)} />
                  <Tab label={formatMessage({ id: "operative-note" })} {...a11yProps(1)} />
                  <Tab label={formatMessage({ id: "discharge-summery" })} {...a11yProps(2)} />
                  <Tab label={formatMessage({ id: "discharge-instruction" })} {...a11yProps(3)} />
                  <Tab label={formatMessage({ id: "anesthesia-details" })} {...a11yProps(4)} />
                  <Tab label={formatMessage({ id: "special-forms" })} {...a11yProps(5)} />
                  <Tab label={formatMessage({ id: "special-instructions" })} {...a11yProps(6)} />
                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0}>
                <GeneralDetails />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <OperativeNote />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <DischargeSummery />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <DischargeInstruction />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <AnesthesiaDetails />
              </TabPanel>
              <TabPanel value={value} index={5}>
                <SpecialForms />
              </TabPanel>
              <TabPanel value={value} index={6}>
                Item Seven
              </TabPanel>
            </div>
          </Grid>

        </Grid>
      </Box>
      {loading || deleteLoading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default SurgeryGeneral;
