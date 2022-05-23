import { useEffect } from 'react';
import { ControllerProps } from "react-hook-form";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import FormLabel from "@material-ui/core/FormLabel";

import { CustomTextBox, RadioButton, } from "components/forms";
import { masterPaginationServices } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { RootReducerState } from "utils/types";
import { validationRule } from 'utils/global';
import { PaperWithLabel } from "components";

interface Props {
  control: ControllerProps["control"];
  deliveryModeId: number;
  setDeliveryModeId: (data: any) => void;
}
const StillBirth = (props: Props) => {
  const { control, deliveryModeId, setDeliveryModeId } = props;
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const { deliveryModeData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      deliveryModeData: masterPaginationReducer[masterPaginationServices.deliveryMode].data,
    }),
    shallowEqual
  );

  const { modelItems } = deliveryModeData;

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.deliveryMode, {}));
  }, []);

  return (
      <Grid container spacing={3}>
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
          <CustomTextBox
            label={formatMessage({ id: "remarks" })}
            name="observations"
            control={control}
            rules={validationRule.textbox({ maxLength: 50 })}
          />
        </Grid>
        <Grid item xs={12} lg={12} md={12} sm={12}>
          <CustomTextBox
            label={formatMessage({ id: "complications" })}
            name="complications"
            control={control}
            rules={validationRule.textbox({ maxLength: 50 })}
          />
        </Grid>
      </Grid>
  );
};

export default StillBirth;
