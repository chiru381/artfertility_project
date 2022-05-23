import { ControllerProps } from "react-hook-form";
import { useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from '@material-ui/core/FormControl';

import { CustomCheckBox, CustomTextBox, RadioButton, } from "components/forms";
import { ectopicStages } from 'utils/constants';
import { validationRule } from "utils/global";
import { PaperWithLabel } from "components";

interface Props {
  control: ControllerProps["control"];
  ectopicStage: number;
  setEctopicStage: (data: any) => void;
}

const Ectopic = (props: Props) => {
  const { control, ectopicStage, setEctopicStage } = props;
  const { formatMessage } = useIntl();

  return (
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <PaperWithLabel label={formatMessage({ id: "treatment" })}>
            <>
              <CustomCheckBox
                name="isEctopicMedical"
                label={formatMessage({ id: "medical(mtx)" })}
                control={control}
              />
              <CustomCheckBox
                name="isEctopicSurgery"
                label={formatMessage({ id: "surgery" })}
                control={control}
              />
              <CustomCheckBox
                name="isEctopicConservative"
                label={formatMessage({ id: "conservative" })}
                control={control}
              />
            </>
          </PaperWithLabel>
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12} style={{ display: "flex" }}>
          <Grid item xs={12} lg={3} md={3} sm={3}>
            <FormControl fullWidth>
              <span className="text-14 font-medium">{formatMessage({ id: "stage" })}</span>
            </FormControl>
            <RadioButton
              label="Right"
              name="ectopicStage"
              onChange={() => {
                setEctopicStage(ectopicStages.Right);
              }}
              checked={ectopicStage == ectopicStages.Right ? true : false}
            />
            <RadioButton
              label="Left"
              name="ectopicStage"
              onChange={() => {
                setEctopicStage(ectopicStages.Left);
              }}
              checked={ectopicStage == ectopicStages.Left ? true : false}
            />
          </Grid>
          <Grid item xs={12} lg={9} md={9} sm={9}>
            <CustomTextBox
              label={formatMessage({ id: "complications" })}
              name="complications"
              control={control}
              rules={validationRule.textbox({ maxLength: 200 })}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <CustomTextBox
            label={formatMessage({ id: "remarks" })}
            name="observations"
            control={control}
            rules={validationRule.textbox({ maxLength: 200 })}
          />
        </Grid>
      </Grid>
  );
};

export default Ectopic;
