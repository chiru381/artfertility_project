import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Typography } from "@material-ui/core";

import { CustomSelect, CustomTextBox, RadioButton, CustomDatePicker, CustomCheckBox, } from "components/forms";
import { services } from "utils/services";
import { masterPaginationServices, painRatingScaleOptions, durationUnitOptions } from "utils/constants";
import { getFormBody, validationRule } from "utils/global";
import { useCreateLookupOptions, useToastMessage, useGetPatientId } from "utils/hooks";
import { getMasterPaginationData } from "redux/actions";

import { RootReducerState } from 'utils/types';
import { getVitalLookUp } from 'redux/actions';
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { images } from "utils/constants";
interface Props {

}
const PatientNewVitals = (props: Props) => {
  const location = useLocation<any>();
  const dispatch = useDispatch();
  const history = useHistory();
  const { handleSubmit, formState: { errors }, control, reset, watch } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const [loading, setLoading] = useState(false);

  const [isLatexAllergy, setIsLatexAllergy] = useState(true);
  const [isCOVIDVaccination, setIsCOVIDVaccination] = useState(true);
  const [isBoosterDose, setIsBoosterDose] = useState(true);
  const [isCoviD19Symptoms, setIscovid19Symptoms] = useState(true);
  const [isContactwithCovid19Patient, setIsContactwithCovid19Patient] = useState(true);
  const [isAllergiesHistory, setIsAllergiesHistory] = useState(true);
  const [isMedicationAllergy, setIsMedicationAllergy] = useState(true);
  const [isPeanutAllergy, setIsPeanutAllergy] = useState(true);
  const [isOtherAllergies, setIsOtherAllergies] = useState(true);
  const [expanded, setExpanded] = useState<string | false>("partnerDetails");

  let vitalData = location.state ?? {};
  let patientId = useGetPatientId();

  const { painLocationData, painFrequencyData, painDescriptionData, countryData, covidVaccinationData, medicalStaffData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => {
      return ({
        painLocationData: masterPaginationReducer[masterPaginationServices.painLocation].data,
        painFrequencyData: masterPaginationReducer[masterPaginationServices.painFrquency].data,
        painDescriptionData: masterPaginationReducer[masterPaginationServices.painDescription].data,
        countryData: masterPaginationReducer[masterPaginationServices.country].data,
        covidVaccinationData: masterPaginationReducer[masterPaginationServices.covidVaccination].data,
        medicalStaffData: masterPaginationReducer[masterPaginationServices.medicalStaff].data

      })
    },
    shallowEqual
  );

  let painLocationOptions = painLocationData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let painFrequencyOptions = painFrequencyData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let painDescriptionOptions = painDescriptionData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let countryOptions = countryData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let covidVaccinationOptions = covidVaccinationData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let medicalStaffOptions = medicalStaffData.modelItems?.map((option: any) => ({ label: option.userDisplayName, value: option.id }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.painLocation, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.painFrquency, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.painDescription, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.country, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.covidVaccination, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.medicalStaff, {}));
  }, []);


  useEffect(() => {
    if (vitalData?.id && painLocationOptions.length && painFrequencyOptions.length && painDescriptionOptions.length && countryOptions.length && covidVaccinationOptions.length && medicalStaffOptions.length) {
      onEdit();
    }
  }, [vitalData?.id && painLocationOptions.length && painFrequencyOptions.length && painDescriptionOptions.length && countryOptions.length && covidVaccinationOptions.length && medicalStaffOptions.length]);

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    bodyData = {
      ...bodyData,
      id: vitalData?.id,
      isCoviD19Symptoms: isCoviD19Symptoms,
      isOtherAllergies: isOtherAllergies,
      isPeanutAllergy: isPeanutAllergy,
      isMedicationAllergy: isMedicationAllergy,
      isLatexAllergy: isLatexAllergy,
      isBoosterDose: isBoosterDose,
      isCOVIDVaccination: isCOVIDVaccination,
      isContactwithCovid19Patient: isContactwithCovid19Patient
    };

    setLoading(true);

    let VitalService = services[(vitalData?.id ? 'updateVital' : 'createVital') as keyof typeof services];

    VitalService(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          toastMessage(formatMessage({ id: vitalData?.id ? "update-message" : "create-message" }));
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
      VitalCapturingId: vitalData?.id
    };
    setLoading(true);
    services.getVitalById(paramsData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
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
      title={formatMessage({ id: "vital-partner" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
      }}
      goBack={() => history.goBack()}
      backButtonProps={{ label: formatMessage({ id: "summary" }) }}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={2}>
          <Accordion
            key="partnerDetails"
            style={{ marginBottom: '10px', width: "100%" }}
            expanded={expanded === "patientDetails"}
            onChange={handleAccordianToggle("patientDetails")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ backgroundColor: "#F3F3F3" }}
            >
              <Typography>Swapna Gupta ( UHID12317632 )</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomDatePicker
                    label={formatMessage({ id: "start-date" })}
                    name="vitalCapturingDate"
                    control={control}
                    error={errors.vitalCapturingDate}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "start-age" })}
                    name="patientAge"
                    control={control}
                    error={errors.patientAge}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomSelect
                    options={medicalStaffOptions}
                    label={formatMessage({ id: "professional" })}
                    name="professionalId"
                    control={control}
                    error={errors.professionalId}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "clinic" })}
                    name="workingCenter"
                    control={control}
                    error={errors.workingCenter}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "uhid" })}
                    name="vitalPatientUHID"
                    control={control}
                    error={errors.vitalPatientUHID}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion
            key="vital-signs"
            style={{ marginBottom: '10px', width: "100%" }}
            expanded={expanded === "vital-signs"}
            onChange={handleAccordianToggle("vital-signs")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ backgroundColor: "#F3F3F3" }}
            >
              <Typography>Vital Signs</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "weight(kg)" })}
                    name="vitalWeight"
                    control={control}
                    error={errors.vitalWeight}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "weight(lb)" })}
                    name="vitalWeight2"
                    control={control}
                    error={errors.vitalWeight2}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "height" })}
                    name="vitalHeight"
                    control={control}
                    error={errors.vitalHeight}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "bmi" })}
                    name="vitalBMI"
                    control={control}
                    error={errors.vitalBMI}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "tempC" })}
                    name="vitalTemperature"
                    control={control}
                    error={errors.vitalTemperature}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "tempF" })}
                    name="vitalTemperature"
                    control={control}
                    error={errors.vitalTemperature}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "bp(mmHg)" })}
                    name="vitalBP"
                    control={control}
                    error={errors.vitalBP}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "hr(bpm)" })}
                    name="vitalHR"
                    control={control}
                    error={errors.vitalHR}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "rr(cpm)" })}
                    name="vitalRR"
                    control={control}
                    error={errors.vitalRR}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "waist-circumference" })}
                    name="waistCircumference"
                    control={control}
                    error={errors.waistCircumference}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          {/*---------- vital sign end---------- */}
          {/*---------- pain assessmenet start---------- */}
          <Accordion
            key="pain-assessment"
            style={{ marginBottom: '10px', width: "100%" }}
            expanded={expanded === "pain-assessment"}
            onChange={handleAccordianToggle("pain-assessment")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ backgroundColor: "#F3F3F3" }}
            >
              <Typography>Pain Assessment</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
              <Grid item xs={12}>
                  <div style={{ display: "flex", padding: "12px 0", columnGap: "15px", flexWrap: "wrap" }}>
                    <div>
                      <img src={images.noHurt} />
                      <div style={{ textAlign: "center" }}>
                        <span >No Hurt</span>
                      </div>
                    </div>

                    <div>
                      <img src={images.hurtLittleBit} />
                      <div style={{ textAlign: "center" }}>
                        <span >Hurt Little Bit</span>
                      </div>
                    </div>

                    <div>
                      <img src={images.hurtLittleMore} />
                      <div style={{ textAlign: "center" }}>
                        <span >Hurt Little More</span>
                      </div>
                    </div>

                    <div>
                      <img src={images.hurtEvenMore} />
                      <div style={{ textAlign: "center" }}>
                        <span >Hurt Even More</span>
                      </div>
                    </div>

                    <div>
                      <img src={images.hurtWholeLot} />
                      <div style={{ textAlign: "center" }}>
                        <span >Hurt Whole Lot</span>
                      </div>
                    </div>

                    <div>
                      <img src={images.hurtWorst} />
                      <div style={{ textAlign: "center" }}>
                        <span >Hurt Worst</span>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomSelect
                    options={painRatingScaleOptions}
                    label={formatMessage({ id: "pain-rating-scale" })}
                    name="painRatingScale"
                    control={control}
                    error={errors.painRatingScale}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomSelect
                    options={painLocationOptions}
                    label={formatMessage({ id: "location" })}
                    name="painLocationId"
                    control={control}
                    error={errors.painLocationId}
                    rules={validationRule.textbox({ type: "number" })}

                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomSelect
                    options={painFrequencyOptions}
                    label={formatMessage({ id: "frequency" })}
                    name="painFrequencyId"
                    control={control}
                    error={errors.painFrequencyId}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={1} md={1} sm={1}>
                  <CustomTextBox
                    label={formatMessage({ id: "duration" })}
                    name="painDuration"
                    control={control}
                    error={errors.painDuration}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={2} md={4} sm={6}>
                  <CustomSelect
                    options={durationUnitOptions}
                    label={formatMessage({ id: "duration-unit" })}
                    name="painDurationUnit"
                    control={control}
                    error={errors.painDurationUnit}

                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomSelect
                    options={painDescriptionOptions}
                    label={formatMessage({ id: "pain-discription" })}
                    name="painDescriptionId"
                    control={control}
                    error={errors.painDescriptionId}
                    rules={validationRule.textbox({ type: "number" })}
                  />
                </Grid>
                <Grid item xs={12} lg={4} md={4} sm={6}>
                  <CustomCheckBox
                    name="isPainRateConfirmed"
                    label={formatMessage({ id: "pain-rate-confirmed" })}
                    control={control}
                    labelPlacement="start"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          {/*---------- pain assessmenet end------------ */}
          {/*---------- covid19 start------------ */}
          <Accordion
            key="covid19"
            style={{ marginBottom: '10px' }}
            expanded={expanded === "covid19"}
            onChange={handleAccordianToggle("covid19")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ backgroundColor: "#F3F3F3" }}
            >
              <Typography>Covid 19</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {/* covid symptoms */}
                <Grid item xs={12} lg={6} md={6} sm={6} style={{ borderRight: "1px solid black" }}>
                  <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", alignItems: "center" }} >
                    <FormLabel component="legend" style={{ paddingRight: "5px" }}>{formatMessage({ id: "covid-symptoms" })}</FormLabel>
                    <RadioButton
                      label="Yes"
                      name="isCoviD19Symptoms"
                      onChange={() => {
                        setIscovid19Symptoms(true);
                      }}
                      checked={isCoviD19Symptoms}
                    />
                    <RadioButton
                      label="No"
                      name="isCoviD19Symptoms"
                      onChange={() => {
                        setIscovid19Symptoms(false);
                      }}
                      checked={!isCoviD19Symptoms}
                    />
                  </Grid>
                  <div style={{ display: "flex", flexWrap: "wrap", rowGap: "8px" }}>
                    <Grid>
                      <CustomCheckBox
                        name="isCough"
                        label={formatMessage({ id: "cough" })}
                        control={control}
                        labelPlacement="end"
                      />
                    </Grid>
                    <Grid>
                      <CustomCheckBox
                        name="isShortnessofBreath"
                        label={formatMessage({ id: "shortness-of-breath" })}
                        control={control}
                        labelPlacement="end"
                      />
                    </Grid>
                    <Grid>
                      <CustomCheckBox
                        name="isFever"
                        label={formatMessage({ id: "fever" })}
                        control={control}
                        labelPlacement="end"
                      />
                    </Grid>
                    <Grid>
                      <CustomCheckBox
                        name="isOthers"
                        label={formatMessage({ id: "others" })}
                        control={control}
                        labelPlacement="end"
                        error={errors.isOthers}
                      />
                    </Grid>
                    <Grid item lg={12}>
                      <CustomTextBox
                        label={formatMessage({ id: "free-text" })}
                        name="otherDescription"
                        control={control}
                        error={errors.otherDescription}
                      />
                    </Grid>
                  </div>
                </Grid>
                {/* contact with covid patient */}
                <Grid item xs={12} lg={6} md={6} sm={6}>
                  <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", alignItems: "center" }} >
                    <FormLabel component="legend" style={{ paddingRight: "5px" }}>{formatMessage({ id: "contact-with-covid-patient" })}</FormLabel>
                    <RadioButton
                      label="Yes"
                      name="isContactwithCovid19Patient"
                      onChange={() => {
                        setIsContactwithCovid19Patient(true);
                      }}
                      checked={isContactwithCovid19Patient}
                    />
                    <RadioButton
                      label="No"
                      name="isContactwithCovid19Patient"
                      onChange={() => {
                        setIsContactwithCovid19Patient(false);
                      }}
                      checked={!isContactwithCovid19Patient}
                    />
                  </Grid>
                  <div style={{ padding: "10px", display: "flex", flexWrap: "wrap", columnGap: "8px", rowGap: "8px" }}>
                    <Grid item xs={12} lg={12} md={12} sm={12}>
                      <CustomDatePicker
                        label={formatMessage({ id: "date-of-exposer" })}
                        name="dateExposure"
                        control={control}
                        error={errors.dateExposure}
                      />
                    </Grid>
                    <Grid item xs={12} lg={12} md={12} sm={12}>
                      <CustomDatePicker
                        label={formatMessage({ id: "covid19-pcr-negative-date" })}
                        name="coviD19PCRNegativeDate"
                        control={control}
                        error={errors.coviD19PCRNegativeDate}
                      />
                    </Grid>
                  </div>
                </Grid>
                {/* travel history */}
                <Grid item xs={12} lg={12} md={12} sm={12} className="formHeading">
                  <CustomCheckBox
                    name="isTravelhistory"
                    label={formatMessage({ id: "travel-history" })}
                    control={control}
                    labelPlacement="start"
                  //   disabled
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomSelect
                    options={countryOptions}
                    label={formatMessage({ id: "country" })}
                    name="vitalCountryId"
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomDatePicker
                    label={formatMessage({ id: "arrival-date" })}
                    name="arrivalDate"
                    control={control}
                    error={errors.arrivalDate}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "remarks" })}
                    name="remark"
                    control={control}
                    error={errors.remark}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "created-by" })}
                    name="startAge"
                    control={control}
                    error={errors.startAge}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          {/*---------- covid19 end------------ */}
          {/*---------- covid 19 vaccination status start------------ */}
          <Accordion
            key="covid19-vaccination-status"
            style={{ marginBottom: '10px' }}
            expanded={expanded === "covid19-vaccination-status"}
            onChange={handleAccordianToggle("covid19-vaccination-status")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ backgroundColor: "#F3F3F3" }}
            >
              <Typography>Covid 19 Vaccination Status</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {/* covid vaccination */}
                <Grid item xs={12} lg={6} md={6} sm={6} style={{ borderRight: "1px solid black" }}>
                  <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", alignItems: "center" }} >
                    <FormLabel component="legend" style={{ paddingRight: "5px" }}>{formatMessage({ id: "covid-vaccination" })}</FormLabel>
                    <RadioButton
                      label="Yes"
                      name="isCOVIDVaccination"
                      onChange={() => {
                        setIsCOVIDVaccination(true);
                      }}
                      checked={isCOVIDVaccination}
                    />
                    <RadioButton
                      label="No"
                      name="isCOVIDVaccination"
                      onChange={() => {
                        setIsCOVIDVaccination(false);
                      }}
                      checked={!isCOVIDVaccination}
                    />
                  </Grid>
                  <div style={{ padding: "10px", display: "flex", flexWrap: "wrap", columnGap: "8px", rowGap: "8px" }}>
                    <Grid item xs={12} lg={12} md={12} sm={12} >
                      <CustomTextBox
                        label={formatMessage({ id: "reason" })}
                        name="reason"
                        control={control}
                        error={errors.reason}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={6} sm={6}>
                      <CustomSelect
                        options={covidVaccinationOptions}
                        label={formatMessage({ id: "vaccine" })}
                        name="vaccinationId"
                        control={control}

                      />
                    </Grid>
                    <Grid item xs={12} lg={5} md={5} sm={6}>
                      <CustomTextBox
                        label={formatMessage({ id: "free-text" })}
                        name="otherVaccinationDescription"
                        control={control}
                        error={errors.otherVaccinationDescription}
                      />
                    </Grid>
                    <Grid item xs={12} lg={6} md={6} sm={6}>
                      <CustomDatePicker
                        label={'First ' + formatMessage({ id: "dose" })}
                        name="firstDose"
                        control={control}
                        error={errors.startDate}
                      />
                    </Grid>
                    <Grid item xs={12} lg={5} md={5} sm={6}>
                      <CustomDatePicker
                        label={'Second ' + formatMessage({ id: "dose" })}
                        name="secondDose"
                        control={control}
                        error={errors.startDate}
                      />
                    </Grid>
                  </div>
                </Grid>
                {/* booster dose */}
                <Grid item xs={12} lg={6} md={6} sm={6}>
                  <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", alignItems: "center" }} >
                    <FormLabel component="legend" style={{ paddingRight: "5px" }}>{formatMessage({ id: "booster-dose" })}</FormLabel>
                    <RadioButton
                      label="Yes"
                      name="isBoosterDose"
                      onChange={() => {
                        setIsBoosterDose(true);
                      }}
                      checked={isBoosterDose}
                    />
                    <RadioButton
                      label="No"
                      name="isBoosterDose"
                      onChange={() => {
                        setIsBoosterDose(false);
                      }}
                      checked={!isBoosterDose}
                    />
                  </Grid>
                  <div style={{ padding: "10px", display: "flex", flexWrap: "wrap", columnGap: "8px", rowGap: "8px" }}>
                    <Grid item xs={12} md={12}>
                      <CustomDatePicker
                        label={formatMessage({ id: "date" })}
                        name="dateExposure"
                        control={control}
                        error={errors.dateExposure}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CustomTextBox
                        label={formatMessage({ id: "free-text" })}
                        name="otherDescription"
                        control={control}
                        error={errors.otherDescription}
                      />
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          {/*---------- covid 19 vaccination status end------------ */}
          {/*-------------------------Allergies (New section) start-----------------*/}
          <Accordion
            key="allergies-section"
            style={{ marginBottom: '10px' }}
            expanded={expanded === "allergies-section"}
            onChange={handleAccordianToggle("allergies-section")}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ backgroundColor: "#F3F3F3" }}
            >
              <Typography>Allergies (New Section)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", alignItems: "center" }}>

                  <RadioButton
                    label="No Known Allergies"
                    name="isNoKnowAllergy"
                    onChange={() => {
                      setIsAllergiesHistory(true);
                    }}
                    checked={isAllergiesHistory}
                  />
                  <RadioButton
                    label="Allergies"
                    name="isAllergiesHistory"
                    onChange={() => {
                      setIsAllergiesHistory(false);
                    }}
                    checked={!isAllergiesHistory}
                  />
                </Grid>
                <Grid item xs={12} lg={6} md={12} sm={12}>
                  <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
                    <Grid container item xs={12} spacing={1}>

                      <Grid item xs={12} lg={4} md={4} sm={6}>
                        <FormLabel component="legend">{formatMessage({ id: "latex-allergy" })}</FormLabel>
                        <RadioButton
                          label="Yes"
                          name="isLatexAllergy"
                          onChange={() => {
                            setIsLatexAllergy(true);
                          }}
                          checked={isLatexAllergy}
                          disabled={isAllergiesHistory ? false : true}
                        />
                        <RadioButton
                          label="No"
                          name="isLatexAllergy"
                          onChange={() => {
                            setIsLatexAllergy(false);
                          }}
                          checked={!isLatexAllergy}
                          disabled={isAllergiesHistory ? false : true}
                        />
                      </Grid>

                      <Grid item xs={12} lg={8} md={8} sm={12}>
                        <CustomTextBox
                          label={formatMessage({ id: "remarks" })}
                          name={`allergyDetail[0][latexAllergyDescription]`}
                          control={control}
                          disabled={isLatexAllergy && isAllergiesHistory ? false : true}
                        />
                      </Grid>

                      <Grid item xs={12} lg={4} md={4} sm={6}>
                        <FormLabel component="legend">{formatMessage({ id: "medication-allergy" })}</FormLabel>
                        <RadioButton
                          label="Yes"
                          name="isMedicationAllergy"
                          onChange={() => {
                            setIsMedicationAllergy(true);
                          }}
                          checked={isMedicationAllergy}
                          disabled={isAllergiesHistory ? false : true}
                        />
                        <RadioButton
                          label="No"
                          name="isMedicationAllergy"
                          onChange={() => {
                            setIsMedicationAllergy(false);
                          }}
                          checked={!isMedicationAllergy}
                          disabled={isAllergiesHistory ? false : true}
                        />
                      </Grid>
                      <Grid item xs={12} lg={8} md={8} sm={12}>
                        <CustomTextBox
                          label={formatMessage({ id: "remarks" })}
                          name={`allergyDetail[0][medicationAllergyDescription]`}
                          control={control}
                          disabled={isMedicationAllergy && isAllergiesHistory ? false : true}
                        />
                      </Grid>
                      <Grid item xs={12} lg={4} md={4} sm={6}>
                        <FormLabel component="legend">{formatMessage({ id: "peanut-allergy" })}</FormLabel>
                        <RadioButton
                          label="Yes"
                          name="isPeanutAllergy"
                          onChange={() => {
                            setIsPeanutAllergy(true);
                          }}
                          checked={isPeanutAllergy}
                          disabled={isAllergiesHistory ? false : true}
                        />
                        <RadioButton
                          label="No"
                          name="isPeanutAllergy"
                          onChange={() => {
                            setIsPeanutAllergy(false);
                          }}
                          checked={!isPeanutAllergy}
                          disabled={isAllergiesHistory ? false : true}
                        />
                      </Grid>
                      <Grid item xs={12} lg={8} md={8} sm={12}>
                        <CustomTextBox
                          label={formatMessage({ id: "remarks" })}
                          name={`allergyDetail[0][peanutAllergyDescription]`}
                          control={control}
                          disabled={isPeanutAllergy && isAllergiesHistory ? false : true}
                        />
                      </Grid>
                      <Grid item xs={12} lg={4} md={4} sm={6}>
                        <FormLabel component="legend"> {formatMessage({ id: "other-allergy" })}</FormLabel>
                        <RadioButton
                          label="Yes"
                          name="isOtherAllergies"
                          onChange={() => {
                            setIsOtherAllergies(true);
                          }}
                          checked={isOtherAllergies}
                          disabled={isAllergiesHistory ? false : true}
                        />
                        <RadioButton
                          label="No"
                          name="isOtherAllergies"
                          onChange={() => {
                            setIsOtherAllergies(false);
                          }}
                          checked={!isOtherAllergies}
                          disabled={isAllergiesHistory ? false : true}
                        />
                      </Grid>
                      <Grid item xs={12} lg={8} md={8} sm={12}>
                        <CustomTextBox
                          label={formatMessage({ id: "remarks", })}
                          name={`allergyDetail[0][otherAllergiesDescription]`}
                          control={control}
                          disabled={isOtherAllergies && isAllergiesHistory ? false : true}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
                <Grid item xs={12} lg={6} md={12} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "observation" })}
                    name="observation"
                    control={control}
                    error={errors.observation}
                    multiline
                    rows={4}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          {/*-------------------------Allergies (New section) end-------------------*/}

        </Grid>
      </Box>
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default PatientNewVitals;
