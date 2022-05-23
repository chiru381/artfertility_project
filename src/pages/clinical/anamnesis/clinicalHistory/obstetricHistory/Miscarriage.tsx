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
import { validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { miscarriageTypes, miscarriageReasons } from "utils/constants";
import { PaperWithLabel } from "components";

interface Props {
  control: ControllerProps["control"];
  miscarriageType: number;
  setMiscarriageType: (data: any) => void;
  miscarriageReason: number;
  setMiscarriageReason: (data: any) => void;
  deliveryModeId: number;
  setDeliveryModeId: (data: any) => void;
}

const Miscarriage = (props: Props) => {
  const { control, miscarriageType, setMiscarriageType, miscarriageReason, setMiscarriageReason, deliveryModeId, setDeliveryModeId } = props;
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
          <PaperWithLabel label={formatMessage({ id: "type" })}>
            <>
              <RadioButton
                label="Spontaneous"
                name="miscarriageType"
                onChange={() => {
                  setMiscarriageType(miscarriageTypes.Spontaneous);
                  setMiscarriageReason(0);
                }}
                checked={miscarriageType == miscarriageTypes.Spontaneous ? true : false}
              />
              <RadioButton
                label="Induced"
                name="miscarriageType"
                onChange={() => {
                  setMiscarriageType(miscarriageTypes.Induced);
                }}
                checked={miscarriageType == miscarriageTypes.Induced ? true : false}
              />
              <RadioButton
                label="Genetic"
                name="miscarriageReason"
                onChange={() => {
                  setMiscarriageReason(miscarriageReasons.Genetic);
                }}
                checked={miscarriageReason == miscarriageReasons.Genetic ? true : false}
                disabled={miscarriageType == miscarriageTypes.Induced ? false : true}
              />
              <RadioButton
                label="Maternal Proposal"
                name="miscarriageReason"
                onChange={() => {
                  setMiscarriageReason(miscarriageReasons.MaternalProposal);
                }}
                checked={miscarriageReason == miscarriageReasons.MaternalProposal ? true : false}
                disabled={miscarriageType == miscarriageTypes.Induced ? false : true}
              />
            </>
          </PaperWithLabel>
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
          <CustomTextBox
            label={formatMessage({ id: "remarks", })}
            name="observations"
            control={control}
            rules={validationRule.textbox({ maxLength: 50 })}
          />
        </Grid>
        <Grid item xs={6} lg={6} md={6} sm={6}>
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

export default Miscarriage;
