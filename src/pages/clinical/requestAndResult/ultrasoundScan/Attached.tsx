import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector, shallowEqual } from "react-redux";
import { ControllerProps } from "react-hook-form";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import FormLabel from "@material-ui/core/FormLabel";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import FormControl from '@material-ui/core/FormControl';

import { TableButtonGroup, TableEditButton, DeleteButton } from 'components/button';
import { CustomSelect, CustomTextBox, RadioButton, CustomCheckBox } from "components/forms";
import { wauAvailablityOptions, fallopianTubeStateOptions, fallopianTubeStates, wauAvailablityTypes } from "utils/constants";
import { validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useCreateLookupOptions } from "utils/hooks";

interface Props {
  control: ControllerProps["control"];
  isFreeLiquid: boolean;
  isAshermanSyndrome: boolean;
  otherParaOvarian: boolean;
  isLeftFallopianTube: boolean;
  isRightFallopianTube: boolean;
  setIsFreeLiquid: (data: any) => void;
  setIsAshermanSyndrome: (data: any) => void;
  setOtherParaOvarian: (data: any) => void;
  setIsLeftFallopianTube: (data: any) => void;
  setIsRightFallopianTube: (data: any) => void;
  formData: any;
  errors: any;
  watch: any;
  reset: any;
  getValues: any;
}

const Attached = (props: Props) => {
  const { formData, control, errors, getValues, reset, watch, isFreeLiquid, isAshermanSyndrome, otherParaOvarian, isLeftFallopianTube, isRightFallopianTube,
    setIsFreeLiquid, setIsAshermanSyndrome, setOtherParaOvarian, setIsLeftFallopianTube, setIsRightFallopianTube } = props;

  const { formatMessage } = useIntl();

  const ultrasoundAttachedItemsRightOvary = useFieldArray({ control, name: "ultrasoundAttachedItemsRightOvary" });
  const ultrasoundAttachedItemsLeftOvary = useFieldArray({ control, name: "ultrasoundAttachedItemsLeftOvary" });
  const ultrasoundAttachedItemsRightFallopianTube = useFieldArray({ control, name: "ultrasoundAttachedItemsRightFallopianTube" });
  const ultrasoundAttachedItemsLeftFallopianTube = useFieldArray({ control, name: "ultrasoundAttachedItemsLeftFallopianTube" });

  const { usgLookupData } =
    useSelector(({ usgLookupReducer }: RootReducerState) => ({
      usgLookupData: usgLookupReducer.data
    }),
      shallowEqual
    );

  // Lookup options for dropdown
  let selectOptions = useCreateLookupOptions(usgLookupData);

  useEffect(() => {
    ultrasoundAttachedItemsRightOvary.append({});
    ultrasoundAttachedItemsLeftOvary.append({});
    ultrasoundAttachedItemsRightFallopianTube.append({});
    ultrasoundAttachedItemsLeftFallopianTube.append({});
  }, []);

  useEffect(() => {
    if (Object.keys(formData)?.length) {

      reset({
        ...getValues(),
        ultrasoundAttachedItemsRightOvary: formData?.ultrasoundAttachedItemsRightOvary,
        ultrasoundAttachedItemsLeftOvary: formData?.ultrasoundAttachedItemsLeftOvary,
        ultrasoundAttachedItemsRightFallopianTube: formData?.ultrasoundAttachedItemsRightFallopianTube,
        ultrasoundAttachedItemsLeftFallopianTube: formData?.ultrasoundAttachedItemsLeftFallopianTube
      });

      if (formData?.ultrasoundAttachedItemsRightOvary?.length == 0) {
        ultrasoundAttachedItemsRightOvary.append({});
      }
      if (formData?.ultrasoundAttachedItemsLeftOvary?.length == 0) {
        ultrasoundAttachedItemsLeftOvary.append({});
      }
      if (formData?.ultrasoundAttachedItemsRightFallopianTube?.length == 0) {
        ultrasoundAttachedItemsRightFallopianTube.append({});
      }
      if (formData?.ultrasoundAttachedItemsLeftFallopianTube?.length == 0) {
        ultrasoundAttachedItemsLeftFallopianTube.append({});
      }
    }
  }, [Object.keys(formData)?.length]);


  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={10} md={12} sm={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <h3 className="formHeading" style={{ border: "none" }}>
                    <FormattedMessage id="ovaries" />
                  </h3>
                  <FormControl fullWidth style={{ alignItems: "flex-start" }}>
                    <span className="text-13 font-medium">Right</span>
                  </FormControl>
                </Grid>

                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomSelect
                    options={wauAvailablityOptions}
                    label={formatMessage({ id: "ovary-state" })}
                    name={`[ultrasoundAttached][rightOvaryState]`}
                    control={control}
                    error={errors?.[`ultrasoundAttached`]?.rightOvaryState}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomSelect
                    options={selectOptions?.ultrasoundAttachedTypes ?? []}
                    label={formatMessage({ id: "ovary-status" })}
                    name={`[ultrasoundAttached][rightOvaryStatusId]`}
                    control={control}
                    error={errors?.[`ultrasoundAttached`]?.rightOvaryStatusId}
                    disabled={watch(`[ultrasoundAttached][rightOvaryState]`)?.value != wauAvailablityTypes.Present}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "antral-follicle" })}
                    name={`[ultrasoundAttached][rightOvaryAntralFollicies]`}
                    control={control}
                    error={errors?.[`ultrasoundAttached`]?.rightOvaryAntralFollicies}
                  />
                </Grid>
                <Grid item xs={12} lg={12} md={12} sm={12}>
                  <TableContainer>
                    <Table stickyHeader aria-label="sticky table" size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: "24%" }} align="center"><FormattedMessage id="type" /></TableCell>
                          <TableCell style={{ width: "23%" }} align="center"><FormattedMessage id="content" /></TableCell>
                          <TableCell style={{ width: "23%" }} align="center"><FormattedMessage id="important-diagnosis" /></TableCell>
                          <TableCell style={{ width: "15%" }} align="center"><FormattedMessage id="size(mm)" /></TableCell>
                          <TableCell style={{ width: "10%" }} >
                            <Button
                              variant="contained"
                              onClick={() => {
                                ultrasoundAttachedItemsRightOvary.append({});
                              }}
                              style={{ padding: "0px 11px", background: "white" }}
                              disabled={watch(`[ultrasoundAttached][rightOvaryStatusId]`)?.value != 2}
                            >
                              <FormattedMessage id="add-new-row" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ultrasoundAttachedItemsRightOvary?.fields.map(({ id }, index) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={id}>
                              <TableCell style={{ padding: "0px" }}>
                                <CustomSelect
                                  options={selectOptions?.ultrasoundAttachedTypes ?? []}
                                  label=""
                                  placeholder={formatMessage({ id: "type" })}
                                  name={`ultrasoundAttachedItemsRightOvary[${index}][ultrasoundAttachedTypeId]`}
                                  control={control}
                                  error={errors?.[`ultrasoundAttachedItemsRightOvary`]?.[index]?.["ultrasoundAttachedTypeId"]}
                                  disabled={watch(`[ultrasoundAttached][rightOvaryStatusId]`)?.value != 2}
                                />
                              </TableCell>
                              <TableCell style={{ padding: "3px" }}>
                                <CustomSelect
                                  options={selectOptions?.ultrasoundAttachedContents ?? []}
                                  label=""
                                  placeholder={formatMessage({ id: "content" })}
                                  name={`ultrasoundAttachedItemsRightOvary[${index}][ultrasoundAttachedContentId]`}
                                  control={control}
                                  error={errors?.[`ultrasoundAttachedItemsRightOvary`]?.[index]?.["ultrasoundAttachedContentId"]}
                                  disabled={watch(`[ultrasoundAttached][rightOvaryStatusId]`)?.value != 2}
                                />
                              </TableCell>
                              <TableCell style={{ padding: "3px" }}>
                                <CustomSelect
                                  options={selectOptions?.ultrasoundAttachedImpDiagnosises ?? []}
                                  label=""
                                  placeholder={formatMessage({ id: "diagnosis" })}
                                  name={`ultrasoundAttachedItemsRightOvary[${index}][ultrasoundAttachedImpDiagnosisId]`}
                                  control={control}
                                  error={errors?.[`ultrasoundAttachedItemsRightOvary`]?.[index]?.["ultrasoundAttachedImpDiagnosisId"]}
                                  disabled={watch(`[ultrasoundAttached][rightOvaryStatusId]`)?.value != 2}
                                />
                              </TableCell>
                              <TableCell style={{ padding: "3px" }}>
                                <CustomTextBox
                                  label=""
                                  name={`ultrasoundAttachedItemsRightOvary[${index}][size]`}
                                  control={control}
                                  error={errors?.[`ultrasoundAttachedItemsRightOvary`]?.[index]?.["size"]}
                                  rules={validationRule.textbox({ type: "number" })}
                                  disabled={watch(`[ultrasoundAttached][rightOvaryStatusId]`)?.value != 2}
                                />
                              </TableCell>
                              <TableCell>
                                {watch(`[ultrasoundAttached][rightOvaryStatusId]`)?.value == 2 &&
                                  <TableButtonGroup>
                                    <TableEditButton onClick={() => {
                                    }}
                                    />
                                    <DeleteButton
                                      onDelete={() => {
                                        ultrasoundAttachedItemsRightOvary.remove(index);
                                      }}
                                    />
                                  </TableButtonGroup>
                                }
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} lg={2} md={12} sm={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12} md={4} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "length(mm)" })}
                    name={`[ultrasoundAttached][rightOvaryLength]`}
                    control={control}
                    error={errors?.[`ultrasoundAttached`]?.rightOvaryLength}
                  />
                </Grid>
                <Grid item xs={12} lg={12} md={4} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "cross-section(mm)" })}
                    name={`[ultrasoundAttached][rightOvaryCrossSection]`}
                    control={control}
                    error={errors?.[`ultrasoundAttached`]?.rightOvaryCrossSection}
                  />
                </Grid>
                <Grid item xs={12} lg={12} md={4} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "antero-posterior(mm)" })}
                    name={`[ultrasoundAttached][rightOvaryAntPost]`}
                    control={control}
                    error={errors?.[`ultrasoundAttached`]?.rightOvaryAntPost}
                  />
                </Grid>
                <Grid item xs={12} lg={12} md={4} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "volume(mm3)" })}
                    name={`[ultrasoundAttached][rightOvaryVolume]`}
                    control={control}
                    error={errors?.[`ultrasoundAttached`]?.rightOvaryVolume}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={10} md={12} sm={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth style={{ alignItems: "flex-start" }}>
                    <span className="text-13 font-medium">Left</span>
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomSelect
                    options={wauAvailablityOptions}
                    label={formatMessage({ id: "ovary-state" })}
                    name={`[ultrasoundAttached][leftOvaryState]`}
                    control={control}
                    error={errors?.[`ultrasoundAttached`]?.leftOvaryState}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomSelect
                    options={selectOptions?.ultrasoundAttachedTypes ?? []}
                    label={formatMessage({ id: "ovary-status" })}
                    name={`[ultrasoundAttached][leftOvaryStatusId]`}
                    control={control}
                    error={errors?.[`ultrasoundAttached`]?.leftOvaryStatusId}
                    disabled={watch(`[ultrasoundAttached][leftOvaryState]`)?.value != wauAvailablityTypes.Present}
                  />
                </Grid>
                <Grid item xs={12} lg={3} md={4} sm={6}>
                  <CustomTextBox
                    label={formatMessage({ id: "antral-follicle" })}
                    name={`[ultrasoundAttached][leftOvaryAntralFollicies]`}
                    control={control}
                    error={errors?.[`ultrasoundAttached`]?.leftOvaryAntralFollicies}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TableContainer >
                    <Table stickyHeader aria-label="sticky table" size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: "24%" }} align="center"><FormattedMessage id="type" /></TableCell>
                          <TableCell style={{ width: "23%" }} align="center"><FormattedMessage id="content" /></TableCell>
                          <TableCell style={{ width: "23%" }} align="center"><FormattedMessage id="important-diagnosis" /></TableCell>
                          <TableCell style={{ width: "15%" }} align="center"><FormattedMessage id="size(mm)" /></TableCell>
                          <TableCell style={{ width: "15%" }} >
                            <Button
                              variant="contained"
                              onClick={() => {
                                ultrasoundAttachedItemsLeftOvary.append({});
                              }}
                              style={{ padding: "0px 11px", background: "white" }}
                              disabled={watch(`[ultrasoundAttached][leftOvaryStatusId]`)?.value != 2}
                            >
                              <FormattedMessage id="add-new-row" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {ultrasoundAttachedItemsLeftOvary?.fields.map(({ id }, index) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={id}>
                              <TableCell style={{ padding: "0px" }}>
                                <CustomSelect
                                  options={selectOptions?.ultrasoundAttachedTypes ?? []}
                                  label=""
                                  placeholder={formatMessage({ id: "type" })}
                                  name={`ultrasoundAttachedItemsLeftOvary[${index}][ultrasoundAttachedTypeId]`}
                                  control={control}
                                  error={errors?.[`ultrasoundAttachedItemsLeftOvary`]?.[index]?.["ultrasoundAttachedTypeId"]}
                                  disabled={watch(`[ultrasoundAttached][leftOvaryStatusId]`)?.value != 2}
                                />
                              </TableCell>
                              <TableCell style={{ padding: "3px" }}>
                                <CustomSelect
                                  options={selectOptions?.ultrasoundAttachedContents ?? []}
                                  label=""
                                  placeholder={formatMessage({ id: "content" })}
                                  name={`ultrasoundAttachedItemsLeftOvary[${index}][ultrasoundAttachedContentId]`}
                                  control={control}
                                  error={errors?.[`ultrasoundAttachedItemsLeftOvary`]?.[index]?.["ultrasoundAttachedContentId"]}
                                  disabled={watch(`[ultrasoundAttached][leftOvaryStatusId]`)?.value != 2}
                                />
                              </TableCell>
                              <TableCell style={{ padding: "3px" }}>
                                <CustomSelect
                                  options={selectOptions?.ultrasoundAttachedImpDiagnosises ?? []}
                                  label=""
                                  placeholder={formatMessage({ id: "diagnosis" })}
                                  name={`ultrasoundAttachedItemsLeftOvary[${index}][ultrasoundAttachedImpDiagnosisId]`}
                                  control={control}
                                  error={errors?.[`ultrasoundAttachedItemsLeftOvary`]?.[index]?.["ultrasoundAttachedImpDiagnosisId"]}
                                  disabled={watch(`[ultrasoundAttached][leftOvaryStatusId]`)?.value != 2}
                                />
                              </TableCell>
                              <TableCell style={{ padding: "3px" }}>
                                <CustomTextBox
                                  label=""
                                  name={`ultrasoundAttachedItemsLeftOvary[${index}][size]`}
                                  control={control}
                                  error={errors?.[`ultrasoundAttachedItemsLeftOvary`]?.[index]?.["size"]}
                                  rules={validationRule.textbox({ type: "number" })}
                                  disabled={watch(`[ultrasoundAttached][leftOvaryStatusId]`)?.value != 2}
                                />
                              </TableCell>
                              <TableCell>
                                {watch(`[ultrasoundAttached][leftOvaryStatusId]`)?.value == 2 &&
                                  <TableButtonGroup>
                                    <TableEditButton onClick={() => {
                                    }}
                                    />
                                    <DeleteButton
                                      onDelete={() => {
                                        ultrasoundAttachedItemsLeftOvary.remove(index);
                                      }}
                                    />
                                  </TableButtonGroup>
                                }
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} lg={2} md={12} sm={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12} md={4} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "length(mm)" })}
                    name={`[ultrasoundAttached][leftOvaryLength]`}
                    control={control}
                    error={errors?.[`ultrasoundAttached`]?.leftOvaryLength}
                  />
                </Grid>
                <Grid item xs={12} lg={12} md={4} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "cross-section(mm)" })}
                    name={`[ultrasoundAttached][leftOvaryCrossSection]`}
                    control={control}
                    error={errors?.[`ultrasoundAttached`]?.leftOvaryCrossSection}
                  />
                </Grid>
                <Grid item xs={12} lg={12} md={4} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "antero-posterior(mm)" })}
                    name={`[ultrasoundAttached][leftOvaryAntPost]`}
                    control={control}
                    error={errors?.[`ultrasoundAttached`]?.leftOvaryAntPost}
                  />
                </Grid>
                <Grid item xs={12} lg={12} md={4} sm={12}>
                  <CustomTextBox
                    label={formatMessage({ id: "volume(mm3)" })}
                    name={`[ultrasoundAttached][leftOvaryVolume]`}
                    control={control}
                    error={errors?.[`ultrasoundAttached`]?.leftOvaryVolume}
                  />
                </Grid>
              </Grid>
            </Grid>

          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <h3 className="formHeading">
            <FormattedMessage id="fallopian-tube" />
          </h3>
        </Grid>
        <Grid item xs={12} container>
          <Grid item xs={12} lg={4} md={4} sm={6}>
            <CustomSelect
              options={selectOptions?.ultrasoundEssures ?? []}
              label={formatMessage({ id: "essure-adiana" })}
              name={`[ultrasoundAttached][ultrasoundEssureId]`}
              control={control}
              error={errors?.[`ultrasoundAttached`]?.ultrasoundEssureId}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} lg={2} md={4} sm={6}>
          <FormControl fullWidth style={{ alignItems: "flex-start" }}>
            <span className="text-13 font-medium">Right</span>
          </FormControl>
          <RadioButton
            label="Yes"
            name="isRightFallopianTube"
            onChange={() => {
              setIsRightFallopianTube(true);
            }}
            checked={isRightFallopianTube}
          />

          <RadioButton
            label="No"
            name="isRightFallopianTube"
            onChange={() => {
              setIsRightFallopianTube(false);
            }}
            checked={!isRightFallopianTube}
          />
        </Grid>
        <Grid item xs={12} lg={2} md={4} sm={6}>
          <FormLabel component="legend">&nbsp;</FormLabel>
          <CustomSelect
            options={fallopianTubeStateOptions}
            label={formatMessage({ id: "state" })}
            name={`[ultrasoundAttached][rightFallopianTubeState]`}
            control={control}
            error={errors?.[`ultrasoundAttached`]?.rightFallopianTubeState}
            disabled={!isRightFallopianTube}
          />
        </Grid>
        <Grid item xs={12} lg={8} md={12} sm={12} >
          <TableContainer>
            <Table stickyHeader aria-label="sticky table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "24%" }} align="center"><FormattedMessage id="type" /></TableCell>
                  <TableCell style={{ width: "23%" }} align="center"><FormattedMessage id="content" /></TableCell>
                  <TableCell style={{ width: "23%" }} align="center"><FormattedMessage id="important-diagnosis" /></TableCell>
                  <TableCell style={{ width: "15%" }} align="center"><FormattedMessage id="size(mm)" /></TableCell>
                  <TableCell style={{ width: "10%" }} >
                    <Button
                      variant="contained"
                      onClick={() => {
                        ultrasoundAttachedItemsRightFallopianTube.append({});
                      }}
                      style={{ padding: "0px 11px", background: "white" }}
                      disabled={watch(`[ultrasoundAttached][rightFallopianTubeState]`)?.value != fallopianTubeStates.Pathological}
                    >
                      <FormattedMessage id="add-new-row" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ultrasoundAttachedItemsRightFallopianTube?.fields.map(({ id }, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={id}>
                      <TableCell style={{ padding: "0px" }}>
                        <CustomSelect
                          options={selectOptions?.ultrasoundAttachedTypes ?? []}
                          label=""
                          placeholder={formatMessage({ id: "type" })}
                          name={`ultrasoundAttachedItemsRightFallopianTube[${index}][ultrasoundAttachedTypeId]`}
                          control={control}
                          error={errors?.[`ultrasoundAttachedItemsRightFallopianTube`]?.[index]?.["ultrasoundAttachedTypeId"]}
                          disabled={watch(`[ultrasoundAttached][rightFallopianTubeState]`)?.value != fallopianTubeStates.Pathological}
                        />
                      </TableCell>
                      <TableCell style={{ padding: "3px" }}>
                        <CustomSelect
                          options={selectOptions?.ultrasoundAttachedContents ?? []}
                          label=""
                          placeholder={formatMessage({ id: "content" })}
                          name={`ultrasoundAttachedItemsRightFallopianTube[${index}][ultrasoundAttachedContentId]`}
                          control={control}
                          error={errors?.[`ultrasoundAttachedItemsRightFallopianTube`]?.[index]?.["ultrasoundAttachedContentId"]}
                          disabled={watch(`[ultrasoundAttached][rightFallopianTubeState]`)?.value != fallopianTubeStates.Pathological}
                        />
                      </TableCell>
                      <TableCell style={{ padding: "3px" }}>
                        <CustomSelect
                          options={selectOptions?.ultrasoundAttachedImpDiagnosises ?? []}
                          label=""
                          placeholder={formatMessage({ id: "diagnosis" })}
                          name={`ultrasoundAttachedItemsRightFallopianTube[${index}][ultrasoundAttachedImpDiagnosisId]`}
                          control={control}
                          error={errors?.[`ultrasoundAttachedItemsRightFallopianTube`]?.[index]?.["ultrasoundAttachedImpDiagnosisId"]}
                          disabled={watch(`[ultrasoundAttached][rightFallopianTubeState]`)?.value != fallopianTubeStates.Pathological}
                        />
                      </TableCell>
                      <TableCell style={{ padding: "3px" }}>
                        <CustomTextBox
                          label=""
                          name={`ultrasoundAttachedItemsRightFallopianTube[${index}][size]`}
                          control={control}
                          error={errors?.[`ultrasoundAttachedItemsRightFallopianTube`]?.[index]?.["size"]}
                          rules={validationRule.textbox({ type: "number" })}
                          disabled={watch(`[ultrasoundAttached][rightFallopianTubeState]`)?.value != fallopianTubeStates.Pathological}
                        />
                      </TableCell>
                      <TableCell>
                        {watch(`[ultrasoundAttached][rightFallopianTubeState]`)?.value == fallopianTubeStates.Pathological &&
                          <TableButtonGroup>
                            <TableEditButton onClick={() => {
                            }}
                            />
                            <DeleteButton
                              onDelete={() => {
                                ultrasoundAttachedItemsRightFallopianTube.remove(index);
                              }}
                            />
                          </TableButtonGroup>
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} lg={2} md={4} sm={6}>
          <FormControl fullWidth style={{ alignItems: "flex-start" }}>
            <span className="text-13 font-medium">Left</span>
          </FormControl>
          <RadioButton
            label="Yes"
            name="isLeftFallopianTube"
            onChange={() => {
              setIsLeftFallopianTube(true);
            }}
            checked={isLeftFallopianTube}
          />
          <RadioButton
            label="No"
            name="isLeftFallopianTube"
            onChange={() => {
              setIsLeftFallopianTube(false);
            }}
            checked={!isLeftFallopianTube}
          />
        </Grid>
        <Grid item xs={12} lg={2} md={4} sm={6}>
          <FormLabel component="legend">&nbsp;</FormLabel>
          <CustomSelect
            options={fallopianTubeStateOptions}
            label={formatMessage({ id: "state" })}
            name={`[ultrasoundAttached][leftFallopianTubeState]`}
            control={control}
            error={errors?.[`ultrasoundAttached`]?.leftFallopianTubeState}
            disabled={!isLeftFallopianTube}
          />
        </Grid>
        <Grid item xs={12} lg={8} md={12} sm={12}>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: "24%" }} align="center"><FormattedMessage id="type" /></TableCell>
                  <TableCell style={{ width: "23%" }} align="center"><FormattedMessage id="content" /></TableCell>
                  <TableCell style={{ width: "23%" }} align="center"><FormattedMessage id="important-diagnosis" /></TableCell>
                  <TableCell style={{ width: "15%" }} align="center"><FormattedMessage id="size(mm)" /></TableCell>
                  <TableCell style={{ width: "10%" }} >
                    <Button
                      variant="contained"
                      onClick={() => {
                        ultrasoundAttachedItemsLeftFallopianTube.append({});
                      }}
                      style={{ padding: "0px 11px", background: "white" }}
                      disabled={watch(`[ultrasoundAttached][leftFallopianTubeState]`)?.value != fallopianTubeStates.Pathological}
                    >
                      <FormattedMessage id="add-new-row" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ultrasoundAttachedItemsLeftFallopianTube?.fields.map(({ id }, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={id}>
                      <TableCell style={{ padding: "0px" }}>
                        <CustomSelect
                          options={selectOptions?.ultrasoundAttachedTypes ?? []}
                          label=""
                          placeholder={formatMessage({ id: "type" })}
                          name={`ultrasoundAttachedItemsLeftFallopianTube[${index}][ultrasoundAttachedTypeId]`}
                          control={control}
                          error={errors?.[`ultrasoundAttachedItemsLeftFallopianTube`]?.[index]?.["ultrasoundAttachedTypeId"]}
                          disabled={watch(`[ultrasoundAttached][leftFallopianTubeState]`)?.value != fallopianTubeStates.Pathological}
                        />
                      </TableCell>
                      <TableCell style={{ padding: "3px" }}>
                        <CustomSelect
                          options={selectOptions?.ultrasoundAttachedContents ?? []}
                          label=""
                          placeholder={formatMessage({ id: "content" })}
                          name={`ultrasoundAttachedItemsLeftFallopianTube[${index}][ultrasoundAttachedContentId]`}
                          control={control}
                          error={errors?.[`ultrasoundAttachedItemsLeftFallopianTube`]?.[index]?.["ultrasoundAttachedContentId"]}
                          disabled={watch(`[ultrasoundAttached][leftFallopianTubeState]`)?.value != fallopianTubeStates.Pathological}
                        />
                      </TableCell>
                      <TableCell style={{ padding: "3px" }}>
                        <CustomSelect
                          options={selectOptions?.ultrasoundAttachedImpDiagnosises ?? []}
                          label=""
                          placeholder={formatMessage({ id: "diagnosis" })}
                          name={`ultrasoundAttachedItemsLeftFallopianTube[${index}][ultrasoundAttachedImpDiagnosisId]`}
                          control={control}
                          error={errors?.[`ultrasoundAttachedItemsLeftFallopianTube`]?.[index]?.["ultrasoundAttachedImpDiagnosisId"]}
                          disabled={watch(`[ultrasoundAttached][leftFallopianTubeState]`)?.value != fallopianTubeStates.Pathological}
                        />
                      </TableCell>
                      <TableCell style={{ padding: "3px" }}>
                        <CustomTextBox
                          label=""
                          name={`ultrasoundAttachedItemsLeftFallopianTube[${index}][size]`}
                          control={control}
                          error={errors?.[`ultrasoundAttachedItemsLeftFallopianTube`]?.[index]?.["size"]}
                          rules={validationRule.textbox({ type: "textWithNumber" })}
                          disabled={watch(`[ultrasoundAttached][leftFallopianTubeState]`)?.value != fallopianTubeStates.Pathological}
                        />
                      </TableCell>
                      <TableCell>
                        {watch(`[ultrasoundAttached][leftFallopianTubeState]`)?.value == fallopianTubeStates.Pathological &&
                          <TableButtonGroup>
                            <TableEditButton onClick={() => {
                            }}
                            />
                            <DeleteButton
                              onDelete={() => {
                                ultrasoundAttachedItemsLeftFallopianTube.remove(index);
                              }}
                            />
                          </TableButtonGroup>
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <Box>
            <h3 className="formHeading">
              <FormattedMessage id="peritonium" />
            </h3>
          </Box>
        </Grid>
        <Grid item xs={12} lg={2} md={4} sm={6}>
          <FormControl fullWidth style={{ alignItems: "flex-start" }}>
            <span className="text-13 font-medium">{formatMessage({ id: "free-liquid" })}</span>
          </FormControl>
          <RadioButton
            label="Yes"
            name="isFreeLiquid"
            onChange={() => {
              setIsFreeLiquid(true);
            }}
            checked={isFreeLiquid}
          />

          <RadioButton
            label="No"
            name="isFreeLiquid"
            onChange={() => {
              setIsFreeLiquid(false);
            }}
            checked={!isFreeLiquid}
          />
        </Grid>
        <Grid item xs={12} lg={2} md={4} sm={6}>
          <FormLabel component="legend">&nbsp;</FormLabel>
          <CustomSelect
            options={selectOptions?.ultrasoundAttachedLocations ?? []}
            label={formatMessage({ id: "location" })}
            name={`[ultrasoundAttached][ultrasoundAttachedLocationId]`}
            control={control}
            error={errors?.[`ultrasoundAttached`]?.ultrasoundAttachedLocationId}
            disabled={!isFreeLiquid}
          />
        </Grid>

        <Grid item xs={12} lg={8} md={12} sm={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={2} md={4} sm={6}>
              <CustomCheckBox
                name={`[ultrasoundAttached][rightPeritoneum]`}
                label={formatMessage({ id: "right" })}
                control={control}
                disabled={watch(`[ultrasoundAttached][ultrasoundAttachedLocationId]`)?.value != 3}
              />
            </Grid>
            <Grid item xs={12} lg={2} md={4} sm={6}>
              <CustomTextBox
                label={formatMessage({ id: "length(mm)" })}
                name={`[ultrasoundAttached][rightPeritoneumLength]`}
                control={control}
                error={errors?.[`ultrasoundAttached`]?.rightPeritoneumLength}
                disabled={!watch(`[ultrasoundAttached][rightPeritoneum]`)}
              />
            </Grid>
            <Grid item xs={12} lg={2} md={4} sm={6}>
              <CustomTextBox
                label={formatMessage({ id: "cross-section(mm)" })}
                name={`[ultrasoundAttached][rightPeritoneumCrossSection]`}
                control={control}
                error={errors?.[`ultrasoundAttached`]?.rightPeritoneumCrossSection}
                disabled={!watch(`[ultrasoundAttached][rightPeritoneum]`)}
              />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
              <CustomTextBox
                label={formatMessage({ id: "antero-posterior(mm)" })}
                name={`[ultrasoundAttached][rightPeritoneumAntPost]`}
                control={control}
                error={errors?.[`ultrasoundAttached`]?.rightPeritoneumAntPost}
                disabled={!watch(`[ultrasoundAttached][rightPeritoneum]`)}
              />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
              <CustomTextBox
                label={formatMessage({ id: "volume(mm3)" })}
                name={`[ultrasoundAttached][rightPeritoneumVolume]`}
                control={control}
                error={errors?.[`ultrasoundAttached`]?.rightPeritoneumVolume}
                disabled={!watch(`[ultrasoundAttached][rightPeritoneum]`)}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} lg={2} md={4} sm={6}>
              <CustomCheckBox
                name="[ultrasoundAttached][leftPeritoneum]"
                label={formatMessage({ id: "left" })}
                control={control}
                disabled={watch(`[ultrasoundAttached][ultrasoundAttachedLocationId]`)?.value != 3}
              />
            </Grid>
            <Grid item xs={12} lg={2} md={4} sm={6}>
              <CustomTextBox
                label={formatMessage({ id: "length(mm)" })}
                name={`[ultrasoundAttached][leftPeritoneumLength]`}
                control={control}
                error={errors?.[`ultrasoundAttached`]?.leftPeritoneumLength}
                disabled={!watch(`[ultrasoundAttached][leftPeritoneum]`)}
              />
            </Grid>
            <Grid item xs={12} lg={2} md={4} sm={6}>
              <CustomTextBox
                label={formatMessage({ id: "cross-section(mm)" })}
                name={`[ultrasoundAttached][leftPeritoneumCrossSection]`}
                control={control}
                error={errors?.[`ultrasoundAttached`]?.leftPeritoneumCrossSection}
                disabled={!watch(`[ultrasoundAttached][leftPeritoneum]`)}
              />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
              <CustomTextBox
                label={formatMessage({ id: "antero-posterior(mm)" })}
                name={`[ultrasoundAttached][leftPeritoneumAntPost]`}
                control={control}
                error={errors?.[`ultrasoundAttached`]?.leftPeritoneumAntPost}
                disabled={!watch(`[ultrasoundAttached][leftPeritoneum]`)}
              />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={6}>
              <CustomTextBox
                label={formatMessage({ id: "volume(mm3)" })}
                name={`[ultrasoundAttached][leftPeritoneumVolume]`}
                control={control}
                error={errors?.[`ultrasoundAttached`]?.leftPeritoneumVolume}
                disabled={!watch(`[ultrasoundAttached][leftPeritoneum]`)}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={2} md={4} sm={6}>
          <FormControl fullWidth style={{ alignItems: "flex-start" }}>
            <span className="text-13 font-medium">{formatMessage({ id: "ashermans-syndrome" })}</span>
          </FormControl>
          <RadioButton
            label="Yes"
            name="isAshermanSyndrome"
            onChange={() => {
              setIsAshermanSyndrome(true);
            }}
            checked={isAshermanSyndrome}
          />

          <RadioButton
            label="No"
            name="isAshermanSyndrome"
            onChange={() => {
              setIsAshermanSyndrome(false);
            }}
            checked={!isAshermanSyndrome}
          />
        </Grid>
        <Grid item xs={12} lg={2} md={4} sm={6}>
          <FormControl fullWidth style={{ alignItems: "flex-start" }}>
            <span className="text-13 font-medium">{formatMessage({ id: "other-paraovarian" })}</span>
          </FormControl>
          <RadioButton
            label="Yes"
            name="otherParaOvarian"
            onChange={() => {
              setOtherParaOvarian(true);
            }}
            checked={otherParaOvarian}
          />

          <RadioButton
            label="No"
            name="otherParaOvarian"
            onChange={() => {
              setOtherParaOvarian(false);
            }}
            checked={!otherParaOvarian}
          />
        </Grid>

        <Grid item xs={12} lg={8} md={12} sm={12} style={{ marginTop: "15px" }}>
          <Grid container spacing={3} style={{ display: "flex", alignItems: "center" }}>
            <Grid item xs={12} lg={2} md={4} sm={6}>
              <CustomCheckBox
                name="[ultrasoundAttached][rightOtherParaOvarian]"
                label={formatMessage({ id: "right" })}
                control={control}
                disabled={!otherParaOvarian}
              />
            </Grid>
            <Grid item xs={12} lg={2} md={4} sm={6}>
              <CustomTextBox
                label={formatMessage({ id: "size(mm)" })}
                name={`[ultrasoundAttached][rightSize]`}
                control={control}
                error={errors?.[`ultrasoundAttached`]?.rightSize}
                disabled={!watch("[ultrasoundAttached][rightOtherParaOvarian]")}
              />
            </Grid>
            <Grid item >*</Grid>
            <Grid item xs={12} lg={2} md={4} sm={6}>
              <CustomTextBox
                label={formatMessage({ id: "size(mm)" })}
                name={`[ultrasoundAttached][rightSize1]`}
                control={control}
                error={errors?.[`ultrasoundAttached`]?.rightSize1}
                disabled={!watch("[ultrasoundAttached][rightOtherParaOvarian]")}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ display: "flex", alignItems: "center" }}>
            <Grid item xs={12} lg={2} md={4} sm={6}>
              <CustomCheckBox
                name="[ultrasoundAttached][leftOtherParaOvarian]"
                label={formatMessage({ id: "left" })}
                control={control}
                disabled={!otherParaOvarian}
              />
            </Grid>
            <Grid item xs={12} lg={2} md={4} sm={6}>
              <CustomTextBox
                label={formatMessage({ id: "size(mm)" })}
                name={`[ultrasoundAttached][leftSize]`}
                control={control}
                error={errors?.[`ultrasoundAttached`]?.leftSize}
                disabled={!watch("[ultrasoundAttached][leftOtherParaOvarian]")}
              />
            </Grid>
            <Grid item>*</Grid>
            <Grid item xs={12} lg={2} md={4} sm={6}>
              <CustomTextBox
                label={formatMessage({ id: "size(mm)" })}
                name={`[ultrasoundAttached][leftSize1]`}
                control={control}
                error={errors?.[`ultrasoundAttached`]?.leftSize1}
                disabled={!watch("[ultrasoundAttached][leftOtherParaOvarian]")}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box >
  );
};

export default Attached;
