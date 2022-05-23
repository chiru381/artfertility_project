import { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { ControllerProps } from "react-hook-form";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import FormControl from '@material-ui/core/FormControl';

import { TableButtonGroup, TableEditButton, DeleteButton } from 'components/button';
import { CustomSelect, CustomTextBox, RadioButton } from "components/forms";
import { endometrialInterlineOptions, endoMyometrialBorderOptions, intraUterineDeviceOptions } from "utils/constants";
import { validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useCreateLookupOptions } from "utils/hooks";

interface Props {
  control: ControllerProps["control"];
  isEndometrialPathology: boolean;
  isEndometrialPolyp: boolean;
  isEndometrialSynechiae: boolean;
  setIsEndometrialPathology: (data: any) => void;
  setIsEndometrialPolyp: (data: any) => void;
  setIsEndometrialSynechiae: (data: any) => void;
  formData: any;
  errors: any;
  reset: any;
  getValues: any;
}

const Endometrium = (props: Props) => {
  const { control, errors, getValues, reset, formData, isEndometrialPathology, isEndometrialPolyp, isEndometrialSynechiae, setIsEndometrialPathology, setIsEndometrialPolyp, setIsEndometrialSynechiae } = props;

  const { formatMessage } = useIntl();
  const { fields, append, remove } = useFieldArray({ control, name: "endometrialPolypDetails" });

  const { usgLookupData } =
    useSelector(({ usgLookupReducer }: RootReducerState) => ({
      usgLookupData: usgLookupReducer.data
    }),
      shallowEqual
    );

  // Lookup options for dropdown
  let selectOptions = useCreateLookupOptions(usgLookupData);

  useEffect(() => {
    addPolyDetails();
  }, []);

  useEffect(() => {
    if (Object.keys(formData)?.length) {
      reset({
        ...getValues(),
        endometrialPolypDetails: formData?.endometrialPolypDetails
      });
      if (formData?.endometrialPolypDetails?.length == 0) {
        addPolyDetails();
      }
    }
  }, [Object.keys(formData)?.length]);

  function addPolyDetails() {
    append({});
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomSelect
          options={selectOptions?.endometrialAppearances ?? []}
          label={formatMessage({ id: "endometrial-appearance" })}
          name={`[ultrasoundEndometrium][endometrialAppearanceId]`}
          control={control}
          error={errors?.[`ultrasoundEndometrium`]?.endometrialAppearanceId}
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomSelect
          options={selectOptions?.endometrialEcogenities ?? []}
          label={formatMessage({ id: "endometrial-echogenicity" })}
          name={`[ultrasoundEndometrium][endometrialEcogenityId]`}
          control={control}
          error={errors?.[`ultrasoundEndometrium`]?.endometrialEcogenityId}
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomSelect
          options={endometrialInterlineOptions}
          label={formatMessage({ id: "endometrial-interline" })}
          name={`[ultrasoundEndometrium][endometrialInterline]`}
          control={control}
          error={errors?.[`ultrasoundEndometrium`]?.endometrialInterline}
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomSelect
          options={endoMyometrialBorderOptions}
          label={formatMessage({ id: "endo-myometrial-border" })}
          name={`[ultrasoundEndometrium][endoMyometrialBorder]`}
          control={control}
          error={errors?.[`ultrasoundEndometrium`]?.endoMyometrialBorder}
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomSelect
          options={intraUterineDeviceOptions}
          label={formatMessage({ id: "intra-uterine-device" })}
          name={`[ultrasoundEndometrium][intraUterineDevice]`}
          control={control}
          error={errors?.[`ultrasoundEndometrium`]?.intraUterineDevice}
        />
      </Grid>
      <Grid item xs={12} lg={3} md={4} sm={6}>
        <CustomTextBox
          label={formatMessage({ id: "endometrial-thickness" })}
          name={`[ultrasoundEndometrium][endometrialThickness]`}
          control={control}
          error={errors?.[`ultrasoundEndometrium`]?.endometrialThickness}
          rules={validationRule.textbox({ type: "number" })}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormControl fullWidth style={{ alignItems: "flex-start" }}>
              <span className="text-13 font-medium">{formatMessage({ id: "endometrial-pathology" })}</span>
            </FormControl>
            <RadioButton
              label="Yes"
              name="isEndometrialPathology"
              onChange={() => {
                setIsEndometrialPathology(true);
              }}
              checked={isEndometrialPathology}
            />
            <RadioButton
              label="No"
              name="isEndometrialPathology"
              onChange={() => {
                setIsEndometrialPathology(false);
              }}
              checked={!isEndometrialPathology}
            />
          </Grid>

          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormControl fullWidth style={{ alignItems: "flex-start" }}>
              <span className="text-13 font-medium">{formatMessage({ id: "endometrial-polyp" })}</span>
            </FormControl>
            <RadioButton
              label="Yes"
              name="isEndometrialPolyp"
              onChange={() => {
                setIsEndometrialPolyp(true);
              }}
              checked={isEndometrialPolyp}
              disabled={!isEndometrialPathology}
            />

            <RadioButton
              label="No"
              name="isEndometrialPolyp"
              onChange={() => {
                setIsEndometrialPolyp(false);
              }}
              checked={!isEndometrialPolyp}
              disabled={!isEndometrialPathology}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <CustomSelect
              options={selectOptions?.endometrialLiquids ?? []}
              label={formatMessage({ id: "endometrial-liquid" })}
              name={`[ultrasoundEndometrium][endometrialLiquidId]`}
              control={control}
              error={errors?.[`ultrasoundEndometrium`]?.endometrialLiquidId}
            />
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <FormControl fullWidth style={{ alignItems: "flex-start" }}>
              <span className="text-13 font-medium">{formatMessage({ id: "endometrial-synechiae" })}</span>
            </FormControl>
            <RadioButton
              label="Yes"
              name="isEndometrialSynechiae"
              onChange={() => {
                setIsEndometrialSynechiae(true);
              }}
              checked={isEndometrialSynechiae}
            />

            <RadioButton
              label="No"
              name="isEndometrialSynechiae"
              onChange={() => {
                setIsEndometrialSynechiae(false);
              }}
              checked={!isEndometrialSynechiae}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} lg={9} md={12} sm={12}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table" size="small">
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "25%" }}><FormattedMessage id="appearance" /></TableCell>
                <TableCell style={{ width: "20%" }}><FormattedMessage id="height" /></TableCell>
                <TableCell style={{ width: "15%" }}><FormattedMessage id="size(mm)" /></TableCell>
                <TableCell style={{ width: "10%" }}>
                  <Button
                    variant="contained"
                    onClick={() => { addPolyDetails() }}
                    style={{ padding: "0px 11px", background: "white" }}
                    disabled={!isEndometrialPolyp}
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
                        options={selectOptions?.endometrialPolypAppearances ?? []}
                        label=""
                        name={`endometrialPolypDetails[${index}][endometrialPolypAppearanceId]`}
                        control={control}
                        error={errors?.[`endometrialPolypDetails`]?.[index]?.["endometrialPolypAppearanceId"]}
                        placeholder={formatMessage({ id: "appearance" })}
                        disabled={!isEndometrialPolyp}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomSelect
                        options={selectOptions?.endometrialPolypHeights ?? []}
                        label=""
                        name={`endometrialPolypDetails[${index}][endometrialPolypHeightId]`}
                        control={control}
                        error={errors?.[`endometrialPolypDetails`]?.[index]?.["endometrialPolypHeightId"]}
                        placeholder={formatMessage({ id: "height" })}
                        disabled={!isEndometrialPolyp}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomTextBox
                        label=""
                        name={`endometrialPolypDetails[${index}][size]`}
                        control={control}
                        error={errors?.[`endometrialPolypDetails`]?.[index]?.["size"]}
                        rules={validationRule.textbox({ type: "number" })}
                        placeholder={formatMessage({ id: "size" })}
                        disabled={!isEndometrialPolyp}
                      />
                    </TableCell>
                    <TableCell>
                      <TableButtonGroup>
                        {/* <TableEditButton onClick={() => {
                        }}
                          disabled={!isEndometrialPolyp}
                        /> */}
                        <DeleteButton
                          onDelete={() => {
                            remove(index);
                          }}
                          disabled={!isEndometrialPolyp}
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
    </Grid>
  );
};

export default Endometrium;
