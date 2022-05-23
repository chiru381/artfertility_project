import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import { CustomSelect, CustomTextBox, CustomCheckBox, RadioButton } from "components/forms";
import { HoverLoader } from "components";
import {
  testiclesPositionLeftRightOptions, testiclesSizeLeftRightOptions, testiclesConsistencyLeftRightOptions, testiclesFeelingLeftRightOptions,
  testiclesVasDeferensLeftRightOptions, testiclesVericoceleLeftRightOptions, epididymisConsistenceLeftRightOptions, epididymisDilatationLeftRightOptions,
  penisEnum, investigationsEnum, suggestedTreatmentEnum
} from "utils/constants";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { useToastMessage,useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";

interface Props { }

const CurrentExamination = (props: Props) => {
  const { handleSubmit, formState: { errors }, control, reset, watch } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const [isEditOn, setIsEditOn] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPhysicalExamination, setIsPhysicalExamination] = useState(true);

  let patientId = useGetPatientId();

  useEffect(() => {
    onEdit();
  }, [])
  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    let manPenises: any;
    let manInvestigations: any;
    let manSuggestedTreatments: any;

    if (bodyData.withoutanomalies) {
      manPenises = [
        { id: bodyData?.currentExaminationOfTheManPenises?.find((item: any) => item.penis === penisEnum.WithoutAnomaly)?.id, penis: penisEnum.WithoutAnomaly }
      ]
    }
    if (bodyData.induration) {
      manPenises = [
        ...manPenises,
        { id: bodyData?.currentExaminationOfTheManPenises?.find((item: any) => item.penis === penisEnum.Induration)?.id, penis: penisEnum.Induration }
      ]
    }
    if (bodyData.phimosis) {
      manPenises = [
        ...manPenises,
        { id: bodyData?.currentExaminationOfTheManPenises?.find((item: any) => item.penis === penisEnum.Phimosis)?.id, penis: penisEnum.Phimosis }
      ]
    }
    if (bodyData.frenulumBreve) {
      manPenises = [
        ...manPenises,
        { id: bodyData?.currentExaminationOfTheManPenises?.find((item: any) => item.penis === penisEnum.FrenulumBreve)?.id, penis: penisEnum.FrenulumBreve }
      ]
    }
    if (bodyData.other) {
      manPenises = [
        ...manPenises,
        { id: bodyData?.currentExaminationOfTheManPenises?.find((item: any) => item.penis === penisEnum.Other)?.id, penis: penisEnum.Other }
      ]
    }
    ///
    if (bodyData.hormonaltreatment) {
      manSuggestedTreatments = [
        { id: bodyData?.currentExaminationOfTheManSuggestedTreatments?.find((item: any) => item.suggestedTreatment === suggestedTreatmentEnum.HormonalTreatment)?.id, suggestedTreatment: suggestedTreatmentEnum.HormonalTreatment }
      ]
    }
    if (bodyData.tese) {
      manSuggestedTreatments = [
        ...manSuggestedTreatments,
        { id: bodyData?.currentExaminationOfTheManSuggestedTreatments?.find((item: any) => item.suggestedTreatment === suggestedTreatmentEnum.TESE)?.id, suggestedTreatment: suggestedTreatmentEnum.TESE }
      ]
    }
    if (bodyData.fna) {
      manSuggestedTreatments = [
        ...manSuggestedTreatments,
        { id: bodyData?.currentExaminationOfTheManSuggestedTreatments?.find((item: any) => item.suggestedTreatment === suggestedTreatmentEnum.FNA)?.id, suggestedTreatment: suggestedTreatmentEnum.FNA }
      ]
    }
    if (bodyData.microtese) {
      manSuggestedTreatments = [
        ...manSuggestedTreatments,
        { id: bodyData?.currentExaminationOfTheManSuggestedTreatments?.find((item: any) => item.suggestedTreatment === suggestedTreatmentEnum.MicroTESE)?.id, suggestedTreatment: suggestedTreatmentEnum.MicroTESE }
      ]
    }

    /////
    if (bodyData.spermanalysis) {
      manInvestigations = [
        { id: bodyData?.currentExaminationOfTheManInvestigations?.find((item: any) => item.investigation === investigationsEnum.SpermAnalysis)?.id, investigation: investigationsEnum.SpermAnalysis }
      ]
    }
    if (bodyData.karyotype) {
      manInvestigations = [
        ...manInvestigations,
        { id: bodyData?.currentExaminationOfTheManInvestigations?.find((item: any) => item.investigation === investigationsEnum.Karyotype)?.id, investigation: investigationsEnum.Karyotype }
      ]
    }
    if (bodyData.fshtestosterone) {
      manInvestigations = [
        ...manInvestigations,
        { id: bodyData?.currentExaminationOfTheManInvestigations?.find((item: any) => item.investigation === investigationsEnum.FSHTestosterone)?.id, investigation: investigationsEnum.FSHTestosterone }
      ]
    }
    if (bodyData.yqdeletion) {
      manInvestigations = [
        ...manInvestigations,
        { id: bodyData?.currentExaminationOfTheManInvestigations.find((item: any) => item.investigation === investigationsEnum.YQdeletion)?.id, investigation: investigationsEnum.YQdeletion }
      ]
    }
    ///

    bodyData = {
      ...bodyData,
      id: patientId,
      isPhysicalExamination: isPhysicalExamination,
      currentExaminationOfTheManSuggestedTreatments: manSuggestedTreatments?.length > 0 ? manSuggestedTreatments : [],
      currentExaminationOfTheManPenises: manPenises?.length > 0 ? manPenises : [],
      currentExaminationOfTheManInvestigations: manInvestigations?.length > 0 ? manInvestigations : [],
    };

    setLoading(true);

    let currentExaminationOfTheManService = services[(isEditOn ? 'updateCurrentExaminationOfTheMan' : 'createCurrentExaminationOfTheMan') as keyof typeof services];

    currentExaminationOfTheManService(bodyData)
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
      CurrentExaminationOfTheManId: patientId
    }
    setDeleteLoading(true);
    services.deleteCurrentExaminationOfTheMan(parms)
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
      CurrentExaminationOfTheManId: patientId
    };
    setLoading(true);
    services.getCurrentExaminationOfTheManById(paramsData)
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
      consistenceLeft: epididymisConsistenceLeftRightOptions?.find((item: any) => item.value == resData?.consistenceLeft) ?? null,
      consistenceRight: epididymisConsistenceLeftRightOptions?.find((item: any) => item.value == resData?.consistenceRight) ?? null,
      consistencyLeft: testiclesConsistencyLeftRightOptions?.find((item: any) => item.value == resData?.consistencyLeft) ?? null,
      consistencyRight: testiclesConsistencyLeftRightOptions?.find((item: any) => item.value == resData?.consistencyRight) ?? null,
      dilatationLeft: epididymisDilatationLeftRightOptions?.find((item: any) => item.value == resData?.dilatationLeft) ?? null,
      dilatationRight: epididymisDilatationLeftRightOptions?.find((item: any) => item.value == resData?.dilatationRight) ?? null,
      epididymisFeelingLeft: testiclesFeelingLeftRightOptions?.find((item: any) => item.value == resData?.epididymisFeelingLeft) ?? null,
      epididymisFeelingRight: testiclesFeelingLeftRightOptions?.find((item: any) => item.value == resData?.epididymisFeelingRight) ?? null,
      feelingLeft: testiclesFeelingLeftRightOptions?.find((item: any) => item.value == resData?.feelingLeft) ?? null,
      feelingRight: testiclesFeelingLeftRightOptions?.find((item: any) => item.value == resData?.feelingRight) ?? null,
      partialAbsenceLeft: epididymisConsistenceLeftRightOptions?.find((item: any) => item.value == resData?.partialAbsenceLeft) ?? null,
      partialAbsenceRight: epididymisConsistenceLeftRightOptions?.find((item: any) => item.value == resData?.partialAbsenceRight) ?? null,
      positionLeft: testiclesPositionLeftRightOptions?.find((item: any) => item.value == resData?.positionLeft) ?? null,
      positionRight: testiclesPositionLeftRightOptions?.find((item: any) => item.value == resData?.positionRight) ?? null,
      sizeLeft: testiclesSizeLeftRightOptions?.find((item: any) => item.value == resData?.sizeLeft) ?? null,
      sizeRight: testiclesSizeLeftRightOptions?.find((item: any) => item.value == resData?.sizeRight) ?? null,
      vasDeferensLeft: testiclesVasDeferensLeftRightOptions?.find((item: any) => item.value == resData?.vasDeferensLeft) ?? null,
      vasDeferensRight: testiclesVasDeferensLeftRightOptions?.find((item: any) => item.value == resData?.vasDeferensRight) ?? null,
      vericoceleLeft: testiclesVericoceleLeftRightOptions?.find((item: any) => item.value == resData?.vericoceleLeft) ?? null,
      vericoceleRight: testiclesVericoceleLeftRightOptions?.find((item: any) => item.value == resData?.vericoceleRight) ?? null,
    };

    reset(
      {
        ...data,
        withoutanomalies: data.currentExaminationOfTheManPenises.some((item: any) => item.penis === penisEnum.WithoutAnomaly),
        induration: data.currentExaminationOfTheManPenises.some((item: any) => item.penis === penisEnum.Induration),
        phimosis: data.currentExaminationOfTheManPenises.some((item: any) => item.penis === penisEnum.Phimosis),
        frenulumBreve: data.currentExaminationOfTheManPenises.some((item: any) => item.penis === penisEnum.FrenulumBreve),
        other: data.currentExaminationOfTheManPenises.some((item: any) => item.penis === penisEnum.Other),

        hormonaltreatment: data.currentExaminationOfTheManSuggestedTreatments.some((item: any) => item.suggestedTreatment === suggestedTreatmentEnum.HormonalTreatment),
        tese: data.currentExaminationOfTheManSuggestedTreatments.some((item: any) => item.suggestedTreatment === suggestedTreatmentEnum.TESE),
        fna: data.currentExaminationOfTheManSuggestedTreatments.some((item: any) => item.suggestedTreatment === suggestedTreatmentEnum.FNA),
        microtese: data.currentExaminationOfTheManSuggestedTreatments.some((item: any) => item.suggestedTreatment === suggestedTreatmentEnum.MicroTESE),

        spermanalysis: data.currentExaminationOfTheManInvestigations.some((item: any) => item.investigation === investigationsEnum.SpermAnalysis),
        karyotype: data.currentExaminationOfTheManInvestigations.some((item: any) => item.investigation === investigationsEnum.Karyotype),
        fshtestosterone: data.currentExaminationOfTheManInvestigations.some((item: any) => item.investigation === investigationsEnum.FSHTestosterone),
        yqdeletion: data.currentExaminationOfTheManInvestigations.some((item: any) => item.investigation === investigationsEnum.YQdeletion),
      }
    );

    setIsPhysicalExamination(resData.isPhysicalExamination)
  }

  function resetForm() {
    reset({});
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "current-examination" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      onDelete={onDelete}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6} md={6} sm={6}>
            <CustomTextBox
              label={formatMessage({ id: "general-condition" })}
              name="generalAppearance"
              control={control}
              error={errors.generalAppearance}
              rules={validationRule.textbox({ type: "textWithNumber", maxLength: 100 })}
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
          <Grid item xs={12} lg={12} md={4} sm={6} style={{ display: "flex", alignItems: "center" }}>
            <FormLabel component="legend" style={{ paddingRight: "5px" }}>{formatMessage({ id: "physical-examination" })}:</FormLabel>
            <RadioButton
              label="Yes"
              name="isPhysicalExamination"
              onChange={() => {
                setIsPhysicalExamination(true);
              }}
              checked={isPhysicalExamination}
            />
            <RadioButton
              label="No"
              name="isPhysicalExamination"
              onChange={() => {
                setIsPhysicalExamination(false);
              }}
              checked={!isPhysicalExamination}
            />
          </Grid>

          <Grid item xs={12} lg={6} md={12} sm={12}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "10%", textAlign: "center" }} colSpan={3}><FormattedMessage id="testicles" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover role="checkbox">
                    <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}></TableCell>
                    <TableCell align="center"><FormattedMessage id="right" /></TableCell>
                    <TableCell align="center"><FormattedMessage id="left" /></TableCell>
                  </TableRow>

                  <TableRow hover role="checkbox">
                    <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}><FormattedMessage id="position" /></TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={testiclesPositionLeftRightOptions}
                        name="positionRight"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={testiclesPositionLeftRightOptions}
                        name="positionLeft"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox">
                    <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}><FormattedMessage id="size" /></TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={testiclesSizeLeftRightOptions}
                        name="sizeRight"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={testiclesSizeLeftRightOptions}
                        name="sizeLeft"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox">
                    <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}><FormattedMessage id="consistence" /></TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={testiclesConsistencyLeftRightOptions}
                        name="consistencyRight"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={testiclesConsistencyLeftRightOptions}
                        name="consistencyLeft"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox">
                    <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}><FormattedMessage id="feeling" /></TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={testiclesFeelingLeftRightOptions}
                        name="feelingRight"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={testiclesFeelingLeftRightOptions}
                        name="feelingLeft"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} lg={6} md={12} sm={12} >
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "10%", textAlign: "center" }} colSpan={3}><FormattedMessage id="epididymis" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover role="checkbox">
                    <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}></TableCell>
                    <TableCell align="center"><FormattedMessage id="right" /></TableCell>
                    <TableCell align="center"><FormattedMessage id="left" /></TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox">
                    <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}><FormattedMessage id="consistence" /></TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={epididymisConsistenceLeftRightOptions}
                        name="consistenceRight"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={epididymisConsistenceLeftRightOptions}
                        name="consistenceLeft"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox">
                    <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}><FormattedMessage id="dilatation" /></TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={epididymisDilatationLeftRightOptions}
                        name="dilatationRight"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={epididymisDilatationLeftRightOptions}
                        name="dilatationLeft"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox">
                    <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}><FormattedMessage id="feeling" /></TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={testiclesFeelingLeftRightOptions}
                        name="epididymisFeelingRight"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={testiclesFeelingLeftRightOptions}
                        name="epididymisFeelingLeft"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox">
                    <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}><FormattedMessage id="partial-absence" /></TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={epididymisDilatationLeftRightOptions}
                        name="partialAbsenceRight"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={epididymisConsistenceLeftRightOptions}
                        name="partialAbsenceLeft"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} lg={6} md={12} sm={12}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "10%", textAlign: "center" }} colSpan={2}><FormattedMessage id="vas-deferens" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover role="checkbox">
                    <TableCell align="center"><FormattedMessage id="right" /></TableCell>
                    <TableCell align="center"><FormattedMessage id="left" /></TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox">
                    <TableCell align="center">
                      <CustomSelect
                        options={testiclesVasDeferensLeftRightOptions}
                        name="vasDeferensRight"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={testiclesVasDeferensLeftRightOptions}
                        name="vasDeferensLeft"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} lg={6} md={12} sm={12}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "10%", textAlign: "center" }} colSpan={2}><FormattedMessage id="varicocele" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover role="checkbox">
                    <TableCell align="center"><FormattedMessage id="right" /></TableCell>
                    <TableCell align="center"><FormattedMessage id="left" /></TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox">
                    <TableCell align="center">
                      <CustomSelect
                        options={testiclesVericoceleLeftRightOptions}
                        name="vericoceleRight"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        options={testiclesVericoceleLeftRightOptions}
                        name="vericoceleLeft"
                        control={control}
                        disabled={isPhysicalExamination ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <TableContainer style={{ marginTop: "20px" }}>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "10%" }}><FormattedMessage id="penis" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ border: "1px solid grey", padding: "5px" }}>
                  <div>
                    <CustomCheckBox
                      name="withoutanomalies"
                      label={formatMessage({ id: "without-anomalies" })}
                      control={control}
                    />
                    <CustomCheckBox
                      name="induration"
                      label={formatMessage({ id: "induration" })}
                      control={control}
                    />
                    <CustomCheckBox
                      name="phimosis"
                      label={formatMessage({ id: "phimosis" })}
                      control={control}
                    />
                    <CustomCheckBox
                      name="frenulumBreve"
                      label={formatMessage({ id: "phrenulum-breve" })}
                      control={control}
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    <CustomCheckBox
                      name="other"
                      label={formatMessage({ id: "other" })}
                      control={control}
                    />
                    <CustomTextBox
                      name="otherSpecify"
                      label={formatMessage({ id: "other-specify" })}
                      control={control}
                      error={errors.otherSpecify}
                      rules={validationRule.textbox({ maxLength: 50 })}
                      disabled={watch("other") ? false : true}
                    />
                  </div>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <CustomTextBox
              label={formatMessage({ id: "observations" })}
              name="currentExaminationObservation"
              control={control}
              error={errors.currentExaminationObservation}
              rules={validationRule.textbox({ maxLength: 100 })}
            />
          </Grid>

          <Grid item xs={6} lg={6} md={6} sm={6} style={{ display: "flex" }}>
            <TableContainer style={{ marginTop: "20px" }}>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "10%", textAlign: "center" }}>
                      <FormattedMessage id="investigations" />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <div>
                    <CustomCheckBox
                      name="spermanalysis"
                      label={formatMessage({ id: "sperm-analysis" })}
                      control={control}
                    />
                    <CustomCheckBox
                      name="karyotype"
                      label={formatMessage({ id: "karyotype" })}
                      control={control}
                    />
                    <CustomCheckBox
                      name="fshtestosterone"
                      label={formatMessage({ id: "fsh-testosterone" })}
                      control={control}
                    />
                    <CustomCheckBox
                      name="yqdeletion"
                      label={formatMessage({ id: "y-q-deletion" })}
                      control={control}
                    />
                  </div>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={6} lg={6} md={6} sm={6}>
            <TableContainer style={{ marginTop: "20px" }}>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "10%", textAlign: "center" }}>
                      <FormattedMessage id="suggested-treatment" />
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <div>
                    <CustomCheckBox
                      name="hormonaltreatment"
                      label={formatMessage({ id: "hormonal-treatment" })}
                      control={control}
                    />
                    <CustomCheckBox
                      name="tese"
                      label={formatMessage({ id: "tese" })}
                      control={control}
                    />
                    <CustomCheckBox
                      name="fna"
                      label={formatMessage({ id: "fna" })}
                      control={control}
                    />
                    <CustomCheckBox
                      name="microtese"
                      label={formatMessage({ id: "micro-tese" })}
                      control={control}
                    />
                  </div>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "15px", float: "right" }}
            >
              <FormattedMessage id={"place-order"} />
            </Button>
          </Grid>
        </Grid>
      </Box>
      {loading || deleteLoading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default CurrentExamination;
