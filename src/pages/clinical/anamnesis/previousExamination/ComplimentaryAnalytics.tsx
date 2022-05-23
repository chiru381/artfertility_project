import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";

import { CustomSelect, CustomTextBox, RadioButton, CustomDatePicker } from "components/forms";
import { HoverLoader } from "components";
import {
  yesNoOptions, positiveNegativeOptions,
  complimentaryAnalyticThrombophiliaOptions, testResultTypeOptions, normalAbnormalOptions
} from "utils/constants";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";

interface Props { }

const ComplimentaryAnalytics = (props: Props) => {
  const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const [isEditOn, setIsEditOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isComplementaryAnalytic, setIsComplementaryAnalytic] = useState(true);
  const [isBiochemistry, setIsBiochemistry] = useState(true);
  const [isHaematology, setIsHaematology] = useState(true);
  const [isSerology, setIsSerology] = useState(true);
  const [isGenetic, setIsGenetic] = useState(true);
  const [isCoagulation, setIsCoagulation] = useState(true);
  const [isImmunology, setIsImmunology] = useState(true);

  const { fields, append, remove } = useFieldArray({ control, name: "complementaryAnalyticBiochemistry" });
  const complementaryAnalyticHaematology = useFieldArray({ control, name: "complementaryAnalyticHaematology" });
  const complementaryAnalyticSerology = useFieldArray({ control, name: "complementaryAnalyticSerology" });
  const complementaryAnalyticGenetic = useFieldArray({ control, name: "complementaryAnalyticGenetic" });
  const complementaryAnalyticCoagulation = useFieldArray({ control, name: "complementaryAnalyticCoagulation" });
  const complementaryAnalyticImmunology = useFieldArray({ control, name: "complementaryAnalyticImmunology" });

  let patientId = useGetPatientId();

  useEffect(() => {
    onEdit();
  }, []);

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    let haematologyList = bodyData?.complementaryAnalyticHaematology ? getFormBody(bodyData?.complementaryAnalyticHaematology[0]) : null;
    let serologList = bodyData?.complementaryAnalyticSerology ? getFormBody(bodyData?.complementaryAnalyticSerology[0]) : null;

    if (haematologyList) {
      haematologyList = {
        ...haematologyList,
        coombsdirect: haematologyList?.coombsdirect == 1 ? true : haematologyList?.coombsdirect == 2 ? false : haematologyList?.coombsdirect,
        coombsindirect: haematologyList?.coombsindirect == 1 ? true : haematologyList?.coombsindirect == 2 ? false : haematologyList?.coombsindirect,
        haemoglobinelectrophoresis: haematologyList?.haemoglobinelectrophoresis == 1 ? true : haematologyList?.haemoglobinelectrophoresis == 2 ? false : haematologyList?.haemoglobinelectrophoresis,
      };
    }

    let geneticList = bodyData?.complementaryAnalyticGenetic ? getFormBody(bodyData?.complementaryAnalyticGenetic[0]) : null;
    if (geneticList) {
      geneticList = {
        ...geneticList,
        karyotype: geneticList?.karyotype == 1 ? true : geneticList?.karyotype == 2 ? false : geneticList?.karyotype,
        prothrombinGene: geneticList?.prothrombinGene == 1 ? true : geneticList?.prothrombinGene == 2 ? false : geneticList?.prothrombinGene,
        mthfrGene: geneticList?.mthfrGene == 1 ? true : geneticList?.mthfrGene == 2 ? false : geneticList?.mthfrGene,
        factorVMutation: geneticList?.factorVMutation == 1 ? true : geneticList?.factorVMutation == 2 ? false : geneticList?.factorVMutation,
        xFragileMutation: geneticList?.xFragileMutation == 1 ? true : geneticList?.xFragileMutation == 2 ? false : geneticList?.xFragileMutation,
        ctrfMutation: geneticList?.ctrfMutation == 1 ? true : geneticList?.ctrfMutation == 2 ? false : geneticList?.ctrfMutation
      };
    }

    let immunologyList = bodyData?.complementaryAnalyticGenetic ? getFormBody(bodyData?.complementaryAnalyticGenetic[0]) : null;
    if (immunologyList) {
      immunologyList = {
        ...immunologyList,
        anitB2GPIgG: immunologyList?.anitB2GPIgG == 1 ? true : immunologyList?.anitB2GPIgG == 2 ? false : immunologyList?.anitB2GPIgG,
        anitB2GPIgM: immunologyList?.anitB2GPIgM == 1 ? true : immunologyList?.anitB2GPIgM == 2 ? false : immunologyList?.anitB2GPIgM,
      };
    }

    bodyData = {
      ...bodyData,
      id: patientId,
      isComplementaryAnalytic: isComplementaryAnalytic,
      isBiochemistry: isBiochemistry,
      isHaematology: isHaematology,
      isSerology: isSerology,
      isGenetic: isGenetic,
      isCoagulation: isCoagulation,
      isImmunology: isImmunology,
      complementaryAnalyticBiochemistry: isBiochemistry && bodyData?.complementaryAnalyticBiochemistry ? bodyData?.complementaryAnalyticBiochemistry[0] : null,
      complementaryAnalyticHaematology: isHaematology ? haematologyList : null,
      complementaryAnalyticSerology: isSerology ? serologList : null,
      complementaryAnalyticGenetic: isGenetic ? geneticList : null,
      complementaryAnalyticCoagulation: isCoagulation && bodyData?.complementaryAnalyticCoagulation ? bodyData?.complementaryAnalyticCoagulation[0] : null,
      complementaryAnalyticImmunology: isImmunology ? immunologyList : null
    };

    setLoading(true);

    let complimentoryAnalyticService = services[(isEditOn ? 'updateComplimentoryAnalytic' : 'createComplimentoryAnalytic') as keyof typeof services];

    complimentoryAnalyticService(bodyData)
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
      ComplementaryAnalyticId: patientId
    }
    setDeleteLoading(true);
    services.deleteComplimentoryAnalytic(parms)
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
      ComplementaryAnalyticId: patientId
    };
    setLoading(true);
    services.getComplimentoryAnalyticByAnalyticId(paramsData)
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

    let complementaryAnalyticHaematologyList = {
      ...resData?.complementaryAnalyticHaematology,
      coombsdirect: positiveNegativeOptions?.find((item: any) => item.value == (resData?.complementaryAnalyticHaematology?.coombsdirect == true ? 1 : resData?.complementaryAnalyticHaematology?.coombsdirect == false ? 2 : 0)) ?? null,
      coombsindirect: positiveNegativeOptions?.find((item: any) => item.value == (resData?.complementaryAnalyticHaematology?.coombsindirect == true ? 1 : resData?.complementaryAnalyticHaematology?.coombsindirect == false ? 2 : 0)) ?? null,
      haemoglobinelectrophoresis: yesNoOptions?.find((item: any) => item.value == (resData?.complementaryAnalyticHaematology?.haemoglobinelectrophoresis == true ? 1 : resData?.complementaryAnalyticHaematology?.haemoglobinelectrophoresis == false ? 2 : 0)) ?? null
    };

    let complementaryAnalyticGeneticList = {
      ...resData?.complementaryAnalyticGenetic,
      karyotype: normalAbnormalOptions?.find((item: any) => item.value == (resData?.complementaryAnalyticGenetic?.karyotype == true ? 1 : resData?.complementaryAnalyticGenetic?.karyotype == false ? 2 : 0)) ?? null,
      prothrombinGene: normalAbnormalOptions?.find((item: any) => item.value == (resData?.complementaryAnalyticGenetic?.prothrombinGene == true ? 1 : resData?.complementaryAnalyticGenetic?.prothrombinGene == false ? 2 : 0)) ?? null,
      mthfrGene: normalAbnormalOptions?.find((item: any) => item.value == (resData?.complementaryAnalyticGenetic?.mthfrGene == true ? 1 : resData?.complementaryAnalyticGenetic?.mthfrGene == false ? 2 : 0)) ?? null,
      factorVMutation: positiveNegativeOptions?.find((item: any) => item.value == (resData?.complementaryAnalyticGenetic?.factorVMutation == true ? 1 : resData?.complementaryAnalyticGenetic?.factorVMutation == false ? 2 : 0)) ?? null,
      xFragileMutation: normalAbnormalOptions?.find((item: any) => item.value == (resData?.complementaryAnalyticGenetic?.xFragileMutation == true ? 1 : resData?.complementaryAnalyticGenetic?.xFragileMutation == false ? 2 : 0)) ?? null,
      ctrfMutation: normalAbnormalOptions?.find((item: any) => item.value == (resData?.complementaryAnalyticGenetic?.ctrfMutation == true ? 1 : resData?.complementaryAnalyticGenetic?.ctrfMutation == false ? 2 : 0)) ?? null,
    };

    let complementaryAnalyticImmunologyList = {
      ...resData?.complementaryAnalyticImmunology,
      anitB2GPIgG: positiveNegativeOptions?.find((item: any) => item.value == (resData?.complementaryAnalyticImmunology?.anitB2GPIgG == true ? 1 : resData?.complementaryAnalyticImmunology?.anitB2GPIgG == false ? 2 : 0)) ?? null,
      anitB2GPIgM: positiveNegativeOptions?.find((item: any) => item.value == (resData?.complementaryAnalyticImmunology?.anitB2GPIgM == true ? 1 : resData?.complementaryAnalyticImmunology?.anitB2GPIgM == false ? 2 : 0)) ?? null,
    };

    let data = {
      ...resData,
      complementaryAnalyticBiochemistry: [resData?.complementaryAnalyticBiochemistry],
      complementaryAnalyticHaematology: [complementaryAnalyticHaematologyList],
      complementaryAnalyticSerology: [resData?.complementaryAnalyticSerology],
      complementaryAnalyticGenetic: [complementaryAnalyticGeneticList],
      complementaryAnalyticCoagulation: [resData?.complementaryAnalyticCoagulation],
      complementaryAnalyticImmunology: [complementaryAnalyticImmunologyList],
      thrombophiliaId: complimentaryAnalyticThrombophiliaOptions?.find((item: any) => item.value == resData?.thrombophiliaId) ?? null,
    }
    reset(data);
    setIsComplementaryAnalytic(resData.isComplementaryAnalytic);
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "complimentary-analytics" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      onDelete={onDelete}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={2} md={4} sm={12} style={{ display: "flex", alignItems: "center" }}>
            <RadioButton
              label="Yes"
              name="isComplementaryAnalytic"
              onChange={() => {
                setIsComplementaryAnalytic(true);

                setIsBiochemistry(true);
                setIsHaematology(true);
                setIsSerology(true);
                setIsGenetic(true);
                setIsCoagulation(true);
                setIsImmunology(true);
              }}
              checked={isComplementaryAnalytic}
            />
            <RadioButton
              label="No"
              name="isComplementaryAnalytic"
              onChange={() => {
                setIsComplementaryAnalytic(false);

                setIsBiochemistry(false);
                setIsHaematology(false);
                setIsSerology(false);
                setIsGenetic(false);
                setIsCoagulation(false);
                setIsImmunology(false);
              }}
              checked={!isComplementaryAnalytic}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={12}>
            <CustomSelect
              options={complimentaryAnalyticThrombophiliaOptions}
              label={formatMessage({ id: "thrombophilia" })}
              name="thrombophiliaId"
              control={control}
              error={errors.thrombophiliaId}
              disabled={isComplementaryAnalytic ? false : true}
            />
          </Grid>
          <Grid item xs={12} lg={8} md={12} sm={12}>
            <CustomTextBox
              label={formatMessage({ id: "observations" })}
              name="observations"
              control={control}
              error={errors.observations}
              rules={validationRule.textbox({ maxLength: 200 })}
            />
          </Grid>
          <Grid item xs={12} lg={6} md={12} sm={12}>
            <Grid item xs={12}>
              <Box>
                <h3 className="formHeading" style={{ borderTop: "none" }}>
                  <FormattedMessage id="biochemistry" />
                  <RadioButton
                    label="Yes"
                    name="isBiochemistry"
                    onChange={() => {
                      setIsBiochemistry(true);
                    }}
                    checked={isBiochemistry}
                    style={{ marginLeft: "5px" }}
                    disabled={isComplementaryAnalytic ? false : true}
                  />
                  <RadioButton
                    label="No"
                    name="isBiochemistry"
                    onChange={() => {
                      setIsBiochemistry(false);
                    }}
                    checked={!isBiochemistry}
                    disabled={isComplementaryAnalytic ? false : true}
                  />
                </h3>
              </Box>
            </Grid>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow style={{ border: "1px solid black" }}>
                    <TableCell style={{ width: "20%" }}></TableCell>
                    <TableCell style={{ width: "20%" }} align="center"><FormattedMessage id="test-result" /></TableCell>
                    <TableCell style={{ width: "20%" }} align="center"><FormattedMessage id="date" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>Blood Glucose Fasting</TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][bloodGlucoseFasting]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["bloodGlucoseFasting"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][bloodGlucoseFastingDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["bloodGlucoseFastingDate"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>S-Urea</TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][sUrea]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["sUrea"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][sUreaDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["sUreaDate"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      S-Creatinine
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][sCreatinine]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["sCreatinine"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][sCreatinineDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["sCreatinineDate"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      SGOT
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][sgot]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["sgot"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][sgotDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["sgotDate"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      SGPT
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][sgpt]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["sgpt"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][sgptDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["sgptDate"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      ggt
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][ggt]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["ggt"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][ggtDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["ggtDate"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Alkaline Phosphatase
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][alkalinePhosphatase]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["alkalinePhosphatase"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][alkalinePhosphataseDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["alkalinePhosphataseDate"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Phosphorus
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][phosphorus]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["phosphorus"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][phosphorusDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["phosphorusDate"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Plasmatic Homocystine
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][plasmaticHomocystine]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["plasmaticHomocystine"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][plasmaticHomocystineDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["plasmaticHomocystineDate"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Total Protein Serum
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][totalProteinSerum]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["totalProteinSerum"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][totalProteinSerumDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["totalProteinSerumDate"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Vitamin D total
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][vitaminDTotal]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["vitaminDTotal"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][vitaminDTotalDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["vitaminDTotalDate"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      PTOG 2h
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][ptoG2h]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["ptoG2h"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][ptoG2h]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["ptoG2h"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Blood Glucose Fasting GTT
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][bloodGlucoseFastingGTT]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["bloodGlucoseFastingGTT"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][bloodGlucoseFastingGTTDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["bloodGlucoseFastingGTTDate"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Blood Glucose 60 min GTT
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][bloodGlucose60minGTT]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["bloodGlucose60minGTT"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][bloodGlucose60minGTTDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["bloodGlucose60minGTTDate"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Blood Glucose 120 min GTT
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticBiochemistry[0][bloodGlucose120MinGTT]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["bloodGlucose120MinGTT"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticBiochemistry[0][bloodGlucose120MinGTTDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticBiochemistry`]?.[0]?.["bloodGlucose120MinGTTDate"]}
                        disabled={isBiochemistry ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} lg={6} md={12} sm={12}>
            <Grid item xs={12}>
              <Box>
                <h3 className="formHeading" style={{ borderTop: "none" }}>
                  <FormattedMessage id="haematology" />
                  <RadioButton
                    label="Yes"
                    name="isHaematology"
                    onChange={() => {
                      setIsHaematology(true);
                    }}
                    checked={isHaematology}
                    style={{ marginLeft: "5px" }}
                    disabled={isComplementaryAnalytic ? false : true}
                  />
                  <RadioButton
                    label="No"
                    name="isHaematology"
                    onChange={() => {
                      setIsHaematology(false);
                    }}
                    checked={!isHaematology}
                    disabled={isComplementaryAnalytic ? false : true}
                  />
                </h3>
              </Box>
            </Grid>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small" >
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "20%" }}></TableCell>
                    <TableCell style={{ width: "20%" }} align="center"><FormattedMessage id="test-result" /></TableCell>
                    <TableCell style={{ width: "20%" }} align="center"><FormattedMessage id="date" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>Coombs Direct</TableCell>
                    <TableCell>
                      <CustomSelect
                        options={positiveNegativeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][coombsdirect]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["coombsdirect"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][coombsdirectDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["coombsdirectDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Coombs Indirect
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={positiveNegativeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][coombsindirect]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["coombsindirect"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][coombsindirectDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["coombsindirectDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Hemoglobin Electrophoresis
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={yesNoOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][haemoglobinelectrophoresis]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["haemoglobinelectrophoresis"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][haemoglobinelectrophoresisDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["haemoglobinelectrophoresisDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Leucocytes
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][leucocytes]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["leucocytes"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][leucocytesDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["leucocytesDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      RBC-Red Blood Cells
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][rbc]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["rbc"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][rbcDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["rbcDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      HB
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][hb]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["hb"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][hbDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["hbDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      HcT
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][hcT]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["hcT"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][hcTDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["hcTDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Platelets
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][platelets]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["platelets"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][plateletsDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["plateletsDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Lymphocte
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][lymphocte]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["lymphocte"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        name={`complementaryAnalyticHaematology[0][lymphocteDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["lymphocteDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Monocyte
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][monocyte]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["monocyte"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][monocyteDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["monocyteDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Basophil
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][basophil]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["basophil"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][basophilDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["basophilDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Eosinophil
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][eosinophil]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["eosinophil"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][eosinophilDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["eosinophilDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      MCV
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][mcv]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["mcv"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][mcvDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["mcvDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      MCH
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][mch]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["mch"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][mchDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["mchDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      MCHC
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][mchc]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["mchc"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][mchcDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["mchcDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      RDW
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][rdw]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["rdw"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][rdwDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["rdwDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Netrophils
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        name={`complementaryAnalyticHaematology[0][neutrophils]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["neutrophils"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`complementaryAnalyticHaematology[0][neutrophilsDate]`}
                        control={control}
                        error={errors?.[`complementaryAnalyticHaematology`]?.[0]?.["neutrophilsDate"]}
                        disabled={isHaematology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} lg={6} md={12} sm={12}>
            <Grid item xs={12}>
              <Box>
                <h3 className="formHeading">
                  <FormattedMessage id="serology" />
                  <RadioButton
                    label="Yes"
                    name="isSerology"
                    onChange={() => {
                      setIsSerology(true);
                    }}
                    checked={isSerology}
                    style={{ marginLeft: "5px" }}
                    disabled={isComplementaryAnalytic ? false : true}
                  />
                  <RadioButton
                    label="No"
                    name="isSerology"
                    onChange={() => {
                      setIsSerology(false);
                    }}
                    checked={!isSerology}
                    disabled={isComplementaryAnalytic ? false : true}
                  />
                </h3>
              </Box>
            </Grid>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "20%" }}></TableCell>
                    <TableCell style={{ width: "20%" }} align="center"><FormattedMessage id="test-result" /></TableCell>
                    <TableCell style={{ width: "20%" }} align="center"><FormattedMessage id="date" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>CMV lgG</TableCell>
                    <TableCell>
                      <CustomSelect
                        options={testResultTypeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticSerology[0][cmvIgG]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["cmvIgG"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticSerology[0][cmvIgGDate]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["cmvIgGDate"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      CMV lgM
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={testResultTypeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticSerology[0][cmvIgM]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["cmvIgM"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticSerology[0][cmvIgMDate]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["cmvIgMDate"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      HbSAg
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={testResultTypeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticSerology[0][hbSAg]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["hbSAg"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticSerology[0][hbSAgDate]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["hbSAgDate"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Anti-HCV
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={testResultTypeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticSerology[0][antiHCV]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["antiHCV"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticSerology[0][antiHCVDate]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["antiHCVDate"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      HIV Ag-Ab
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={testResultTypeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticSerology[0][hivAgAb]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["hivAgAb"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticSerology[0][hivAgAbDate]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["hivAgAbDate"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Rubella lgG
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={testResultTypeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticSerology[0][rubellaIgG]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["rubellaIgG"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticSerology[0][rubellaIgGDate]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["rubellaIgGDate"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Rubella lgM
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={testResultTypeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticSerology[0][rubellaIgM]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["rubellaIgM"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticSerology[0][rubellaIgMDate]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["rubellaIgMDate"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Toxo lgG
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={testResultTypeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticSerology[0][toxoIgG]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["toxoIgG"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticSerology[0][toxoIgGDate]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["toxoIgGDate"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Toxo lgM
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={testResultTypeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticSerology[0][toxoIgM]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["toxoIgM"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticSerology[0][toxoIgMDate]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["toxoIgMDate"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Chlamydia lgG
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={testResultTypeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticSerology[0][chlamydiaIgG]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["chlamydiaIgG"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticSerology[0][chlamydiaIgGDate]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["chlamydiaIgGDate"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Chlamydia lgM
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={testResultTypeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticSerology[0][chlamydiaIgM]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["chlamydiaIgM"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticSerology[0][chlamydiaIgMDate]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["chlamydiaIgMDate"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Syphilis
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={testResultTypeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticSerology[0][syphilis]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["syphilis"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticSerology[0][syphilisDate]`}
                        error={errors?.[`complementaryAnalyticSerology`]?.[0]?.["syphilisDate"]}
                        disabled={isSerology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} lg={6} md={12} sm={12}>
            <Grid item xs={12}>
              <Box>
                <h3 className="formHeading">
                  <FormattedMessage id="genetics" />
                  <RadioButton
                    label="Yes"
                    name="isGenetic"
                    onChange={() => {
                      setIsGenetic(true);
                    }}
                    checked={isGenetic}
                    style={{ marginLeft: "5px" }}
                    disabled={isComplementaryAnalytic ? false : true}
                  />
                  <RadioButton
                    label="No"
                    name="isGenetic"
                    onChange={() => {
                      setIsGenetic(false);
                    }}
                    checked={!isGenetic}
                    disabled={isComplementaryAnalytic ? false : true}
                  />
                </h3>
              </Box>
            </Grid>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "20%" }}></TableCell>
                    <TableCell style={{ width: "20%" }} align="center"><FormattedMessage id="test-result" /></TableCell>
                    <TableCell style={{ width: "20%" }} align="center"><FormattedMessage id="date" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>Karyotype</TableCell>
                    <TableCell>
                      <CustomSelect
                        options={normalAbnormalOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticGenetic[0][karyotype]`}
                        error={errors?.[`complementaryAnalyticGenetic`]?.[0]?.["karyotype"]}
                        disabled={isGenetic ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticGenetic[0][karyotypeDate]`}
                        error={errors?.[`complementaryAnalyticGenetic`]?.[0]?.["karyotypeDate"]}
                        disabled={isGenetic ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Prothrombin Gene
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={normalAbnormalOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticGenetic[0][prothrombinGene]`}
                        error={errors?.[`complementaryAnalyticGenetic`]?.[0]?.["prothrombinGene"]}
                        disabled={isGenetic ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticGenetic[0][prothrombinGeneDate]`}
                        error={errors?.[`complementaryAnalyticGenetic`]?.[0]?.["prothrombinGeneDate"]}
                        disabled={isGenetic ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Mthfr Gene
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={normalAbnormalOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticGenetic[0][mthfrGene]`}
                        error={errors?.[`complementaryAnalyticGenetic`]?.[0]?.["mthfrGene"]}
                        disabled={isGenetic ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticGenetic[0][mthfrGeneDate]`}
                        error={errors?.[`complementaryAnalyticGenetic`]?.[0]?.["mthfrGeneDate"]}
                        disabled={isGenetic ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Factor V Mutation
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={positiveNegativeOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticGenetic[0][factorVMutation]`}
                        error={errors?.[`complementaryAnalyticGenetic`]?.[0]?.["factorVMutation"]}
                        disabled={isGenetic ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticGenetic[0][factorVMutationDate]`}
                        error={errors?.[`complementaryAnalyticGenetic`]?.[0]?.["factorVMutationDate"]}
                        disabled={isGenetic ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      X Fragile Mutation
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={normalAbnormalOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticGenetic[0][xFragileMutation]`}
                        error={errors?.[`complementaryAnalyticGenetic`]?.[0]?.["xFragileMutation"]}
                        disabled={isGenetic ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticGenetic[0][xFragileMutationDate]`}
                        error={errors?.[`complementaryAnalyticGenetic`]?.[0]?.["xFragileMutationDate"]}
                        disabled={isGenetic ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      CTRF Mutation
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={normalAbnormalOptions}
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticGenetic[0][ctrfMutation]`}
                        error={errors?.[`complementaryAnalyticGenetic`]?.[0]?.["ctrfMutation"]}
                        disabled={isGenetic ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticGenetic[0][ctrfMutationDate]`}
                        error={errors?.[`complementaryAnalyticGenetic`]?.[0]?.["ctrfMutationDate"]}
                        disabled={isGenetic ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} lg={6} md={12} sm={12}>
            <Grid item xs={12}>
              <Box>
                <h3 className="formHeading" style={{ borderTop: "none" }}>
                  <FormattedMessage id="coagulation" />
                  <RadioButton
                    label="Yes"
                    name="isCoagulation"
                    onChange={() => {
                      setIsCoagulation(true);
                    }}
                    checked={isCoagulation}
                    style={{ marginLeft: "5px" }}
                    disabled={isComplementaryAnalytic ? false : true}
                  />
                  <RadioButton
                    label="No"
                    name="isCoagulation"
                    onChange={() => {
                      setIsCoagulation(false);
                    }}
                    checked={!isCoagulation}
                    disabled={isComplementaryAnalytic ? false : true}
                  />
                </h3>
              </Box>
            </Grid>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "20%" }}></TableCell>
                    <TableCell style={{ width: "20%" }} align="center"><FormattedMessage id="test-result" /></TableCell>
                    <TableCell style={{ width: "20%" }} align="center"><FormattedMessage id="date" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>Antithrombin III</TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticCoagulation[0][antithrombinIII]`}
                        error={errors?.[`complementaryAnalyticCoagulation`]?.[0]?.["antithrombinIII"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isCoagulation ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticCoagulation[0][antithrombinIIIDate]`}
                        error={errors?.[`complementaryAnalyticCoagulation`]?.[0]?.["antithrombinIIIDate"]}
                        disabled={isCoagulation ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      APCR
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticCoagulation[0][apcr]`}
                        error={errors?.[`complementaryAnalyticCoagulation`]?.[0]?.["apcr"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isCoagulation ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticCoagulation[0][apcrDate]`}
                        error={errors?.[`complementaryAnalyticCoagulation`]?.[0]?.["apcrDate"]}
                        disabled={isCoagulation ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Protwin S Activity
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticCoagulation[0][proteinSActivity]`}
                        error={errors?.[`complementaryAnalyticCoagulation`]?.[0]?.["proteinSActivity"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isCoagulation ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticCoagulation[0][proteinSActivityDate]`}
                        error={errors?.[`complementaryAnalyticCoagulation`]?.[0]?.["proteinSActivityDate"]}
                        disabled={isCoagulation ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Protwin C Activity
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticCoagulation[0][protienCActivity]`}
                        error={errors?.[`complementaryAnalyticCoagulation`]?.[0]?.["protienCActivity"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isCoagulation ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticCoagulation[0][protienCActivityDate]`}
                        error={errors?.[`complementaryAnalyticCoagulation`]?.[0]?.["protienCActivityDate"]}
                        disabled={isCoagulation ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Protein S Antigen Total
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticCoagulation[0][proteinSAntigenTotal]`}
                        error={errors?.[`complementaryAnalyticCoagulation`]?.[0]?.["proteinSAntigenTotal"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isCoagulation ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticCoagulation[0][proteinSAntigenTotalDate]`}
                        error={errors?.[`complementaryAnalyticCoagulation`]?.[0]?.["proteinSAntigenTotalDate"]}
                        disabled={isCoagulation ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Protein C Antigent Total
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        control={control}
                        name={`complementaryAnalyticCoagulation[0][proteinCAntigentTotal]`}
                        error={errors?.[`complementaryAnalyticCoagulation`]?.[0]?.["proteinCAntigentTotal"]}
                        rules={validationRule.textbox({ type: "number" })}
                        disabled={isCoagulation ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticCoagulation[0][proteinCAntigentTotalDate]`}
                        error={errors?.[`complementaryAnalyticCoagulation`]?.[0]?.["proteinCAntigentTotalDate"]}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} lg={6} md={12} sm={12}>
            <Grid item xs={12}>
              <Box>
                <h3 className="formHeading" style={{ borderTop: "none" }}>
                  <FormattedMessage id="immunology" />
                  <RadioButton
                    label="Yes"
                    name="isImmunology"
                    onChange={() => {
                      setIsImmunology(true);
                    }}
                    checked={isImmunology}
                    style={{ marginLeft: "5px" }}
                    disabled={isComplementaryAnalytic ? false : true}
                  />
                  <RadioButton
                    label="No"
                    name="isImmunology"
                    onChange={() => {
                      setIsImmunology(false);
                    }}
                    checked={!isImmunology}
                    disabled={isComplementaryAnalytic ? false : true}
                  />
                </h3>
              </Box>
            </Grid>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "20%" }}></TableCell>
                    <TableCell style={{ width: "20%" }} align="center"><FormattedMessage id="test-result" /></TableCell>
                    <TableCell style={{ width: "20%" }} align="center"><FormattedMessage id="date" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>lgG ACA</TableCell>
                    <TableCell>
                      <CustomSelect
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        options={testResultTypeOptions}
                        control={control}
                        name={`complementaryAnalyticImmunology[0][igGACA]`}
                        error={errors?.[`complementaryAnalyticImmunology`]?.[0]?.["igGACA"]}
                        disabled={isImmunology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticImmunology[0][igGACADate]`}
                        error={errors?.[`complementaryAnalyticImmunology`]?.[0]?.["igGACADate"]}
                        disabled={isImmunology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      lgM ACA
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        options={testResultTypeOptions}
                        control={control}
                        name={`complementaryAnalyticImmunology[0][igMACA]`}
                        error={errors?.[`complementaryAnalyticImmunology`]?.[0]?.["igMACA"]}
                        disabled={isImmunology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticImmunology[0][igMACADate]`}
                        error={errors?.[`complementaryAnalyticImmunology`]?.[0]?.["igMACADate"]}
                        disabled={isImmunology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Anit B2GP lgG
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        options={positiveNegativeOptions}
                        control={control}
                        name={`complementaryAnalyticImmunology[0][anitB2GPIgG]`}
                        error={errors?.[`complementaryAnalyticImmunology`]?.[0]?.["anitB2GPIgG"]}
                        disabled={isImmunology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticImmunology[0][anitB2GPIgGDate]`}
                        error={errors?.[`complementaryAnalyticImmunology`]?.[0]?.["anitB2GPIgGDate"]}
                        disabled={isImmunology ? false : true}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>
                      Anit B2GP lgM
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        label=""
                        placeholder={formatMessage({ id: "test-result" })}
                        options={positiveNegativeOptions}
                        control={control}
                        name={`complementaryAnalyticImmunology[0][anitB2GPIgM]`}
                        error={errors?.[`complementaryAnalyticImmunology`]?.[0]?.["anitB2GPIgM"]}
                        disabled={isImmunology ? false : true}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        control={control}
                        name={`complementaryAnalyticImmunology[0][anitB2GPIgMDate]`}
                        error={errors?.[`complementaryAnalyticImmunology`]?.[0]?.["anitB2GPIgMDate"]}
                        disabled={isImmunology ? false : true}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} lg={12} md={12} sm={12}>
            <Button
              variant="contained"
              color="primary"
              style={{ marginLeft: "15px", float: "left", marginTop: "30px" }}
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

export default ComplimentaryAnalytics;
