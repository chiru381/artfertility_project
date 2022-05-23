import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useSelector, shallowEqual } from "react-redux";
import { ControllerProps } from "react-hook-form";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import FormControl from '@material-ui/core/FormControl';

import { TableEditButton, DeleteButton, TableButtonGroup } from "components/button";
import { CustomSelect, CustomTextBox, CustomCheckBox, RadioButton } from "components/forms";
import { uterineTypeOptions, uterineCavityTypeOptions, adenomyosisTypeOptions, cervixAngleOptions, uterineTypes, adenomyosisTypes } from "utils/constants";
import { validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useCreateLookupOptions } from "utils/hooks";

interface Props {
  control: ControllerProps["control"];
  isthmocele: boolean;
  isCervicalPathology: boolean;
  setIsthmocele: (data: any) => void;
  setIsCervicalPathology: (data: any) => void;
  formData: any,
  errors: any;
  reset: any;
  getValues: any;
  watch: any
}

const Uterus = (props: Props) => {

  const { control, errors, watch, getValues, reset, formData, isthmocele, isCervicalPathology, setIsthmocele, setIsCervicalPathology } = props;

  const { formatMessage } = useIntl();

  const { fields, append, remove } = useFieldArray({ control, name: "ultrasoundUterusMyomas" });
  const ultrasoundUterusAdenomyosises = useFieldArray({ control, name: "ultrasoundUterusAdenomyosises" });

  const { usgLookupData } =
    useSelector(({ usgLookupReducer }: RootReducerState) => ({
      usgLookupData: usgLookupReducer.data
    }),
      shallowEqual
    );

  // Lookup options for dropdown
  let selectOptions = useCreateLookupOptions(usgLookupData);

  useEffect(() => {
    addMyomas();
    addAdenomyosises();
  }, []);

  useEffect(() => {
    if (Object.keys(formData)?.length) {
      reset({
        ...getValues(),
        ultrasoundUterusMyomas: formData?.ultrasoundUterusMyomas,
        ultrasoundUterusAdenomyosises: formData?.ultrasoundUterusAdenomyosises
      });

      if(formData?.ultrasoundUterusMyomas?.length==0){
        addMyomas();
      }
      if(formData?.ultrasoundUterusMyomas?.length==0){
        addAdenomyosises();
      }
    }
  }, [Object.keys(formData)?.length]);

  function addMyomas() {
    append({});
  }

  function addAdenomyosises() {
    ultrasoundUterusAdenomyosises.append({})
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box>
          <h3 className="formHeading" style={{ border: "none" }}>
            <FormattedMessage id="uterine-morphology-and-dimensions" />
          </h3>
        </Box>
      </Grid>

      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomSelect
          options={uterineTypeOptions}
          label={formatMessage({ id: "type" })}
          name={`[ultrasoundUterus][uterineType]`}
          control={control}
          error={errors?.[`ultrasoundUterus`]?.uterineType}
        />
      </Grid>
      <Grid item xs={12} lg={2} md={4} sm={6}>
        <CustomCheckBox
          label="Enlarged"
          name={`[ultrasoundUterus][isEnlarged]`}
          control={control}
          disabled={watch("[ultrasoundUterus][uterineType]")?.value != uterineTypes.Abnormal}
        />
      </Grid>
      <Grid item xs={12} lg={2} md={4} sm={6}>
        <CustomCheckBox
          label="Myomatous"
          name={`[ultrasoundUterus][isMyomatous]`}
          control={control}
          disabled={watch("[ultrasoundUterus][uterineType]")?.value != uterineTypes.Abnormal}
        />
      </Grid>
      <Grid item xs={12} lg={2} md={4} sm={6}>
        <CustomCheckBox
          label="Adenomyotic"
          name={`[ultrasoundUterus][isAdenomyotic]`}
          control={control}
          disabled={watch("[ultrasoundUterus][uterineType]")?.value != uterineTypes.Abnormal}
        />
      </Grid>
      <Grid item xs={12} lg={2} md={4} sm={6}>
        <CustomCheckBox
          label="Malformed"
          name={`[ultrasoundUterus][isMalformed]`}
          control={control}
          disabled={watch("[ultrasoundUterus][uterineType]")?.value != uterineTypes.Abnormal}
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomSelect
          options={selectOptions?.malformations ?? []}
          label={formatMessage({ id: "malformation" })}
          name={`[ultrasoundUterus][malformationId]`}
          control={control}
          error={errors?.[`ultrasoundUterus`]?.malformationId}
          disabled={!watch("[ultrasoundUterus][isMalformed]")}
        />
      </Grid>
      <Grid item xs={12}>
        <Box>
          <h3 className="formHeading" style={{ margin: "0px" }}>
            <FormattedMessage id="myoma" />
          </h3>
        </Box>
      </Grid>
      <Grid item xs={12} lg={2} style={{ paddingTop: "0px", paddingBottom: "0px" }}>
        <CustomCheckBox
          label={formatMessage({ id: "child-uterus" })}
          name={`[ultrasoundUterus][isChildUterus]`}
          control={control}
        />
      </Grid>
      <Grid item xs={12} lg={12} md={12} sm={12}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "10%" }}><FormattedMessage id="type" /></TableCell>
                <TableCell style={{ width: "15%" }}><FormattedMessage id="location" /></TableCell>
                <TableCell style={{ width: "15%" }}><FormattedMessage id="height" /></TableCell>
                <TableCell style={{ width: "20%" }}><FormattedMessage id="size(mm)" /></TableCell>
                <TableCell style={{ width: "15%" }}><FormattedMessage id="appearance" /></TableCell>
                <TableCell style={{ width: "10%" }}>
                  <Button
                    variant="contained"
                    onClick={() => { addMyomas() }}
                    style={{ padding: "0px 11px", background: "white" }}
                    disabled={!watch("[ultrasoundUterus][isMyomatous]")}
                  >
                    <FormattedMessage id="add-new-row" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map(({ id }, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={id}>
                    <TableCell>
                      <CustomSelect
                        options={selectOptions?.myomaTypes ?? []}
                        label=""
                        name={`ultrasoundUterusMyomas[${index}][myomaTypeId]`}
                        control={control}
                        error={errors?.[`ultrasoundUterusMyomas`]?.[index]?.["myomaTypeId"]}
                        placeholder={formatMessage({ id: "type" })}
                        disabled={!watch("[ultrasoundUterus][isMyomatous]")}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={selectOptions?.myomaLocations ?? []}
                        label=""
                        name={`ultrasoundUterusMyomas[${index}][myomaLocationId]`}
                        control={control}
                        error={errors?.[`ultrasoundUterusMyomas`]?.[index]?.["myomaLocationId"]}
                        placeholder={formatMessage({ id: "location" })}
                        disabled={!watch("[ultrasoundUterus][isMyomatous]")}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={selectOptions?.myomaHeights ?? []}
                        label=""
                        name={`ultrasoundUterusMyomas[${index}][myomaHeightId]`}
                        control={control}
                        error={errors?.[`ultrasoundUterusMyomas`]?.[index]?.["myomaHeightId"]}
                        placeholder={formatMessage({ id: "height" })}
                        disabled={!watch("[ultrasoundUterus][isMyomatous]")}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`ultrasoundUterusMyomas[${index}][size]`}
                        control={control}
                        error={errors?.[`ultrasoundUterusMyomas`]?.[index]?.["size"]}
                        rules={validationRule.textbox({ type: "number" })}
                        placeholder={formatMessage({ id: "size" })}
                        disabled={!watch("[ultrasoundUterus][isMyomatous]")}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={selectOptions?.appearances ?? []}
                        label=""
                        name={`ultrasoundUterusMyomas[${index}][appearanceId]`}
                        control={control}
                        error={errors?.[`ultrasoundUterusMyomas`]?.[index]?.["appearanceId"]}
                        placeholder={formatMessage({ id: "appearance" })}
                        disabled={!watch("[ultrasoundUterus][isMyomatous]")}
                      />
                    </TableCell>
                    <TableCell>
                      <TableButtonGroup>
                        {/* <TableEditButton onClick={() => {
                        }}
                        /> */}
                        <DeleteButton
                          onDelete={() => {
                            remove(index);
                          }}
                          disabled={!watch("[ultrasoundUterus][isMyomatous]")}
                        />
                      </TableButtonGroup>

                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={12}>
        <Box>
          <h3 className="formHeading" style={{ border: "none" }}>
            <FormattedMessage id="adenomyosis" />
          </h3>
        </Box>
      </Grid>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomSelect
          options={adenomyosisTypeOptions}
          label={formatMessage({ id: "type" })}
          name={`[ultrasoundUterus][adenomyosisType]`}
          control={control}
          error={errors?.[`ultrasoundUterus`]?.adenomyosisType}
          disabled={!watch("[ultrasoundUterus][isAdenomyotic]")}
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomTextBox
          label={formatMessage({ id: "length(mm)" })}
          name={`[ultrasoundUterus][uterusLength]`}
          control={control}
          error={errors?.[`ultrasoundUterus`]?.uterusLength}
          rules={validationRule.textbox({ type: "number" })}
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomTextBox
          label={formatMessage({ id: "cross-section(mm)" })}
          name={`[ultrasoundUterus][crossSection]`}
          control={control}
          error={errors?.[`ultrasoundUterus`]?.crossSection}
          rules={validationRule.textbox({ type: "number" })}
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomTextBox
          label={formatMessage({ id: "antero-posterior(mm)" })}
          name={`[ultrasoundUterus][anteriorPosterior]`}
          control={control}
          error={errors?.[`ultrasoundUterus`]?.anteriorPosterior}
          rules={validationRule.textbox({ type: "number" })}
        />
      </Grid>
      <Grid item xs={12} lg={12} md={12} sm={12}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "30%" }}><FormattedMessage id="location" /></TableCell>
                <TableCell style={{ width: "25%" }}><FormattedMessage id="height" /></TableCell>
                <TableCell style={{ width: "25%" }}><FormattedMessage id="size(mm)" /></TableCell>
                <TableCell style={{ width: "10%" }}>
                  <Button
                    variant="contained"
                    onClick={() => { addAdenomyosises() }}
                    style={{ padding: "0px 11px", background: "white" }}
                    disabled={watch("[ultrasoundUterus][adenomyosisType]")?.value != adenomyosisTypes.Focal}
                  >
                    <FormattedMessage id="add-new-row" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ultrasoundUterusAdenomyosises?.fields?.map(({ id }, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={id}>
                    <TableCell>
                      <CustomSelect
                        options={selectOptions?.adenomyosisLocations ?? []}
                        label=""
                        name={`ultrasoundUterusAdenomyosises[${index}][adenomyosisLocationId]`}
                        control={control}
                        error={errors?.[`ultrasoundUterusAdenomyosises`]?.[index]?.["adenomyosisLocationId"]}
                        placeholder={formatMessage({ id: "location" })}
                        disabled={watch("[ultrasoundUterus][adenomyosisType]")?.value != adenomyosisTypes.Focal}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={selectOptions?.edenomyosisHeights ?? []}
                        label=""
                        name={`ultrasoundUterusAdenomyosises[${index}][adenomyosisHeightId]`}
                        control={control}
                        error={errors?.[`ultrasoundUterusAdenomyosises`]?.[index]?.["adenomyosisHeightId"]}
                        placeholder={formatMessage({ id: "height" })}
                        disabled={watch("[ultrasoundUterus][adenomyosisType]")?.value != adenomyosisTypes.Focal}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`ultrasoundUterusAdenomyosises[${index}][size]`}
                        control={control}
                        error={errors?.[`ultrasoundUterusAdenomyosises`]?.[index]?.["size"]}
                        rules={validationRule.textbox({ type: "number" })}
                        placeholder={formatMessage({ id: "size" })}
                        disabled={watch("[ultrasoundUterus][adenomyosisType]")?.value != adenomyosisTypes.Focal}
                      />
                    </TableCell>
                    <TableCell>
                      <TableButtonGroup>
                        <TableEditButton onClick={() => {
                          addAdenomyosises();
                        }}
                          disabled={watch("[ultrasoundUterus][adenomyosisType]")?.value != adenomyosisTypes.Focal}
                        />
                        <DeleteButton
                          onDelete={() => {
                            remove(index);
                          }}
                          disabled={watch("[ultrasoundUterus][adenomyosisType]")?.value != adenomyosisTypes.Focal}
                        />
                      </TableButtonGroup>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      <Grid item xs={12}>
        <Box>
          <h3 className="formHeading">
            <FormattedMessage id="uterine-cavity" />
          </h3>
        </Box>
      </Grid>

      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomSelect
          options={uterineCavityTypeOptions}
          label={formatMessage({ id: "type" })}
          name={`[ultrasoundUterus][uterineCavityType]`}
          control={control}
          error={errors?.[`ultrasoundUterus`]?.uterineCavityType}
        />
      </Grid>
      <Grid item xs={12} lg={2} md={4} sm={6}>
        <CustomTextBox
          label={formatMessage({ id: "hysterometry" })}
          name={`[ultrasoundUterus][hysterometry]`}
          control={control}
          rules={validationRule.textbox({ type: "number" })}
          error={errors?.[`ultrasoundUterus`]?.hysterometry}
        />
      </Grid>
      <Grid item xs={12} lg={2} md={4} sm={6}>
        <CustomTextBox
          label={formatMessage({ id: "distal-background" })}
          name={`[ultrasoundUterus][distBackground]`}
          control={control}
          rules={validationRule.textbox({ type: "number" })}
          error={errors?.[`ultrasoundUterus`]?.distBackground}
        />
      </Grid>
      <Grid item xs={12} lg={2} md={4} sm={6}>
        <CustomTextBox
          label={formatMessage({ id: "cervical-trajectory" })}
          name={`[ultrasoundUterus][cervicalTraject]`}
          control={control}
          rules={validationRule.textbox({ type: "number" })}
          error={errors?.[`ultrasoundUterus`]?.cervicalTraject}
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomTextBox
          label={formatMessage({ id: "distal-interostium" })}
          name={`[ultrasoundUterus][distInterostium]`}
          control={control}
          rules={validationRule.textbox({ type: "number" })}
          error={errors?.[`ultrasoundUterus`]?.distInterostium}
        />
      </Grid>

      <Grid item xs={12} lg={2} md={4} sm={6}>
        <FormControl fullWidth style={{ alignItems: "flex-start" }}>
          <span className="text-13 font-medium">{formatMessage({ id: "isthmocele" })}</span>
        </FormControl>
        <RadioButton
          label="Yes"
          name="isthmocele"
          onChange={() => {
            setIsthmocele(true);
          }}
          checked={isthmocele}
        />

        <RadioButton
          label="No"
          name="isthmocele"
          onChange={() => {
            setIsthmocele(false);
          }}
          checked={!isthmocele}
        />
      </Grid>
      <Grid item xs={12} lg={2} md={4} sm={6}>
        <FormControl fullWidth style={{ alignItems: "flex-start" }}>
          <span className="text-13 font-medium">{formatMessage({ id: "cervical-pathology" })}</span>
        </FormControl>
        <RadioButton
          label="Yes"
          name="isCervicalPathology"
          onChange={() => {
            setIsCervicalPathology(true);
          }}
          checked={isCervicalPathology}
        />

        <RadioButton
          label="No"
          name="isCervicalPathology"
          onChange={() => {
            setIsCervicalPathology(false);
          }}
          checked={!isCervicalPathology}
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomSelect
          style={{ marginTop: "20px" }}
          options={selectOptions?.cervicalPathologies ?? []}
          label={formatMessage({ id: "cervical-pathology-details" })}
          name={`[ultrasoundUterus][cervicalPathologyId]`}
          control={control}
          error={errors?.[`ultrasoundUterus`]?.cervicalPathologyId}
          disabled={!isCervicalPathology}
        />
      </Grid>

      <Grid item xs={12}>
        <Box>
          <h3 className="formHeading">
            <FormattedMessage id="cervix" />
          </h3>
        </Box>
      </Grid>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomSelect
          options={cervixAngleOptions}
          label={formatMessage({ id: "cervix-angle" })}
          name={`[ultrasoundUterus][cervixAngle]`}
          control={control}
          error={errors?.[`ultrasoundUterus`]?.cervixAngle}
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomTextBox
          label={formatMessage({ id: "cervical-length" })}
          name={`[ultrasoundUterus][cervixLength]`}
          control={control}
          error={errors?.[`ultrasoundUterus`]?.cervixLength}
          rules={validationRule.textbox({ type: "number" })}
        />
      </Grid>
    </Grid>
  );
};

export default Uterus;

