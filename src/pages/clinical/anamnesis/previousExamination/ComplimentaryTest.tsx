import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";

import { CustomSelect, CustomTextBox, CustomDatePicker, RadioButton } from "components/forms";
import { HoverLoader } from "components";
import { masterPaginationServices, complimentaryTestDetailTypes, testEndoTestTypes, complimentaryTestTypes } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";

interface Props { }

const ComplimentaryTest = (props: Props) => {
  const dispatch = useDispatch();
  const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: "all" });

  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const [isEditOn, setIsEditOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isHSG, setIsHysterosalpingography] = useState(true);
  const [isCytology, setIsCytology] = useState(true);
  const [isBreastUSG, setIsBreastUltrasound] = useState(true);
  const [isMammography, setIsmammography] = useState(true);
  const [isUSG, setIsUltrasound] = useState(true);
  const [isHysteroSono, setIsHysterosonography] = useState(true);
  const [isTestEndoRecept, setIsTestendometrial] = useState(true);
  const [isEndometrialBiopsy, setIsEndometrialBiopsy] = useState(true);

  const [hsgType, setHSGType] = useState(complimentaryTestTypes.Normal);
  const [cytologyType, setCytologyType] = useState(complimentaryTestTypes.Normal);
  const [breastUSGType, setBreastUSGType] = useState(complimentaryTestTypes.Normal);
  const [mammographyType, setResultTypemammography] = useState(complimentaryTestTypes.Normal);
  const [hysterosonoType, setResultTypeHysterosonography] = useState(complimentaryTestTypes.Normal);
  const [testEndoReceptType, setResultTypeTestendometrial] = useState(testEndoTestTypes.Receptive);
  const [endometrialBiopsyType, setEndometrialBiopsyType] = useState(complimentaryTestTypes.Normal);

  let patientId = useGetPatientId();

  const { uterineCavityData, fallopianTubeStatusData, calendarYearData, pathologicalData, complimentaryTestDetailData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      uterineCavityData: masterPaginationReducer[masterPaginationServices.uterineCavity].data,
      fallopianTubeStatusData: masterPaginationReducer[masterPaginationServices.fallopianTubeStatus].data,
      calendarYearData: masterPaginationReducer[masterPaginationServices.calendarYear].data,
      pathologicalData: masterPaginationReducer[masterPaginationServices.pathalogical].data,
      complimentaryTestDetailData: masterPaginationReducer[masterPaginationServices.complimentaryTestDetail].data
    }), shallowEqual
  );

  let uterineCavityOptions = uterineCavityData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let fallopianTubeStatusOptions = fallopianTubeStatusData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let calenderYearOptions = calendarYearData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let endometrialBiopsyPathologicalOptions = pathologicalData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let mammographyDetailOptions = complimentaryTestDetailData.modelItems?.filter((item: any) => item.detailType == complimentaryTestDetailTypes.Mammography)?.map((option: any) => ({ label: option.name, value: option.id }));
  let breastUltrasoundDetailOptions = complimentaryTestDetailData.modelItems?.filter((item: any) => item.detailType == complimentaryTestDetailTypes.BreastUltrasound)?.map((option: any) => ({ label: option.name, value: option.id }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.uterineCavity, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.fallopianTubeStatus, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.calendarYear, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.pathalogical, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.complimentaryTestDetail, {}));
  }, []);

  useEffect(() => {
    if (uterineCavityOptions?.length && fallopianTubeStatusOptions?.length && calenderYearOptions?.length && endometrialBiopsyPathologicalOptions?.length
      && mammographyDetailOptions?.length && breastUltrasoundDetailOptions?.length) {
      onEdit();
    }
  }, [uterineCavityOptions?.length && fallopianTubeStatusOptions?.length && calenderYearOptions?.length && endometrialBiopsyPathologicalOptions?.length
    && mammographyDetailOptions?.length && breastUltrasoundDetailOptions?.length])

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    bodyData = {
      ...bodyData,
      id: patientId,
      isHSG: isHSG,
      isCytology: isCytology,
      isBreastUSG: isBreastUSG,
      isMammography: isMammography,
      isUSG: isUSG,
      isHysteroSono: isHysteroSono,
      isTestEndoRecept: isTestEndoRecept,
      isEndometrialBiopsy: isEndometrialBiopsy,

      hsgType: hsgType,
      cytologyType: cytologyType,
      breastUSGType: breastUSGType,
      mammographyType: mammographyType,
      hysterosonoType: hysterosonoType,
      testEndoReceptType: testEndoReceptType,
      EndometrialBiopsyType: endometrialBiopsyType
    }

    setLoading(true);

    let complimentoryTestService = services[(isEditOn ? 'updateComplimentoryTest' : 'createComplimentoryTest') as keyof typeof services];

    complimentoryTestService(bodyData)
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
      ComplimentaryTestId: patientId
    }
    setDeleteLoading(true);
    services.deleteComplimentoryTest(parms)
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
      ComplimentaryTestId: patientId
    };
    setLoading(true);
    services.getComplimentoryTestByTestId(paramsData)
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

    setIsHysterosalpingography(true);
    setIsCytology(true);
    setIsBreastUltrasound(true);
    setIsmammography(true);
    setIsUltrasound(true);
    setIsHysterosonography(true);
    setIsTestendometrial(true);
    setIsEndometrialBiopsy(true);

    setHSGType(complimentaryTestTypes.Normal);
    setCytologyType(complimentaryTestTypes.Normal);
    setBreastUSGType(complimentaryTestTypes.Normal);
    setResultTypemammography(complimentaryTestTypes.Normal);
    setResultTypeHysterosonography(complimentaryTestTypes.Normal);
    setResultTypeTestendometrial(testEndoTestTypes.Receptive);
    setEndometrialBiopsyType(complimentaryTestTypes.Normal);
  }

  function setFormData(resData: any) {

    let data = {
      ...resData,
      hsgUterineCavityId: uterineCavityOptions?.find((item: any) => item.value == resData?.hsgUterineCavityId) ?? null,
      hysterosonoUterineCavityId: uterineCavityOptions?.find((item: any) => item.value == resData?.hysterosonoUterineCavityId) ?? null,
      rightHSGFallopianTubeStatusId: fallopianTubeStatusOptions?.find((item: any) => item.value == resData?.rightHSGFallopianTubeStatusId) ?? null,
      leftHSGFallopianTubeStatusId: fallopianTubeStatusOptions?.find((item: any) => item.value == resData?.leftHSGFallopianTubeStatusId) ?? null,
      rightHysterosonoFallopianTubeStatusId: fallopianTubeStatusOptions?.find((item: any) => item.value == resData?.rightHysterosonoFallopianTubeStatusId) ?? null,
      leftHysterosonoFallopianTubeStatusId: fallopianTubeStatusOptions?.find((item: any) => item.value == resData?.leftHysterosonoFallopianTubeStatusId) ?? null,

      breastUSGYearId: calenderYearOptions?.find((item: any) => item.value == resData?.breastUSGYearId) ?? null,
      mammographyYearId: calenderYearOptions?.find((item: any) => item.value == resData?.mammographyYearId) ?? null,

      breastUSGDetailId: breastUltrasoundDetailOptions?.find((item: any) => item.value == resData?.breastUSGDetailId) ?? null,
      mammographyDetailId: mammographyDetailOptions?.find((item: any) => item.value == resData?.mammographyDetailId) ?? null,

      endometrialBiopsyPathologicalId: endometrialBiopsyPathologicalOptions?.find((item: any) => item.value == resData?.endometrialBiopsyPathologicalId) ?? null,

      usgYearId: calenderYearOptions?.find((item: any) => item.value == resData?.usgYearId) ?? null,
      hysterosonoYearId: calenderYearOptions?.find((item: any) => item.value == resData?.hysterosonoYearId) ?? null,
      testEndoReceptYearId: calenderYearOptions?.find((item: any) => item.value == resData?.testEndoReceptYearId) ?? null,
      endometrialBiopsyYearId: calenderYearOptions?.find((item: any) => item.value == resData?.endometrialBiopsyYearId) ?? null,
    }
    reset(data);

    setIsHysterosalpingography(resData.isHSG);
    setIsCytology(resData.isCytology);
    setIsBreastUltrasound(resData.isBreastUSG);
    setIsmammography(resData.isMammography);
    setIsUltrasound(resData.isUSG);
    setIsHysterosonography(resData.isHysteroSono);
    setIsTestendometrial(resData.isTestEndoRecept);
    setIsEndometrialBiopsy(resData.isEndometrialBiopsy);

    setHSGType(resData.hsgType);
    setCytologyType(resData.cytologyType);
    setBreastUSGType(resData.breastUSGType);
    setResultTypemammography(resData.mammographyType);
    setResultTypeHysterosonography(resData.hysterosonoType);
    setResultTypeTestendometrial(resData.testEndoReceptType);
    setEndometrialBiopsyType(resData.endometrialBiopsyType);
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "complimentary-test" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      onDelete={onDelete}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <FormLabel component="legend"> {formatMessage({ id: "hysterosalpingography" })}</FormLabel>
            <RadioButton
              label="Yes"
              name="isHSG"
              onChange={() => {
                setIsHysterosalpingography(true);
              }}
              checked={isHSG}
            />
            <RadioButton
              label="No"
              name="isHSG"
              onChange={() => {
                setIsHysterosalpingography(false);
              }}
              checked={!isHSG}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomDatePicker
              label={formatMessage({ id: "date" })}
              name="hsgDate"
              control={control}
              error={errors.hsgDate}
              disabled={isHSG ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend">Result</FormLabel>
            <RadioButton
              label="Normal"
              name="hsgType"
              onChange={() => {
                setHSGType(complimentaryTestTypes.Normal);
              }}
              checked={hsgType == complimentaryTestTypes.Normal ? true : false}
              disabled={isHSG ? false : true}
            />
            <RadioButton
              label="Pathological"
              name="hsgType"
              onChange={() => {
                setHSGType(complimentaryTestTypes.Pathological);
              }}
              checked={hsgType == complimentaryTestTypes.Pathological ? true : false}
              disabled={isHSG ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={uterineCavityOptions}
              label={formatMessage({ id: "uterine-cavity" })}
              name="hsgUterineCavityId"
              control={control}
              error={errors.hsgUterineCavityId}
              disabled={isHSG && hsgType == complimentaryTestTypes.Pathological ? false : true}
            />
          </Grid>

          <Grid item xs={12}>
            <h3 className="formHeading" style={{ border: "none", padding: "0px", margin: "0px" }}>
              <FormattedMessage id="fallopion-tubes" />
            </h3>
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={fallopianTubeStatusOptions}
              label={formatMessage({ id: "right" })}
              name="rightHSGFallopianTubeStatusId"
              control={control}
              error={errors.rightHSGFallopianTubeStatusId}
              disabled={isHSG && hsgType == complimentaryTestTypes.Pathological ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={fallopianTubeStatusOptions}
              label={formatMessage({ id: "left" })}
              name="leftHSGFallopianTubeStatusId"
              control={control}
              error={errors.leftHSGFallopianTubeStatusId}
              disabled={isHSG && hsgType == complimentaryTestTypes.Pathological ? false : true}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "observation" })}
              name="hsgObservations"
              control={control}
              error={errors.hsgObservations}
            />
          </Grid>

          <Grid item xs={12}>
            <Box>
              <h3 className="formHeading" style={{ padding: "0px", margin: "0px" }}>
              </h3>
            </Box>
          </Grid>

          <Grid item xs={12} lg={2} md={4} sm={6}>
            <FormLabel component="legend">{formatMessage({ id: "cytology" })} </FormLabel>
            <RadioButton
              label="Yes"
              name="isCytology"
              onChange={() => {
                setIsCytology(true);
              }}
              checked={isCytology}
            />
            <RadioButton
              label="No"
              name="isCytology"
              onChange={() => {
                setIsCytology(false);
              }}
              checked={!isCytology}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend">Result</FormLabel>
            <RadioButton
              label="Normal"
              name="cytologyType"
              onChange={() => {
                setCytologyType(complimentaryTestTypes.Normal);
              }}
              checked={cytologyType == complimentaryTestTypes.Normal ? true : false}
              disabled={isCytology ? false : true}
            />
            <RadioButton
              label="Pathological"
              name="cytologyType"
              onChange={() => {
                setCytologyType(complimentaryTestTypes.Pathological);
              }}
              checked={cytologyType == complimentaryTestTypes.Pathological ? true : false}
              disabled={isCytology ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomDatePicker
              label={formatMessage({ id: "date" })}
              name="cytologyDate"
              control={control}
              error={errors.cytologyDate}
              required={true}
              disabled={isCytology ? false : true}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "observation" })}
              name="cytologyObservations"
              control={control}
              error={errors.cytologyObservations}
            />
          </Grid>
          <Grid item xs={12}>
            <Box>
              <h3 className="formHeading" style={{ padding: "0px", margin: "0px" }}>
              </h3>
            </Box>
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend"> {formatMessage({ id: "breast-ultrasound" })}</FormLabel>
            <RadioButton
              label="Yes"
              name="isBreastUSG"
              onChange={() => {
                setIsBreastUltrasound(true);
              }}
              checked={isBreastUSG}
            />
            <RadioButton
              label="No"
              name="isBreastUSG"
              onChange={() => {
                setIsBreastUltrasound(false);
              }}
              checked={!isBreastUSG}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              label={formatMessage({ id: "year" })}
              options={calenderYearOptions}
              name="breastUSGYearId"
              control={control}
              error={errors.breastUSGYearId}
              disabled={isBreastUSG ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend">Result</FormLabel>
            <RadioButton
              label="Normal"
              name="breastUSGType"
              onChange={() => {
                setBreastUSGType(complimentaryTestTypes.Normal);
              }}
              checked={breastUSGType == complimentaryTestTypes.Normal ? true : false}
              disabled={isBreastUSG ? false : true}
            />
            <RadioButton
              label="Pathological"
              name="breastUSGType"
              onChange={() => {
                setBreastUSGType(complimentaryTestTypes.Pathological);
              }}
              checked={breastUSGType == complimentaryTestTypes.Pathological ? true : false}
              disabled={isBreastUSG ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={breastUltrasoundDetailOptions}
              label={formatMessage({ id: "details" })}
              name="breastUSGDetailId"
              control={control}
              error={errors.breastUSGDetailId}
              disabled={isBreastUSG && breastUSGType == complimentaryTestTypes.Pathological ? false : true}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "observation" })}
              name="breastUSGObservations"
              control={control}
              error={errors.breastUSGObservations}
            />
          </Grid>

          <Grid item xs={12}>
            <Box>
              <h3 className="formHeading" style={{ padding: "0px", margin: "0px" }}>
              </h3>
            </Box>
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend">{formatMessage({ id: "mammography" })} </FormLabel>
            <RadioButton
              label="Yes"
              name="isMammography"
              onChange={() => {
                setIsmammography(true);
              }}
              checked={isMammography}
            />
            <RadioButton
              label="No"
              name="isMammography"
              onChange={() => {
                setIsmammography(false);
              }}
              checked={!isMammography}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={calenderYearOptions}
              label={formatMessage({ id: "year" })}
              name="mammographyYearId"
              control={control}
              error={errors.mammographyYearId}
              disabled={isMammography ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend">Result</FormLabel>
            <RadioButton
              label="Normal"
              name="mammographyType"
              onChange={() => {
                setResultTypemammography(complimentaryTestTypes.Normal);
              }}
              checked={mammographyType == complimentaryTestTypes.Normal ? true : false}
              disabled={isMammography ? false : true}
            />
            <RadioButton
              label="Pathological"
              name="mammographyType"
              onChange={() => {
                setResultTypemammography(complimentaryTestTypes.Pathological);
              }}
              checked={mammographyType == complimentaryTestTypes.Pathological ? true : false}
              disabled={isMammography ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={mammographyDetailOptions}
              label={formatMessage({ id: "details" })}
              name="mammographyDetailId"
              control={control}
              error={errors.mammographyDetailId}
              disabled={isMammography && mammographyType == complimentaryTestTypes.Pathological ? false : true}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "observation" })}
              name="mammographyObservations"
              control={control}
              error={errors.mammographyObservations}
            />
          </Grid>

          <Grid item xs={12}>
            <Box>
              <h3 className="formHeading" style={{ padding: "0px", margin: "0px" }}>
              </h3>
            </Box>
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <FormLabel component="legend">{formatMessage({ id: "ultrasound" })} </FormLabel>
            <RadioButton
              label="Yes"
              name="isUSG"
              onChange={() => {
                setIsUltrasound(true);
              }}
              checked={isUSG}
            />
            <RadioButton
              label="No"
              name="isUSG"
              onChange={() => {
                setIsUltrasound(false);
              }}
              checked={!isUSG}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={calenderYearOptions}
              label={formatMessage({ id: "year" })}
              name="usgYearId"
              control={control}
              error={errors.usgYearId}
              disabled={isUSG ? false : true}
            />
          </Grid>
          <Grid item xs={12} lg={7} md={12} sm={12}>
            <CustomTextBox
              label={formatMessage({ id: "observation" })}
              name="usgObservations"
              control={control}
              error={errors.usgObservations}
            />
          </Grid>

          <Grid item xs={12}>
            <Box>
              <h3 className="formHeading">
              </h3>
            </Box>
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend">{formatMessage({ id: "hysterosonography" })} </FormLabel>
            <RadioButton
              label="Yes"
              name="isHysteroSono"
              onChange={() => {
                setIsHysterosonography(true);
              }}
              checked={isHysteroSono}
            />
            <RadioButton
              label="No"
              name="isHysteroSono"
              onChange={() => {
                setIsHysterosonography(false);
              }}
              checked={!isHysteroSono}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={calenderYearOptions}
              label={formatMessage({ id: "year" })}
              name="hysterosonoYearId"
              control={control}
              error={errors.hysterosonoYearId}
              disabled={isHysteroSono ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend">Result</FormLabel>
            <RadioButton
              label="Normal"
              name="hysterosonoType"
              onChange={() => {
                setResultTypeHysterosonography(complimentaryTestTypes.Normal);
              }}
              checked={hysterosonoType == complimentaryTestTypes.Normal ? true : false}
              disabled={isHysteroSono ? false : true}
            />
            <RadioButton
              label="Pathological"
              name="hysterosonoType"
              onChange={() => {
                setResultTypeHysterosonography(complimentaryTestTypes.Pathological);
              }}
              checked={hysterosonoType == complimentaryTestTypes.Pathological ? true : false}
              disabled={isHysteroSono ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={uterineCavityOptions}
              label={formatMessage({ id: "uterine-cavity" })}
              name="hysterosonoUterineCavityId"
              control={control}
              error={errors.hysterosonoUterineCavityId}
              disabled={isHysteroSono && hysterosonoType == complimentaryTestTypes.Pathological ? false : true}
            />
          </Grid>

          <Grid item xs={12}>
            <h3 className="formHeading" style={{ padding: "0px", margin: "0px", border: "none" }}>
              <FormattedMessage id="fallopion-tubes" />
            </h3>
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={fallopianTubeStatusOptions}
              label={formatMessage({ id: "right" })}
              name="rightHysterosonoFallopianTubeStatusId"
              control={control}
              error={errors.rightHysterosonoFallopianTubeStatusId}
              disabled={isHysteroSono && hysterosonoType == complimentaryTestTypes.Pathological ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={fallopianTubeStatusOptions}
              label={formatMessage({ id: "left" })}
              name="leftHysterosonoFallopianTubeStatusId"
              control={control}
              error={errors.leftHysterosonoFallopianTubeStatusId}
              disabled={isHysteroSono && hysterosonoType == complimentaryTestTypes.Pathological ? false : true}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "observation" })}
              name="hysteroSonoObservations"
              control={control}
              error={errors.hysteroSonoObservations}
            />
          </Grid>

          <Grid item xs={12}>
            <Box>
              <h3 className="formHeading" style={{ margin: "0px", padding: "0px" }}>
              </h3>
            </Box>
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend">{formatMessage({ id: "test-endometrial-receptivity" })} </FormLabel>
            <RadioButton
              label="Yes"
              name="isTestEndoRecept"
              onChange={() => {
                setIsTestendometrial(true);
              }}
              checked={isTestEndoRecept}
            />
            <RadioButton
              label="No"
              name="isTestEndoRecept"
              onChange={() => {
                setIsTestendometrial(false);
              }}
              checked={!isTestEndoRecept}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={calenderYearOptions}
              label={formatMessage({ id: "year" })}
              name="testEndoReceptYearId"
              control={control}
              error={errors.testEndoReceptYearId}
              disabled={isTestEndoRecept ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={4} md={5} sm={6}>
            <FormLabel component="legend">Result</FormLabel>
            <RadioButton
              label="Receptive"
              name="istResultTypeTestendometrial"
              onChange={() => {
                setResultTypeTestendometrial(testEndoTestTypes.Receptive);
              }}
              checked={testEndoReceptType == testEndoTestTypes.Receptive ? true : false}
              disabled={isTestEndoRecept ? false : true}
            />
            <RadioButton
              label="Non-Receptive"
              name="istResultTypeTestendometrial"
              onChange={() => {
                setResultTypeTestendometrial(testEndoTestTypes.NotResponsive);
              }}
              checked={testEndoReceptType == testEndoTestTypes.NotResponsive ? true : false}
              disabled={isTestEndoRecept ? false : true}
            />
          </Grid>

          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "observation" })}
              name="testEndoReceptObservations"
              control={control}
              error={errors.testEndoReceptObservations}
            />
          </Grid>

          <Grid item xs={12}>
            <Box>
              <h3 className="formHeading" style={{ margin: "0px", padding: "0px" }}>
              </h3>
            </Box>
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend"> {formatMessage({ id: "endometrial-biopsy" })}</FormLabel>
            <RadioButton
              label="Yes"
              name="isEndometrialBiopsy"
              onChange={() => {
                setIsEndometrialBiopsy(true);
              }}
              checked={isEndometrialBiopsy}
            />
            <RadioButton
              label="No"
              name="isEndometrialBiopsy"
              onChange={() => {
                setIsEndometrialBiopsy(false);
              }}
              checked={!isEndometrialBiopsy}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={calenderYearOptions}
              label={formatMessage({ id: "year" })}
              name="endometrialBiopsyYearId"
              control={control}
              error={errors.endometrialBiopsyYearId}
              disabled={isEndometrialBiopsy ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend">Result</FormLabel>
            <RadioButton
              label="Normal"
              name="endometrialBiopsyType"
              onChange={() => {
                setEndometrialBiopsyType(complimentaryTestTypes.Normal);
              }}
              checked={endometrialBiopsyType == complimentaryTestTypes.Normal ? true : false}
              disabled={isEndometrialBiopsy ? false : true}
            />
            <RadioButton
              label="Pathological"
              name="endometrialBiopsyType"
              onChange={() => {
                setEndometrialBiopsyType(complimentaryTestTypes.Pathological);
              }}
              checked={endometrialBiopsyType == complimentaryTestTypes.Pathological ? true : false}
              disabled={isEndometrialBiopsy ? false : true}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={endometrialBiopsyPathologicalOptions}
              label={formatMessage({ id: "details" })}
              name="endometrialBiopsyPathologicalId"
              control={control}
              error={errors.endometrialBiopsyPathologicalId}
              disabled={isEndometrialBiopsy && endometrialBiopsyType == complimentaryTestTypes.Pathological ? false : true}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomTextBox
              label={formatMessage({ id: "observation" })}
              name="endometrialBiopsyObservations"
              control={control}
              error={errors.endometrialBiopsyObservations}
            />
          </Grid>
        </Grid>
      </Box>
      {loading || deleteLoading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default ComplimentaryTest;