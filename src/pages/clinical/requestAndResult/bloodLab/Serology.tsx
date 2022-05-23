import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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

import { CustomCheckBox, CustomTextBox, CustomDatePicker } from "components/forms";
import { HoverLoader, PaperWithLabel } from "components";
import { consanguinityOptions, cycleOptions, masterPaginationServices } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { requestResultMenuList } from 'utils/constants/menu';

interface Props { }

const Serology = (props: Props) => {
  const dispatch = useDispatch();
  const location = useLocation<any>();
  const { toastMessage } = useToastMessage();
  const { formatMessage } = useIntl();
  const { handleSubmit, formState: { errors }, control, watch, getValues, reset, } = useForm({ mode: "all" });

  const [loading, setLoading] = useState(false);
  const [isEditOn, setIsEditOn] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  function onAddContraceptiveMethod() {


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
      title={formatMessage({ id: "blood-lab-serology" })}
      onSave={handleSubmit(onSubmit)}
      menuList={requestResultMenuList}
    >
      <Box padding={3} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6} md={6} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "chn" })}
                    name="companyName"
                    control={control}
                    error={errors.companyName}
                    rules={validationRule.textbox({ type: "textWithSpace" })}
                  />
                </Grid>
                <Grid item xs={12} lg={6} md={6} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "female-partner" })}
                    name="companyName"
                    control={control}
                    error={errors.companyName}
                    rules={validationRule.textbox({ type: "textWithSpace" })}
                  />
                </Grid>

                <Grid item xs={12} lg={12} md={12} sm={12}>
                  <CustomCheckBox
                    name="isFatherDeceased"
                    label={formatMessage({ id: "sensitive-to-remainder-of-serology" })}
                    control={control}
                    error={errors?.isFatherDeceased}
                  />
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "genetics" })}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={6} md={4} sm={6}>
                        <CustomTextBox
                          label={formatMessage({ id: "screening-of-monogenic" })}
                          name="companyName"
                          control={control}
                          error={errors.companyName}
                          rules={validationRule.textbox({ type: "textWithSpace" })}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6} md={4} sm={6}>
                        <CustomDatePicker
                          label={formatMessage({ id: "date" })}
                          name="capturingDate"
                          control={control}
                          error={errors.capturingDate}
                          rules={validationRule.textbox({ required: true })}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6} md={4} sm={6}>
                        <CustomTextBox
                          label={formatMessage({ id: "karyotype" })}
                          name="companyName"
                          control={control}
                          error={errors.companyName}
                          rules={validationRule.textbox({ type: "textWithSpace" })}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6} md={4} sm={6}>
                        <CustomTextBox
                          label=""
                          name="companyName"
                          control={control}
                          error={errors.companyName}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6} md={4} sm={6}>
                        <CustomTextBox
                          label={formatMessage({ id: "cystic-fibrosis" })}
                          name="companyName"
                          control={control}
                          error={errors.companyName}
                          rules={validationRule.textbox({ type: "textWithSpace" })}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6} md={4} sm={6}>
                        <CustomTextBox
                          label=""
                          name="companyName"
                          control={control}
                          error={errors.companyName}
                          rules={validationRule.textbox({ type: "textWithSpace" })}
                        />
                      </Grid>
                    </Grid>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "infectious" })}>
                    <Grid item xs={12}>
                      <TableContainer>
                        <Table size="small" aria-label="sticky table">
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ width: "30%" }}><FormattedMessage id="hepatitis-b" /></TableCell>
                              <TableCell style={{ width: "35%" }}><FormattedMessage id="result-date" /></TableCell>
                              <TableCell style={{ width: "35%" }}><FormattedMessage id="result" /></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>HBV DNA</TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>HbsAg</TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>HbsAb</TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>HbcAb</TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>HbclgM</TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "hepatitis-b" })}>
                    <TableContainer>
                      <Table size="small" aria-label="sticky table">
                        <TableBody>
                          <TableRow>
                            <TableCell>HCV RNA</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>HCV antibody</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "hiv" })}>
                    <TableContainer>
                      <Table size="small" aria-label="sticky table">
                        <TableBody>
                          <TableRow>
                            <TableCell>HIV 1/2</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>HIV antibody</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "syphilis" })}>
                    <TableContainer>
                      <Table aria-label="sticky table">
                        <TableBody>
                          <TableRow>
                            <TableCell>Anti-TP antibody/RPR/TPHA/VDRL</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Syphilis PCR</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "pre-conception" })}>
                    <TableContainer>
                      <Table size="small" aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell><FormattedMessage id="toxoplasmosis" /></TableCell>
                            <TableCell><FormattedMessage id="result-date" /></TableCell>
                            <TableCell><FormattedMessage id="result" /></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Toxoplasmosis IgG</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Toxoplasmosis IgM</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "rubella" })}>
                    <TableContainer>
                      <Table size="small" aria-label="sticky table">
                        <TableBody>
                          <TableRow>
                            <TableCell>Rubella IgG</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "other-determinants" })}>
                    <TableContainer>
                      <Table size="small" aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell><FormattedMessage id="result-date" /></TableCell>
                            <TableCell><FormattedMessage id="result" /></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Pre-operative</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Live.gc.msg.param</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Live.gc.msg.param</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "general-comments" })}>
                    <CustomTextBox
                      label={formatMessage({ id: "comments" })}
                      name="companyName"
                      control={control}
                      error={errors.companyName}
                      rules={validationRule.textbox({ maxLength: 200 })}
                      rows={2}
                      multiline
                    />
                  </PaperWithLabel>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Box style={{ border: "1px solid #c2c2c2", borderRadius: "5px" }} pt={1} padding={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6} md={6} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "chn" })}
                    name="companyName"
                    control={control}
                    error={errors.companyName}
                    rules={validationRule.textbox({ type: "textWithSpace" })}
                  />
                </Grid>
                <Grid item xs={12} lg={6} md={6} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "male-partner" })}
                    name="companyName"
                    control={control}
                    error={errors.companyName}
                    rules={validationRule.textbox({ type: "textWithSpace" })}
                  />
                </Grid>

                <Grid item xs={12} lg={12} md={12} sm={12}>
                  <CustomCheckBox
                    name="isFatherDeceased"
                    label={formatMessage({ id: "sensitive-to-remainder-of-serology" })}
                    control={control}
                    error={errors?.isFatherDeceased}
                  />
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "genetics" })}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={6} md={4} sm={6}>
                        <CustomTextBox
                          label={formatMessage({ id: "screening-of-monogenic" })}
                          name="companyName"
                          control={control}
                          error={errors.companyName}
                          rules={validationRule.textbox({ type: "textWithSpace" })}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6} md={4} sm={6}>
                        <CustomDatePicker
                          label={formatMessage({ id: "date" })}
                          name="capturingDate"
                          control={control}
                          error={errors.capturingDate}
                          rules={validationRule.textbox({ required: true })}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6} md={4} sm={6}>
                        <CustomTextBox
                          label={formatMessage({ id: "karyotype" })}
                          name="companyName"
                          control={control}
                          error={errors.companyName}
                          rules={validationRule.textbox({ type: "textWithSpace" })}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6} md={4} sm={6}>
                        <CustomTextBox
                          label=""
                          name="companyName"
                          control={control}
                          error={errors.companyName}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6} md={4} sm={6}>
                        <CustomTextBox
                          label={formatMessage({ id: "cystic-fibrosis" })}
                          name="companyName"
                          control={control}
                          error={errors.companyName}
                          rules={validationRule.textbox({ type: "textWithSpace" })}
                        />
                      </Grid>
                      <Grid item xs={12} lg={6} md={4} sm={6}>
                        <CustomTextBox
                          label=""
                          name="companyName"
                          control={control}
                          error={errors.companyName}
                          rules={validationRule.textbox({ type: "textWithSpace" })}
                        />
                      </Grid>
                    </Grid>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "infectious" })}>
                    <Grid item xs={12}>
                      <TableContainer>
                        <Table size="small" aria-label="sticky table">
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ width: "30%" }}><FormattedMessage id="hepatitis-b" /></TableCell>
                              <TableCell style={{ width: "35%" }}><FormattedMessage id="result-date" /></TableCell>
                              <TableCell style={{ width: "35%" }}><FormattedMessage id="result" /></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>HBV DNA</TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>HbsAg</TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>HbsAb</TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>HbcAb</TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>HbclgM</TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                              <TableCell>
                                <CustomTextBox
                                  label=""
                                  name="companyName"
                                  control={control}
                                  error={errors.companyName}
                                />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "hepatitis-b" })}>
                    <TableContainer>
                      <Table size="small" aria-label="sticky table">
                        <TableBody>
                          <TableRow>
                            <TableCell>HCV RNA</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>HCV antibody</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "hiv" })}>
                    <TableContainer>
                      <Table size="small" aria-label="sticky table">
                        <TableBody>
                          <TableRow>
                            <TableCell>HIV 1/2</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>HIV antibody</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "syphilis" })}>
                    <TableContainer>
                      <Table aria-label="sticky table">
                        <TableBody>
                          <TableRow>
                            <TableCell>Anti-TP antibody/RPR/TPHA/VDRL</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Syphilis PCR</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "rubella" })}>
                    <TableContainer>
                      <Table size="small" aria-label="sticky table">
                        <TableBody>
                          <TableRow>
                            <TableCell>Rubella IgG</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "other-determinants" })}>
                    <TableContainer>
                      <Table size="small" aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell><FormattedMessage id="result-date" /></TableCell>
                            <TableCell><FormattedMessage id="result" /></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Pre-operative</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Live.gc.msg.param</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Live.gc.msg.param</TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                            <TableCell>
                              <CustomTextBox
                                label=""
                                name="companyName"
                                control={control}
                                error={errors.companyName}
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </PaperWithLabel>
                </Grid>

                <Grid item xs={12}>
                  <PaperWithLabel label={formatMessage({ id: "general-comments" })}>
                    <CustomTextBox
                      label={formatMessage({ id: "comments" })}
                      name="companyName"
                      control={control}
                      error={errors.companyName}
                      rules={validationRule.textbox({ maxLength: 200 })}
                      rows={2}
                      multiline
                    />
                  </PaperWithLabel>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {loading || deleteLoading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default Serology;
