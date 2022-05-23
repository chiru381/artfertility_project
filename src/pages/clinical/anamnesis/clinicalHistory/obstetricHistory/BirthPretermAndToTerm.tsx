import { useState, useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { ControllerProps } from "react-hook-form";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import FormControl from '@material-ui/core/FormControl';

import { TableButtonGroup, DeleteButton } from 'components/button';
import { CustomCheckBox, CustomTextBox, RadioButton, CustomSelect } from "components/forms";
import { masterPaginationServices, weightUnitOptions, yesNoOptions } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { PaperWithLabel } from "components";

interface Props {
  control: ControllerProps["control"];
  hasIntrauterineGrowthRestriction: boolean;
  setHasIntrauterineGrowthRestriction: (data: any) => void;
  deliveryModeId: number;
  setDeliveryModeId: (data: any) => void;
  watch: any;
  errors: any;
}

const BirthPretermAndToTerm = (props: Props) => {
  const { control, watch, errors, hasIntrauterineGrowthRestriction, setHasIntrauterineGrowthRestriction, deliveryModeId, setDeliveryModeId } = props;
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { fields, append, remove } = useFieldArray({ control, name: "obstetricHistoryItemBirthDetails" });
  const obstetricHistoryItemObstetricPathologies = useFieldArray({ control, name: "obstetricHistoryItemObstetricPathologies" });
  const obstetricHistoryItemPuerperalPathologies = useFieldArray({ control, name: "obstetricHistoryItemPuerperalPathologies" });

  const { deliveryModeData, puerperalPathologyData, obstetricPathologyData, genderData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      deliveryModeData: masterPaginationReducer[masterPaginationServices.deliveryMode].data,
      puerperalPathologyData: masterPaginationReducer[masterPaginationServices.puerperalPathology].data,
      obstetricPathologyData: masterPaginationReducer[masterPaginationServices.obstetricPathology].data,
      genderData: masterPaginationReducer[masterPaginationServices.gender].data,
    }),
    shallowEqual
  );

  let puerperalPathologyOptions = puerperalPathologyData.modelItems?.map((option: any) => ({ puerperalPathologyName: option.name, puerperalPathologyId: option.id, isSelected: false, remarks: '' }));
  let obstetricPathologyOptions = obstetricPathologyData.modelItems?.map((option: any) => ({ obstetricPathologyName: option.name, obstetricPathologyId: option.id, isSelected: false }));
  let genderOptions = genderData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

  const { modelItems } = deliveryModeData;

  useEffect(() => {
    if (fields?.length == 0) {
      append({});
    }
  }, []);

  useEffect(() => {
    if (puerperalPathologyOptions?.length && obstetricPathologyOptions?.length) {
      if (obstetricHistoryItemObstetricPathologies?.fields?.length == 0) {
        obstetricHistoryItemObstetricPathologies.append(obstetricPathologyOptions);
      }
      if (obstetricHistoryItemPuerperalPathologies.fields?.length == 0) {
        obstetricHistoryItemPuerperalPathologies.append(puerperalPathologyOptions);
      }
    }
  }, [puerperalPathologyOptions?.length && obstetricPathologyOptions?.length])

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={4} md={4} sm={6}>
        <CustomTextBox
          label={formatMessage({ id: "stillbirths" })}
          name="stillBirth"
          control={control}
          rules={validationRule.textbox({ type: "number" })}
        />
      </Grid>
      <Grid item xs={12} lg={4} md={4} sm={6}>
        <CustomTextBox
          label={formatMessage({ id: "live-child" })}
          name="liveChild"
          control={control}
          rules={validationRule.textbox({ type: "number" })}
        />
      </Grid>

      <Grid item xs={12} lg={12} md={12} sm={12} >
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "50%" }}> <FormattedMessage id="lc" /></TableCell>
                <TableCell style={{ width: "15%" }} align="center"> <FormattedMessage id="weight" /></TableCell>
                <TableCell><FormattedMessage id="weight-unit" /></TableCell>
                <TableCell style={{ width: "15%" }}><FormattedMessage id="gender" /></TableCell>
                <TableCell><FormattedMessage id="observations" /></TableCell>
                <TableCell style={{ width: "20%" }}>
                  <Button
                    variant="contained"
                    onClick={() => { append({}); }}
                    style={{
                      padding: "0px 11px",
                      background: "white",
                    }}
                  >
                    <FormattedMessage id="add" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ padding: "9px 0.1rem" }}>
              {fields.map(({ id }, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={id}>
                    <TableCell style={{ paddingLeft: "0px", paddingRight: "0px" }}>
                      <CustomSelect
                        label=""
                        options={yesNoOptions}
                        name={`obstetricHistoryItemBirthDetails[${index}][isLiveChild]`}
                        control={control}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomTextBox
                        label=""
                        name={`obstetricHistoryItemBirthDetails[${index}][babyWeight]`}
                        control={control}
                        rules={validationRule.textbox({ type: "number", })}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <CustomSelect
                        label=""
                        options={weightUnitOptions}
                        name={`obstetricHistoryItemBirthDetails[${index}][weightUnit]`}
                        control={control}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={genderOptions}
                        label=""
                        name={`obstetricHistoryItemBirthDetails[${index}][genderId]`}
                        control={control}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`obstetricHistoryItemBirthDetails[${index}][observations]`}
                        control={control}
                        rules={validationRule.textbox({ maxLength: 50 })}
                      />
                    </TableCell>
                    <TableCell style={{ position: "relative" }}>
                      {fields.length - 1 !== 0 && (
                        <TableButtonGroup>
                          <DeleteButton
                            onDelete={() => {
                              remove(index);
                            }}
                          />
                        </TableButtonGroup>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={12} lg={12} md={12} sm={12}>
        <PaperWithLabel label={formatMessage({ id: "delivery-mode" })}>
          <>
            {modelItems?.map((item: any, index: any) => {
              return (
                <RadioButton
                  key={index}
                  label={item.name}
                  name="deliveryModeId"
                  onChange={() => {
                    setDeliveryModeId(item.id);
                  }}
                  checked={deliveryModeId == item.id ? true : false}
                />
              )
            })}
          </>
        </PaperWithLabel>
      </Grid>

      <Grid item xs={12} lg={12} md={12} sm={12}>
        <FormControl fullWidth>
          <span className="text-14 font-medium">{formatMessage({ id: "iugr" })}</span>
        </FormControl>
        <RadioButton
          label="Yes"
          name="hasIntrauterineGrowthRestriction"
          onChange={() => {
            setHasIntrauterineGrowthRestriction(true);
          }}
          checked={hasIntrauterineGrowthRestriction}
        />
        <RadioButton
          label="No"
          name="hasIntrauterineGrowthRestriction"
          onChange={() => {
            setHasIntrauterineGrowthRestriction(false);
          }}
          checked={!hasIntrauterineGrowthRestriction}
        />
      </Grid>

      <Grid item xs={12} lg={12} md={12} sm={12}>
        <PaperWithLabel label={formatMessage({ id: "obstetric-pathology" })}>
          <>
            {obstetricHistoryItemObstetricPathologies?.fields.map(({ id, obstetricPathologyName }: any, index) => {
              return (
                <CustomCheckBox
                  key={id}
                  name={`obstetricHistoryItemObstetricPathologies[${index}][isSelected]`}
                  label={formatMessage({ id: `${obstetricPathologyName}` })}
                  control={control}
                />
              )
            })}
          </>
        </PaperWithLabel>
      </Grid>
      <Grid item xs={12} lg={12} md={12} sm={12}>
        <CustomTextBox
          label={formatMessage({ id: "remarks" })}
          name="observations"
          control={control}
          rules={validationRule.textbox({ maxLength: 200 })}
        />
      </Grid>
      <Grid item xs={12} lg={12} md={12} sm={12}>
        <PaperWithLabel label={formatMessage({ id: "puerperal-pathology" })}>
          <>
            {obstetricHistoryItemPuerperalPathologies?.fields.map(({ id, puerperalPathologyName }: any, index) => {
              return (
                <Grid container spacing={3} item xs={12} key={id}>
                  <Grid item xs={12} lg={4} md={8} sm={6}>
                    <CustomCheckBox
                      name={`obstetricHistoryItemPuerperalPathologies[${index}][isSelected]`}
                      label={formatMessage({ id: `${puerperalPathologyName}` })}
                      control={control}
                    />
                  </Grid>
                  <Grid item xs={12} lg={8} md={12} sm={12}>
                    <CustomTextBox
                      label={formatMessage({ id: "remarks" })}
                      name={`obstetricHistoryItemPuerperalPathologies[${index}][remarks]`}
                      control={control}
                      rules={validationRule.textbox({ maxLength: 20 })}
                      error={errors?.[`obstetricHistoryItemPuerperalPathologies`]?.[index]?.["remarks"]}
                      disabled={!watch(`obstetricHistoryItemPuerperalPathologies[${index}][isSelected]`)}
                    />
                  </Grid>
                </Grid>
              )
            })}
          </>
        </PaperWithLabel>
      </Grid>
      <Grid item xs={12} lg={12} md={12} sm={12}>
        <CustomTextBox
          label={formatMessage({ id: "complications" })}
          name="complications"
          control={control}
        />
      </Grid>
    </Grid>
  );
};

export default BirthPretermAndToTerm;
