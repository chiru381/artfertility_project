import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import CheckIcon from "@material-ui/icons/Check";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { CustomSelect, CustomTextBox, TextBox, CustomDatePicker } from "components/forms";
import { HoverLoader } from "components";
import {
  ultrasoundAttachedItemTypes, uterineTypeOptions, uterineCavityTypeOptions, adenomyosisTypeOptions, cervixAngleOptions,
  endometrialInterlineOptions, endoMyometrialBorderOptions, intraUterineDeviceOptions, wauAvailablityOptions, fallopianTubeStateOptions
} from "utils/constants";
import { getUltrasoundGeneralLookup } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage, useGetPatientId, useCreateLookupOptions } from "utils/hooks";
import { SecondaryButton } from "components/button";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import NormalUltrasoundModal from './NormalUltrasoundModal';

import Uterus from './Uterus';
import Endometrium from './Endometrium';
import Attached from './Attached';

interface Props { }

const General = (props: Props) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const location = useLocation<any>();
  const history = useHistory();
  const { handleSubmit, formState: { errors }, control, reset, getValues, setValue, watch } = useForm({ mode: "all" });

  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | false>("general");

  const [normalUltrasoundModalOpen, setNormalUltrasoundModalOpen] = useState(false);
  const [isNormalUltrasound, setIsNormalUltrasound] = useState(false);

  const [folliclesRight, setFolliclesRight] = useState(null);
  const [folliclesLeft, setFolliclesLeft] = useState(null);
  const [endometrialThickness, setEndometrialThickness] = useState(null);

  const [isthmocele, setIsthmocele] = useState(true);
  const [isCervicalPathology, setIsCervicalPathology] = useState(true);

  const [isEndometrialPathology, setIsEndometrialPathology] = useState(true);
  const [isEndometrialPolyp, setIsEndometrialPolyp] = useState(true);
  const [isEndometrialSynechiae, setIsEndometrialSynechiae] = useState(true);

  const [isFreeLiquid, setIsFreeLiquid] = useState(true);
  const [isAshermanSyndrome, setIsAshermanSyndrome] = useState(true);
  const [otherParaOvarian, setOtherParaOvarian] = useState(true);
  const [isLeftFallopianTube, setIsLeftFallopianTube] = useState(true);
  const [isRightFallopianTube, setIsRightFallopianTube] = useState(true);

  const [uterusFormData, setUterusFormData] = useState<any>({});
  const [endometriumFormData, setEndometriumFormData] = useState<any>({});
  const [attachedFormData, setAttachedFormData] = useState<any>({});

  let ultrasoundData = location.state ?? {};
  let patientId = useGetPatientId();

  const { usgLookupData } =
    useSelector(({ usgLookupReducer }: RootReducerState) => ({
      usgLookupData: usgLookupReducer.data
    }),
      shallowEqual
    );

  // Lookup options for dropdown
  let selectOptions = useCreateLookupOptions(usgLookupData);

  useEffect(() => {
    dispatch(getUltrasoundGeneralLookup());
  }, []);

  useEffect(() => {
    if (ultrasoundData?.ultraSoundGeneralId && selectOptions?.uclinics?.length) {
      onGetUltrasoundGeneralApiCallById();
    }
  }, [ultrasoundData?.ultraSoundGeneralId && selectOptions?.uclinics?.length]);

  const handleAccordianToggle = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  function onVerifySubmit(data: any) {
    OnFormSubmit(data, true);
  }

  function onSubmit(data: any) {
    OnFormSubmit(data, false);
  }

  function OnFormSubmit(data: any, isVerify: boolean) {
    let bodyData = getFormBody(data);

    //Uterus Data
    let ultrasoundUterusMyomasData = bodyData?.ultrasoundUterusMyomas?.map((item: any) => ({
      ...item,
      appearanceId: item.appearanceId?.value,
      myomaHeightId: item.myomaHeightId?.value,
      myomaLocationId: item.myomaLocationId?.value,
      myomaTypeId: item.myomaTypeId?.value
    }));

    let ultrasoundUterusAdenomyosisesData = bodyData?.ultrasoundUterusAdenomyosises?.map((item: any) => ({
      ...item,
      adenomyosisHeightId: item.adenomyosisHeightId?.value,
      adenomyosisLocationId: item.adenomyosisLocationId?.value
    }));

    let ultrasoundUterusData = {
      ...getFormBody(bodyData.ultrasoundUterus),

      ultrasoundUterusMyomas: ultrasoundUterusMyomasData,
      ultrasoundUterusAdenomyosises: ultrasoundUterusAdenomyosisesData,
      isthmocele: isthmocele,
      isCervicalPathology: isCervicalPathology
    }
    ///Endometrium Data
    let endometrialPolypDetailsData = bodyData?.ultrasoundEndometrium?.endometrialPolypDetails?.map((item: any) => ({
      ...item,
      endometrialPolypAppearanceId: item.endometrialPolypAppearanceId?.value,
      endometrialPolypHeightId: item.endometrialPolypHeightId?.value
    }));

    let ultrasoundEndometriumData = {
      ...getFormBody(bodyData?.ultrasoundEndometrium),
      endometrialPolypDetails: endometrialPolypDetailsData,
      isEndometrialPathology: isEndometrialPathology,
      isEndometrialPolyp: isEndometrialPolyp,
      isEndometrialSynechiae: isEndometrialSynechiae
    }
    // Attached
    let ultrasoundAttachedItemsRightOvaryData = bodyData?.ultrasoundAttachedItemsRightOvary?.map((item: any) => ({
      ...item,
      ultrasoundAttachedTypeId: item.ultrasoundAttachedTypeId?.value,
      ultrasoundAttachedContentId: item.ultrasoundAttachedContentId?.value,
      ultrasoundAttachedImpDiagnosisId: item.ultrasoundAttachedImpDiagnosisId?.value,
      ultrasoundAttachedItemType: ultrasoundAttachedItemTypes.RightOvary
    }));
    let ultrasoundAttachedItemsLeftOvaryData = bodyData?.ultrasoundAttachedItemsLeftOvary?.map((item: any) => ({
      ...item,
      ultrasoundAttachedTypeId: item.ultrasoundAttachedTypeId?.value,
      ultrasoundAttachedContentId: item.ultrasoundAttachedContentId?.value,
      ultrasoundAttachedImpDiagnosisId: item.ultrasoundAttachedImpDiagnosisId?.value,
      ultrasoundAttachedItemType: ultrasoundAttachedItemTypes.LeftOvary
    }));
    let ultrasoundAttachedItemsRightFallopianTubeData = bodyData?.ultrasoundAttachedItemsRightFallopianTube?.map((item: any) => ({
      ...item,
      ultrasoundAttachedTypeId: item.ultrasoundAttachedTypeId?.value,
      ultrasoundAttachedContentId: item.ultrasoundAttachedContentId?.value,
      ultrasoundAttachedImpDiagnosisId: item.ultrasoundAttachedImpDiagnosisId?.value,
      ultrasoundAttachedItemType: ultrasoundAttachedItemTypes.RightFallopianTube
    }));
    let ultrasoundAttachedItemsLeftFallopianTubeData = bodyData?.ultrasoundAttachedItemsLeftFallopianTube?.map((item: any) => ({
      ...item,
      ultrasoundAttachedTypeId: item.ultrasoundAttachedTypeId?.value,
      ultrasoundAttachedContentId: item.ultrasoundAttachedContentId?.value,
      ultrasoundAttachedImpDiagnosisId: item.ultrasoundAttachedImpDiagnosisId?.value,
      ultrasoundAttachedItemType: ultrasoundAttachedItemTypes.LeftFallopianTube
    }));

    let ultrasoundAttachedItemsData = [
      ...ultrasoundAttachedItemsRightOvaryData,
      ...ultrasoundAttachedItemsLeftOvaryData,
      ...ultrasoundAttachedItemsRightFallopianTubeData,
      ...ultrasoundAttachedItemsLeftFallopianTubeData
    ]

    let ultrasoundAttachedData = {
      ...getFormBody(bodyData?.ultrasoundAttached),
      ultrasoundAttachedItems: ultrasoundAttachedItemsData,
      isFreeLiquid: isFreeLiquid,
      isAshermanSyndrome: isAshermanSyndrome,
      otherParaOvarian: otherParaOvarian,
      isLeftFallopianTube: isLeftFallopianTube,
      isRightFallopianTube: isRightFallopianTube
    }
    //

    bodyData = {
      ...bodyData,
      patientId: patientId,
      ultrasoundRequestId: ultrasoundData?.ultrasoundRequestId,
      isVerified: isVerify,
      isNormalUltrasound: isNormalUltrasound,
      folliclesRight: folliclesRight,
      folliclesLeft: folliclesLeft,
      endometrialThickness: endometrialThickness,

      ultrasoundUterus: ultrasoundUterusData,
      ultrasoundEndometrium: ultrasoundEndometriumData,
      ultrasoundAttached: ultrasoundAttachedData
    }

    if (ultrasoundData?.ultraSoundGeneralId) {
      bodyData = {
        ...bodyData,
        id: ultrasoundData?.ultraSoundGeneralId,
      }
    }

    setLoading(true);

    let ultrasoundGeneralService = services[(ultrasoundData?.ultraSoundGeneralId ? 'updateUltrasoundGeneral' : 'createUltrasoundGeneral') as keyof typeof services];

    ultrasoundGeneralService(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          toastMessage(formatMessage({ id: ultrasoundData?.ultraSoundGeneralId ? "update-message" : "create-message" }));
          history.push(`ultrasound-scan`);
        } else {
          toastMessage(res.data?.message, "error");
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, "error");
      });
  }

  function onGetUltrasoundGeneralApiCallById() {
    let paramsData = {
      ultrasoundGeneralId: ultrasoundData?.ultraSoundGeneralId
    };
    setLoading(true);
    services.getUltrasoundGeneralById(paramsData)
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

  function setFormData(resData: any) {

    let ultrasoundUterusMyomasData = resData?.ultrasoundUterus?.ultrasoundUterusMyomas?.map((item: any) => ({
      ...item,
      appearanceId: { label: item.appearanceName, value: item.appearanceId },
      myomaHeightId: { label: item.myomaHeightName, value: item.myomaHeightId },
      myomaLocationId: { label: item.myomaLocationName, value: item.myomaLocationId },
      myomaTypeId: { label: item.myomaTypeName, value: item.myomaTypeId }
    }));

    let ultrasoundUterusAdenomyosisesData = resData?.ultrasoundUterus?.ultrasoundUterusAdenomyosises?.map((item: any) => ({
      ...item,
      adenomyosisHeightId: { label: item.adenomyosisHeightName, value: item.adenomyosisHeightId },
      adenomyosisLocationId: { label: item.adenomyosisLocationName, value: item.adenomyosisLocationId }
    }));

    let ultrasoundUterusData = {
      ...resData?.ultrasoundUterus,
      uterineType: uterineTypeOptions?.find((option: any) => option.value == resData?.ultrasoundUterus?.uterineType) ?? null,
      malformationId: { label: resData?.ultrasoundUterus?.malformationName, value: resData?.ultrasoundUterus?.malformationId },
      cervicalPathologyId: { label: resData?.ultrasoundUterus?.cervicalPathologyName, value: resData?.ultrasoundUterus?.cervicalPathologyId },
      cervixAngle: cervixAngleOptions?.find((option: any) => option.value = resData?.ultrasoundUterus?.cervixAngle) ?? null,
      uterineCavityType: uterineCavityTypeOptions?.find((option: any) => option.value == resData?.ultrasoundUterus?.uterineCavityType) ?? null,
      adenomyosisType: adenomyosisTypeOptions?.find((option: any) => option.value == resData?.ultrasoundUterus?.adenomyosisType) ?? null,
      ultrasoundUterusMyomas: ultrasoundUterusMyomasData,
      ultrasoundUterusAdenomyosises: ultrasoundUterusAdenomyosisesData
    }

    let endometrialPolypDetailsData = resData?.ultrasoundEndometrium?.endometrialPolypDetails?.map((item: any) => ({
      ...item,
      endometrialPolypAppearanceId: { label: item.endometrialPolypAppearanceName, value: item.endometrialPolypAppearanceId },
      endometrialPolypHeightId: { label: item.endometrialPolypHeightName, value: item.endometrialPolypHeightId }
    }));

    let ultrasoundEndometriumData = {
      ...resData?.ultrasoundEndometrium,
      endometrialAppearanceId: selectOptions?.endometrialAppearances?.find((item: any) => item.value == resData?.ultrasoundEndometrium?.endometrialAppearanceId) ?? null,
      endometrialEcogenityId: selectOptions?.endometrialEcogenities?.find((item: any) => item.value == resData?.ultrasoundEndometrium?.endometrialEcogenityId) ?? null,
      endometrialLiquidId: selectOptions?.endometrialLiquids?.find((item: any) => item.value == resData?.ultrasoundEndometrium?.endometrialLiquidId) ?? null,
      endometrialInterline: endometrialInterlineOptions.find((item: any) => item.value == resData?.ultrasoundEndometrium?.endometrialInterline) ?? null,
      endoMyometrialBorder: endoMyometrialBorderOptions.find((item: any) => item.value == resData?.ultrasoundEndometrium?.endoMyometrialBorder) ?? null,
      intraUterineDevice: intraUterineDeviceOptions.find((item: any) => item.value == resData?.ultrasoundEndometrium?.intraUterineDevice) ?? null,
      endometrialPolypDetails: endometrialPolypDetailsData
    };

    //attached
    let ultrasoundAttachedItemsData = resData?.ultrasoundAttached?.ultrasoundAttachedItems?.map((item: any) => ({
      ...item,
      ultrasoundAttachedTypeId: { label: item.ultrasoundAttachedTypeName, value: item.ultrasoundAttachedTypeId },
      ultrasoundAttachedContentId: { label: item.ultrasoundAttachedContentName, value: item.ultrasoundAttachedContentId },
      ultrasoundAttachedImpDiagnosisId: { label: item.ultrasoundAttachedImpDiagnosisName, value: item.ultrasoundAttachedImpDiagnosisId }
    }));

    let ultrasoundAttachedData = {
      ...resData?.ultrasoundAttached,
      ultrasoundAttachedItemsRightOvary: ultrasoundAttachedItemsData?.filter((item: any) => item.ultrasoundAttachedItemType == ultrasoundAttachedItemTypes.RightOvary) ?? [],
      ultrasoundAttachedItemsLeftOvary: ultrasoundAttachedItemsData?.filter((item: any) => item.ultrasoundAttachedItemType == ultrasoundAttachedItemTypes.LeftOvary) ?? [],
      ultrasoundAttachedItemsRightFallopianTube: ultrasoundAttachedItemsData?.filter((item: any) => item.ultrasoundAttachedItemType == ultrasoundAttachedItemTypes.RightFallopianTube) ?? [],
      ultrasoundAttachedItemsLeftFallopianTube: ultrasoundAttachedItemsData?.filter((item: any) => item.ultrasoundAttachedItemType == ultrasoundAttachedItemTypes.LeftFallopianTube) ?? [],
      rightOvaryState: wauAvailablityOptions.find((item: any) => item.value == resData?.ultrasoundAttached.rightOvaryState) ?? null,
      rightOvaryStatusId: selectOptions?.ultrasoundAttachedTypes?.find((item: any) => item.value == resData?.ultrasoundAttached.rightOvaryStatusId) ?? null,
      leftOvaryState: wauAvailablityOptions.find((item: any) => item.value == resData?.ultrasoundAttached.leftOvaryState) ?? null,
      leftOvaryStatusId: selectOptions?.ultrasoundAttachedTypes?.find((item: any) => item.value == resData?.ultrasoundAttached.leftOvaryStatusId) ?? null,
      ultrasoundEssureId: selectOptions?.ultrasoundEssures?.find((item: any) => item.value == resData?.ultrasoundAttached.ultrasoundEssureId) ?? null,
      rightFallopianTubeState: fallopianTubeStateOptions?.find((item: any) => item.value == resData?.ultrasoundAttached.rightFallopianTubeState) ?? null,
      leftFallopianTubeState: fallopianTubeStateOptions?.find((item: any) => item.value == resData?.ultrasoundAttached.leftFallopianTubeState) ?? null,
      ultrasoundAttachedLocationId: selectOptions?.ultrasoundAttachedLocations?.find((item: any) => item.value == resData?.ultrasoundAttached.ultrasoundAttachedLocationId) ?? null,
    }

    let data = {
      ...resData,
      clinicId: { label: resData?.clinicName, value: resData.clinicId },
      ultrasoundTypeId: { label: resData?.ultrasoundTypeName, value: resData.ultrasoundTypeId },
      ultrasoundMethodId: { label: resData.ultrasoundMethodName, value: resData.ultrasoundMethodId },
      doctorId: { label: resData.doctorUserDisplayName, value: resData.doctorId },
      ultrasoundUterus: ultrasoundUterusData,
      ultrasoundEndometrium: ultrasoundEndometriumData,
      ultrasoundAttached: ultrasoundAttachedData
    };

    reset(data);
    
    setUterusFormData(ultrasoundUterusData);
    setEndometriumFormData(ultrasoundEndometriumData);
    setAttachedFormData(ultrasoundAttachedData);

    setNormalUltrasoundModalOpen(resData.normalUltrasoundModalOpen);
    setIsNormalUltrasound(resData.isNormalUltrasound);
    setFolliclesRight(resData?.folliclesRight);
    setFolliclesLeft(resData?.folliclesLeft);
    setEndometrialThickness(resData?.endometrialThickness);

    //uterus
    setIsthmocele(resData.ultrasoundUterus.isthmocele);
    setIsCervicalPathology(resData.ultrasoundUterus.isCervicalPathology);
    //endometrium
    setIsEndometrialPathology(resData.ultrasoundEndometrium.isEndometrialPathology);
    setIsEndometrialPolyp(resData.ultrasoundEndometrium.isEndometrialPolyp);
    setIsEndometrialSynechiae(resData.ultrasoundEndometrium.isEndometrialSynechiae);

    //attached
    setIsFreeLiquid(resData.ultrasoundAttached.isFreeLiquid);
    setIsAshermanSyndrome(resData.ultrasoundAttached.isAshermanSyndrome);
    setOtherParaOvarian(resData.ultrasoundAttached.otherParaOvarian);
    setIsLeftFallopianTube(resData.ultrasoundAttached.isLeftFallopianTube);
    setIsRightFallopianTube(resData.ultrasoundAttached.isRightFallopianTube);
  }

  function onAddNormalUltrasoundData(data: any) {
    reset({
      ...getValues(),
      notes: formatMessage({ id: "general-ultrasound-message" })
    });

    setIsNormalUltrasound(true);

    setFolliclesRight(data?.folliclesRight);
    setFolliclesLeft(data?.folliclesLeft);
    setEndometrialThickness(data?.endometrialThickness);
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "ultrasound-scan" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: ultrasoundData?.ultraSoundGeneralId ? "Update" : "Save"
      }}
      onClickSecondaryButton={handleSubmit(onVerifySubmit)}
      secondaryButtonProps={{
        label: "Verify"
      }}
      goBack={() => history.goBack()}
      backButtonProps={{ label: formatMessage({ id: "summary" }) }}
    >
      <Box padding={2} component={Paper}>
        <Accordion
          key="general"
          style={{ marginBottom: '10px' }}
          expanded={expanded === "general"}
          onChange={handleAccordianToggle("general")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-parent-header"
            style={{ backgroundColor: "#F3F3F3", }}>
            <Typography>General</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomDatePicker
                  label={formatMessage({ id: "date" })}
                  name="ultrasoundDate"
                  control={control}
                  error={errors.ultrasoundDate}
                  rules={validationRule.textbox({ required: true })}
                  defaultValue={new Date()}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                  options={selectOptions?.doctors ?? []}
                  label={formatMessage({ id: "performed-by" })}
                  name="doctorId"
                  control={control}
                  error={errors.doctorId}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                  options={selectOptions?.uclinics ?? []}
                  label={formatMessage({ id: "clinic" })}
                  name="clinicId"
                  control={control}
                  error={errors.clinicId}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                  options={selectOptions?.ultrasoundTypes ?? []}
                  label={formatMessage({ id: "type-of-ultrasound" })}
                  name="ultrasoundTypeId"
                  control={control}
                  error={errors.ultrasoundTypeId}
                />
              </Grid>
              <Grid item xs={12} lg={3} md={4} sm={6}>
                <CustomSelect
                  options={selectOptions?.ultrasoundMethods ?? []}
                  label={formatMessage({ id: "method-of-ultrasound" })}
                  name="ultrasoundMethodId"
                  control={control}
                  error={errors.ultrasoundMethodId}
                />
              </Grid>

              {isNormalUltrasound &&
                <>
                  <Grid item xs={12} lg={12} md={12} sm={12}>
                    <Box>
                      <h3 className="formHeading" style={{ border: "none" }}>
                        <FormattedMessage id="number-of-antral-follicies" />:
                      </h3>
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={3} md={4} sm={6}>
                    <TextBox
                      label={formatMessage({ id: "right-ovary" })}
                      name="folliclesRight"
                      disabled
                      value={folliclesRight}
                    />
                  </Grid>
                  <Grid item xs={12} lg={3} md={4} sm={6}>
                    <TextBox
                      label={formatMessage({ id: "left-ovary" })}
                      name="folliclesLeft"
                      disabled
                      value={folliclesLeft}
                    />
                  </Grid>
                  <Grid item xs={12} lg={3} md={4} sm={6}>
                    <TextBox
                      label={formatMessage({ id: "endometrial-thickness" })}
                      name="endometrialThickness"
                      value={endometrialThickness}
                      disabled
                    />
                  </Grid>
                </>
              }
              <Grid item xs={12} lg={12} md={12} sm={12}>
                <Box>
                  <h3 className="formHeading">
                  </h3>
                </Box>
              </Grid>

              <Grid item xs={12} lg={6} md={12} sm={12}
                style={{ border: "1px solid lightgrey", borderRadius: "8px", marginTop: "6px", marginBottom: "6px" }}>
                <div style={{ alignItems: "center", justifyContent: "center", display: "flex" }}>
                  <SecondaryButton
                    label={formatMessage({ id: "normal-ultrasound" })}
                    style={{ background: "#0BDB5E", color: "white", border: "none", marginLeft: "0px" }}
                    onClick={() => {
                      if (!isNormalUltrasound) {
                        setNormalUltrasoundModalOpen(true);
                      }
                      else {
                        setIsNormalUltrasound(false);
                        setValue("notes", "");
                        setFolliclesRight(null);
                        setFolliclesLeft(null);
                        setEndometrialThickness(null);
                      }
                    }}
                    startIcon={isNormalUltrasound ? <CheckIcon /> : ""}
                  />
                </div>
                <div style={{ justifyContent: "center", marginTop: "10px", textAlign: "center" }}>
                  {isNormalUltrasound && formatMessage({ id: "general-ultrasound-message" })}
                </div>
              </Grid>

              <Grid item xs={12} lg={6} md={12} sm={12}>
                <CustomTextBox
                  label={formatMessage({ id: "ultrasound-notes/remarks" })}
                  name="notes"
                  control={control}
                  error={errors.notes}
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>

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
            <Typography>Uterus</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <Uterus
                control={control}
                isthmocele={isthmocele}
                isCervicalPathology={isCervicalPathology}
                setIsthmocele={setIsthmocele}
                setIsCervicalPathology={setIsCervicalPathology}
                formData={uterusFormData}
                errors={errors}
                getValues={getValues}
                reset={reset}
                watch={watch}
              />
          </AccordionDetails>
        </Accordion>

        <Accordion
          key="endometrium"
          style={{ marginBottom: '10px' }}
          expanded={expanded === "endometrium"}
          onChange={handleAccordianToggle("endometrium")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-parent-header"
            style={{ backgroundColor: "#F3F3F3", }}>
            <Typography>Endometrium</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <Endometrium
                control={control}
                isEndometrialPathology={isEndometrialPathology}
                isEndometrialPolyp={isEndometrialPolyp}
                isEndometrialSynechiae={isEndometrialSynechiae}
                setIsEndometrialPathology={setIsEndometrialPathology}
                setIsEndometrialPolyp={setIsEndometrialPolyp}
                setIsEndometrialSynechiae={setIsEndometrialSynechiae}
                formData={endometriumFormData}
                errors={errors}
                getValues={getValues}
                reset={reset}
              />
          </AccordionDetails>
        </Accordion>

        <Accordion
          key="attached"
          style={{ marginBottom: '10px' }}
          expanded={expanded === "attached"}
          onChange={handleAccordianToggle("attached")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-parent-header"
            style={{ backgroundColor: "#F3F3F3", }}>
            <Typography>Attached</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Attached
              control={control}
              isFreeLiquid={isFreeLiquid}
              isAshermanSyndrome={isAshermanSyndrome}
              otherParaOvarian={otherParaOvarian}
              isLeftFallopianTube={isLeftFallopianTube}
              isRightFallopianTube={isRightFallopianTube}
              setIsFreeLiquid={setIsFreeLiquid}
              setIsAshermanSyndrome={setIsAshermanSyndrome}
              setOtherParaOvarian={setOtherParaOvarian}
              setIsLeftFallopianTube={setIsLeftFallopianTube}
              setIsRightFallopianTube={setIsRightFallopianTube}
              errors={errors}
              formData={attachedFormData}
              getValues={getValues}
              reset={reset}
              watch={watch}
            />

          </AccordionDetails>
        </Accordion>
      </Box>

      {loading && <HoverLoader />}

      {normalUltrasoundModalOpen && (
        <NormalUltrasoundModal
          closeModal={() => {
            setNormalUltrasoundModalOpen(false);
          }}
          onAddNormalUltrasoundData={onAddNormalUltrasoundData}
        />
      )}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default General;


