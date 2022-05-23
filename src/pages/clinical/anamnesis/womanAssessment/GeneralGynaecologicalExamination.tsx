import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";

import { CustomSelect, CustomTextBox, CustomDatePicker, RadioButton } from "components/forms";
import { aboTypeOptions, rhOptions, vaginismTypeOptions, vaginaPathologicalOptions } from "utils/constants";
import { HoverLoader } from "components";
import { masterPaginationServices } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage,useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";

interface Props { }

const GeneralGynaecologicalExamination = (props: Props) => {
  const dispatch = useDispatch();
  const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const [loading, setLoading] = useState(false);
  const [isEditOn, setIsEditOn] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isVaginism, setIsVaginism] = useState(true);
  const [vaginismType, setVaginismType] = useState(1);
  const [pathologicalCervix, setPathologicalCervix] = useState(true);

  let patientId = useGetPatientId();

  const { hirsutismData, galactorrheaData, vaginaData, cervixPathologicalData, raceTypeData, hairTypeData, hairColorData, skinColorData, eyeColorData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      hirsutismData: masterPaginationReducer[masterPaginationServices.hirsutism].data,
      galactorrheaData: masterPaginationReducer[masterPaginationServices.galactorrhea].data,
      vaginaData: masterPaginationReducer[masterPaginationServices.vagina].data,
      cervixPathologicalData: masterPaginationReducer[masterPaginationServices.cervixPathological].data,

      raceTypeData: masterPaginationReducer[masterPaginationServices.raceType].data,
      hairTypeData: masterPaginationReducer[masterPaginationServices.hairType].data,
      hairColorData: masterPaginationReducer[masterPaginationServices.hairColor].data,
      skinColorData: masterPaginationReducer[masterPaginationServices.skinColor].data,
      eyeColorData: masterPaginationReducer[masterPaginationServices.eyeColor].data,
    }),
    shallowEqual
  );

  let hirsutismOptions = hirsutismData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let galactorrheaOptions = galactorrheaData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let vaginaOptions = vaginaData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let cervixPathologicalOptions = cervixPathologicalData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

  let raceTypeOptions = raceTypeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let hairTypeOptions = hairTypeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let hairColorOptions = hairColorData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let skinColorOptions = skinColorData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  let eyeColorOptions = eyeColorData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.hirsutism, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.galactorrhea, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.vagina, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.patient, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.cervixPathological, {}));

    dispatch(getMasterPaginationData(masterPaginationServices.raceType, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.hairType, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.hairColor, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.skinColor, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.eyeColor, {}));
    onEdit();
  }, []);

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    bodyData = {
      ...bodyData,
      patientId: patientId,
      isVaginism: isVaginism,
      pathologicalCervix: pathologicalCervix,
      rh: bodyData.rh ? bodyData.rh == 1 ? true : false : null,
      vaginismType: vaginismType
    }
    setLoading(true);
    let generalGynecologicalExaminationService = services[(isEditOn ? 'updateGeneralGynecologicalExamination' : 'createGeneralGynecologicalExamination') as keyof typeof services];

    generalGynecologicalExaminationService(bodyData)
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
      GeneralGynecologicalExaminationId: patientId
    }
    setDeleteLoading(true);
    services.deleteGeneralGynecologicalExamination(parms)
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
      getGeneralGynecologicalExaminationById: patientId
    };
    setLoading(true);
    services.getGeneralGynecologicalExaminationById(paramsData)
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

  function setFormData(resData: any) {

    let data = {
      ...resData,
      rh: rhOptions?.find((option: any) => option.value == (resData.rh ? resData.rh == true ? 1 : 2 : null)) ?? null,
      aboType: aboTypeOptions?.find((option: any) => option.value == resData.aboType) ?? null,
      cervixPathologicalId: cervixPathologicalOptions?.find((option: any) => option.value == resData.cervixPathologicalId) ?? null,
      vaginaId: vaginaOptions?.find((option: any) => option.value == resData.vaginaId) ?? null,
      galactorrheaId: galactorrheaOptions?.find((option: any) => option.value == resData.galactorrheaId) ?? null,
      hirsutismId: hirsutismOptions?.find((option: any) => option.value == resData.hirsutismId) ?? null,
      vaginaPathological: vaginaPathologicalOptions?.find((option: any) => option.value == resData.vaginaPathological) ?? null,
      raceId: raceTypeOptions?.find((option: any) => option.value == resData.raceId) ?? null,
      hairTypeId: hairTypeOptions?.find((option: any) => option.value == resData.hairTypeId) ?? null,
      hairColorId: hairColorOptions?.find((option: any) => option.value == resData.hairColorId) ?? null,
      eyeColorId: eyeColorOptions?.find((option: any) => option.value == resData.eyeColorId) ?? null,
      skinColorId: skinColorOptions?.find((option: any) => option.value == resData.skinColorId) ?? null,
    }

    reset(data);
    setIsVaginism(resData.isVaginism);
    setPathologicalCervix(resData.pathologicalCervix);
    setVaginismType(resData.vaginismType);
  }

  function resetForm() {
    reset({});
    setIsVaginism(false);
    setPathologicalCervix(false);
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "examination" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      onDelete={onDelete}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h3 className="formHeading" style={{ border: "none" }}>
              <FormattedMessage id="general-examination" />
            </h3>
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomDatePicker
              label={formatMessage({ id: "date" })}
              name="generalExaminationDate"
              control={control}
              error={errors.generalExaminationDate}
              rules={validationRule.textbox({ required: true })}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "height" })}
              name="height"
              control={control}
              error={errors.height}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "weight" })}
              name="weight"
              control={control}
              error={errors.weight}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "bmi" })}
              name="bmi"
              control={control}
              error={errors.bmi}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "respiratory-rate" })}
              name="respiratoryRate"
              control={control}
              error={errors.respiratoryRate}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "systolic-bp" })}
              name="systolicBP"
              control={control}
              error={errors.systolicBP}
            />
          </Grid>

          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "diastolic-bp" })}
              name="diastolicBP"
              control={control}
              error={errors.diastolicBP}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomSelect
              options={hirsutismOptions}
              label={formatMessage({ id: "hirsutism" })}
              name="hirsutismId"
              control={control}
              error={errors.hirsutismId}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomSelect
              options={galactorrheaOptions}
              label={formatMessage({ id: "galactorrhea" })}
              name="galactorrheaId"
              control={control}
              error={errors.galactorrheaId}
            />
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h3 className="formHeading">
              <FormattedMessage id="blood-group" />
            </h3>
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomSelect
              options={aboTypeOptions}
              label={formatMessage({ id: "abo-type" })}
              name="aboType"
              control={control}
              error={errors.aboType}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomSelect
              options={rhOptions}
              label={formatMessage({ id: "rh" })}
              name="rh"
              control={control}
              error={errors.rh}
            />
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h3 className="formHeading">
              <FormattedMessage id="gynaecological-examination" />
            </h3>
          </Grid>

          <Grid item xs={12} lg={2} md={4} sm={6}>
            <FormLabel component="legend">{formatMessage({ id: "vaginism" })}</FormLabel>
            <RadioButton
              label="Yes"
              name="isVaginism"
              onChange={() => {
                setIsVaginism(true);
              }}
              checked={isVaginism}
            />

            <RadioButton
              label="No"
              name="isVaginism"
              onChange={() => {
                setIsVaginism(false);
              }}
              checked={!isVaginism}
            />
          </Grid>
          <Grid item xs={12} lg={4} md={4} sm={6} >
            <FormLabel component="legend">&nbsp;</FormLabel>
            <RadioButton
              label="ANATOMICAL"
              name="vaginismType"
              onChange={() => {
                setVaginismType(vaginismTypeOptions.Anatomical);
              }}
              checked={isVaginism}
            />
            <RadioButton
              label="PSYCHOGENIC"
              name="vaginismType"
              onChange={() => {
                setVaginismType(vaginismTypeOptions.Psychogenic);
              }}
              checked={!isVaginism}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend" style={{ paddingBottom: "5px" }}>{formatMessage({ id: "vagina" })}</FormLabel>
            <CustomSelect
              options={vaginaOptions}
              label={formatMessage({ id: "vagina" })}
              name="vaginaId"
              control={control}
              error={errors.vaginaId}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormLabel component="legend">&nbsp;</FormLabel>
            <CustomSelect
              options={vaginaPathologicalOptions}
              label={formatMessage({ id: "vaginal-septum" })}
              name="vaginaPathological"
              control={control}
              error={errors.vaginaPathological}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6} style={{ alignItems: "center" }} >
            <FormLabel component="legend">{formatMessage({ id: "pathological-cervix" })}</FormLabel>
            <RadioButton
              label="Yes"
              name="pathologicalCervix"
              onChange={() => {
                setPathologicalCervix(true);
              }}
              checked={pathologicalCervix}
            />
            <RadioButton
              label="No"
              name="pathologicalCervix"
              onChange={() => {
                setPathologicalCervix(false);
              }}
              checked={!pathologicalCervix}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={cervixPathologicalOptions}
              label={formatMessage({ id: "cervical-conization" })}
              name="cervixPathologicalId"
              control={control}
              error={errors.cervixPathologicalId}
            />
          </Grid>
          <Grid item xs={12} lg={7} md={12} sm={12}>
            <CustomTextBox
              label={formatMessage({ id: "remarks" })}
              name="otherExamination"
              control={control}
              error={errors.otherExamination}
            />
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <h3 className="formHeading">
              <FormattedMessage id="for-donors-and-receipients" />
            </h3>
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomSelect
              options={raceTypeOptions}
              label={formatMessage({ id: "race" })}
              name="raceId"
              control={control}
              error={errors.raceId}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomSelect
              options={hairTypeOptions}
              label={formatMessage({ id: "hair-type" })}
              name="hairTypeId"
              control={control}
              error={errors.hairTypeId}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomSelect
              options={hairColorOptions}
              label={formatMessage({ id: "hair-color" })}
              name="hairColorId"
              control={control}
              error={errors.hairColorId}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomSelect
              options={eyeColorOptions}
              label={formatMessage({ id: "eye-color" })}
              name="eyeColorId"
              control={control}
              error={errors.eyeColorId}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <CustomSelect
              options={skinColorOptions}
              label={formatMessage({ id: "skin-color" })}
              name="skinColorId"
              control={control}
              error={errors.skinColorId}
            />
          </Grid>
        </Grid>
      </Box>
      {loading || deleteLoading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default GeneralGynaecologicalExamination;
