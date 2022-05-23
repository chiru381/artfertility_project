import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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

import { CustomTextBox, RadioButton, CustomDatePicker } from "components/forms";
import { HoverLoader } from "components";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";

interface Props { }

const HormonalDetermination = (props: Props) => {
  const { handleSubmit, formState: { errors }, control, reset } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const [isEditOn, setIsEditOn] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isHormoneDetermination, setIsHormoneDetermination] = useState(true);

  const { fields, append, remove } = useFieldArray({ control, name: "hormoneDeterminationDetail" });

  let patientId = useGetPatientId();

  useEffect(() => {
    onEdit();
  }, []);

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    bodyData = {
      ...bodyData,
      id: patientId,
      isHormoneDetermination: isHormoneDetermination,
      hormoneDeterminationDetail: bodyData?.hormoneDeterminationDetail[0]
    };

    setLoading(true);

    let mormoneDeterminationService = services[(isEditOn ? 'updateHormoneDetermination' : 'createHormoneDetermination') as keyof typeof services];

    mormoneDeterminationService(bodyData)
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
      HormoneDeterminationId: patientId
    }
    setDeleteLoading(true);
    services.deleteHormoneDetermination(parms)
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
      HormoneDeterminationId: patientId
    };
    setLoading(true);
    services.getHormoneDeterminationById(paramsData)
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
      hormoneDeterminationDetail: [resData.hormoneDeterminationDetail]
    }

    reset(data);
    setIsHormoneDetermination(resData.isHormoneDetermination);
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "hormonal-determination" })}
      onSave={handleSubmit(onSubmit)}
      saveButtonProps={{
        label: isEditOn ? "update" : "save"
      }}
      onDelete={onDelete}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex", alignItems: "center" }}>
            <FormLabel
              component="legend"
            >
              {formatMessage({ id: "hormonal-determination" })}:
            </FormLabel>
            <RadioButton
              label="Yes"
              name="isHormoneDetermination"
              onChange={() => {
                setIsHormoneDetermination(true);
              }}
              checked={isHormoneDetermination}
            />
            <RadioButton
              label="No"
              name="isHormoneDetermination"
              onChange={() => {
                setIsHormoneDetermination(false);
              }}
              checked={!isHormoneDetermination}
            />
          </Grid>
          <Grid item xs={12} lg={6} md={12} sm={12}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: "20%" }}><FormattedMessage id="test-name" /></TableCell>
                    <TableCell style={{ width: "30%" }}><FormattedMessage id="test-result" /></TableCell>
                    <TableCell style={{ width: "45%" }}><FormattedMessage id="date" /></TableCell>
                    <TableCell style={{ width: "5%" }}><FormattedMessage id="action" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover role="checkbox" tabIndex={-1} key={0}>
                    <TableCell>
                      AMH(pmol/L)
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`hormoneDeterminationDetail[0][amhpmolLevel]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["amhpmolLevel"]}
                        type="number"
                        rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`hormoneDeterminationDetail[0][amhpmolLevelDate]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["amhpmolLevelDate"]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1} key={1}>
                    <TableCell>
                      AMH(ng/ml)
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`hormoneDeterminationDetail[0][amhngLevel]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["amhngLevel"]}
                        type="number"
                        rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`hormoneDeterminationDetail[0][amhngLevelDate]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["amhngLevelDate"]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1} key={2}>
                    <TableCell>
                      FSH
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`hormoneDeterminationDetail[0][fshLevel]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["fshLevel"]}
                        type="number"
                        rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`hormoneDeterminationDetail[0][fshLevelDate]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["fshLevelDate"]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1} key={3}>
                    <TableCell>
                      LH
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`hormoneDeterminationDetail[0][lhLevel]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["lhLevel"]}
                        type="number"
                        rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`hormoneDeterminationDetail[0][lhLevelDate]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["lhLevelDate"]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1} key={4}>
                    <TableCell>
                      E2
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`hormoneDeterminationDetail[0][e2Level]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["e2Level"]}
                        type="number"
                        rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`hormoneDeterminationDetail[0][e2LevelDate]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["e2LevelDate"]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1} key={5}>
                    <TableCell>
                      P4
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`hormoneDeterminationDetail[0][p4Level]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["p4Level"]}
                        type="number"
                        rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`hormoneDeterminationDetail[0][p4LevelDate]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["p4LevelDate"]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1} key={6}>
                    <TableCell>
                      T
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`hormoneDeterminationDetail[0][tLevel]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["tLevel"]}
                        type="number"
                        rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`hormoneDeterminationDetail[0][tLevelDate]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["tLevelDate"]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1} key={7}>
                    <TableCell>
                      TSH
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`hormoneDeterminationDetail[0][tshLevel]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["tshLevel"]}
                        type="number"
                        rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`hormoneDeterminationDetail[0][tshLevelDate]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["tshLevelDate"]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1} key={8}>
                    <TableCell>
                      T3
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`hormoneDeterminationDetail[0][t3Level]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["t3Level"]}
                        type="number"
                        rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`hormoneDeterminationDetail[0][t3LevelDate]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["t3LevelDate"]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1} key={9}>
                    <TableCell>
                      T4
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`hormoneDeterminationDetail[0][t4Level]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["t4Level"]}
                        type="number"
                        rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`hormoneDeterminationDetail[0][t4LevelDate]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["t4LevelDate"]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1} key={10}>
                    <TableCell>
                      DHEA
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`hormoneDeterminationDetail[0][dheaLevel]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["dheaLevel"]}
                        type="number"
                        rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`hormoneDeterminationDetail[0][dheaLevelDate]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["dheaLevelDate"]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1} key={11}>
                    <TableCell>
                      SHBG
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`hormoneDeterminationDetail[0][shbgLevel]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["shbgLevel"]}
                        type="number"
                        rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`hormoneDeterminationDetail[0][shbgLevelDate]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["shbgLevelDate"]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1} key={12}>
                    <TableCell>
                      PRL
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`hormoneDeterminationDetail[0][prlLevel]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["prlLevel"]}
                        type="number"
                        rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`hormoneDeterminationDetail[0][prlLevelDate]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["prlLevelDate"]}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow hover role="checkbox" tabIndex={-1} key={13}>
                    <TableCell>
                      Inhibin
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`hormoneDeterminationDetail[0][inhibinLevel]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["inhibinLevel"]}
                        type="number"
                        rules={validationRule.textbox({ type: "number", maxLength: 5 })}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        label=""
                        name={`hormoneDeterminationDetail[0][inhibinLevelDate]`}
                        control={control}
                        error={errors?.[`hormoneDeterminationDetail`]?.[0]?.["inhibinLevelDate"]}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} lg={6} md={12} sm={12}>
            <Grid item xs={12} lg={12} md={12} sm={12}>
              <CustomTextBox
                label={formatMessage({ id: "observations" })}
                name={`hormoneDeterminationDetail[0][observations]`}
                control={control}
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

export default HormonalDetermination;
