import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";

import { CustomTextBox, CustomDatePicker, CustomSelect } from "components/forms";
import { cysticFibrosisOptions, karyotypeOptions, duchenneDystrophyOptions, xFragileOptions, thrombophiliaOptions, thalassemiaOptions, hLACOptions, donorConditionOptions } from "utils/constants";
import { HoverLoader } from "components";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";

interface Props { }

const GeneticTests = (props: Props) => {
  const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const [isEditOn, setIsEditOn] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  let patientId = useGetPatientId();

  useEffect(() => {
    onEdit();
  }, []);

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    bodyData = {
      ...bodyData,
      id: patientId
    }

    setLoading(true);

    let geneticTestService = services[(isEditOn ? 'updateGeneticTest' : 'createGeneticTest') as keyof typeof services];

    geneticTestService(bodyData)
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
      GeneticTestId: patientId
    }
    setDeleteLoading(true);
    services.deleteGeneticTest(parms)
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
      GeneticTestId: patientId
    };
    setLoading(true);
    services.getGeneticTestByTestId(paramsData)
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
    let data = {
      ...resData,
      cysticFibrosis: cysticFibrosisOptions?.find((option: any) => option.value == resData.cysticFibrosis) ?? null,
      karyotype: karyotypeOptions?.find((option: any) => option.value == resData.karyotype) ?? null,
      duchenneDystrophy: duchenneDystrophyOptions?.find((option: any) => option.value == resData.duchenneDystrophy) ?? null,
      xFragile: xFragileOptions?.find((option: any) => option.value == resData.xFragile) ?? null,
      thalassemia: thalassemiaOptions?.find((option: any) => option.value == resData.thalassemia) ?? null,
      hlac: hLACOptions?.find((option: any) => option.value == resData.hlac) ?? null,
      donorCondition: donorConditionOptions?.find((option: any) => option.value == resData.donorCondition) ?? null,
      thrombophiliaId: thrombophiliaOptions?.find((option: any) => option.value == resData.thrombophiliaId) ?? null,
    }

    reset(data);
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "genetic-tests" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      onDelete={onDelete}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8} md={12} sm={12}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "20%" }}><FormattedMessage id="test-name" /></TableCell>
                    <TableCell style={{ width: "45%" }}><FormattedMessage id="test-result" /></TableCell>
                    <TableCell style={{ width: "45%" }}><FormattedMessage id="date" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>Cystic Fibrosis</TableCell>
                    <TableCell>
                      <CustomSelect
                        label=""
                        options={cysticFibrosisOptions}
                        name="cysticFibrosis"
                        control={control}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name="cysticFibrosisDate"
                        control={control}
                        error={errors?.cysticFibrosisDate}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>Karyotype</TableCell>
                    <TableCell>
                      <CustomSelect
                        label=""
                        options={karyotypeOptions}
                        name="karyotype"
                        control={control}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name="karyotypeDate"
                        control={control}
                        error={errors?.karyotypeDate}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>Ducheme Dystrophy</TableCell>
                    <TableCell>
                      <CustomSelect
                        label=""
                        options={duchenneDystrophyOptions}
                        name="duchenneDystrophy"
                        control={control}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name="duchenneDystrophyDate"
                        control={control}
                        error={errors?.duchenneDystrophyDate}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>x Fragile</TableCell>
                    <TableCell>
                      <CustomSelect
                        label=""
                        options={xFragileOptions}
                        name="xFragile"
                        control={control}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name="xFragileDate"
                        control={control}
                        error={errors?.xFragileDate}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>Thrombophilia</TableCell>
                    <TableCell>
                      <CustomSelect
                        label=""
                        options={thrombophiliaOptions}
                        name="thrombophiliaId"
                        control={control}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name="thrombophiliaIdDate"
                        control={control}
                        error={errors?.thrombophiliaIdDate}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>Thalassemia</TableCell>
                    <TableCell>
                      <CustomSelect
                        label=""
                        options={thalassemiaOptions}
                        name="thalassemia"
                        control={control}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name="thalassemiaDate"
                        control={control}
                        error={errors?.thalassemiaDate}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>HLA-C</TableCell>
                    <TableCell>
                      <CustomSelect
                        label=""
                        options={hLACOptions}
                        name="hlac"
                        control={control}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name="hlacDate"
                        control={control}
                        error={errors?.hlacDate}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    <TableCell>Donor Condition</TableCell>
                    <TableCell>
                      <CustomSelect
                        label=""
                        options={donorConditionOptions}
                        name="donorCondition"
                        control={control}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name="donorConditionDate"
                        control={control}
                        error={errors?.donorConditionDate}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} lg={4} md={12} sm={12}>
            <Grid item xs={12} lg={12} md={12} sm={12}>
              <CustomTextBox
                label={formatMessage({ id: "observations" })}
                name="observations"
                control={control}
                error={errors.observations}
                multiline
                rows={4}
                rules={validationRule.textbox({ maxLength: 200 })}
              />
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12}>
              <Button variant="contained" color="primary" style={{ float: "right", marginTop: '10px' }}>
                <FormattedMessage id={"place-order"} />
              </Button>
            </Grid>
          </Grid>

        </Grid>
      </Box>
      {loading || deleteLoading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default GeneticTests;
