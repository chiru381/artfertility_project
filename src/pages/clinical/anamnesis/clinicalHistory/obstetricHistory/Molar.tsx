import { useState } from 'react';
import { ControllerProps } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

import { CustomTextBox, RadioButton, } from "components/forms";
import { molarPregnancyTypes } from 'utils/constants';
import { validationRule } from 'utils/global';

interface Props {
  control: ControllerProps["control"];
  molarPregnancyType: number;
  setMolarPregnancyType: (data: any) => void;
}

const Molar = (props: Props) => {
  const { control, molarPregnancyType, setMolarPregnancyType } = props;
  const { formatMessage } = useIntl();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={12} md={12} sm={12}>
        <RadioButton
          label="Partial"
          name="molarPregnancyType"
          onChange={() => {
            setMolarPregnancyType(molarPregnancyTypes.Partial);
          }}
          checked={molarPregnancyType == molarPregnancyTypes.Partial ? true : false}
        />
        <RadioButton
          style={{ marginLeft: "20px" }}
          label="Complete"
          name="molarPregnancyType"
          onChange={() => {
            setMolarPregnancyType(molarPregnancyTypes.Complete);
          }}
          checked={molarPregnancyType == molarPregnancyTypes.Complete ? true : false}
        />
      </Grid>
      <Grid item xs={12} lg={12} md={12} sm={12}>
        <CustomTextBox
          label={formatMessage({ id: "remarks" })}
          name="observations"
          control={control}
          rules={validationRule.textbox({maxLength:200})}
        />
      </Grid>
      <Grid item xs={12} lg={12} md={12} sm={12}>
        <CustomTextBox
          label={formatMessage({ id: "complications" })}
          name="complications"
          control={control}
          rules={validationRule.textbox({maxLength:50})}
        />
      </Grid>
    </Grid>
  );
};

export default Molar;
