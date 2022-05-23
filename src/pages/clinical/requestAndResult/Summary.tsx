import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";

import { RadioButton } from "components/forms";
import { HoverLoader, SimpleTable } from "components";
import { masterPaginationServices, requestAndResultSummaryColumns } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { RootReducerState } from "utils/types";
import { useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { requestResultMenuList } from 'utils/constants/menu';

interface Props { }

const RequestAndResultSummary = (props: Props) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const [loading, setLoading] = useState(false);
  const [isOnsiteVisit, setIsOnsiteVisit] = useState(true);

  let patientId = useGetPatientId();

  const { ultrasoundSummaryData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => {
      return ({
        ultrasoundSummaryData: masterPaginationReducer[masterPaginationServices.ultrasoundSummary].data,
        loading: masterPaginationReducer[masterPaginationServices.ultrasoundSummary].loading
      })
    },
    shallowEqual
  );

  const { modelItems } = ultrasoundSummaryData;

  useEffect(() => {
    onApiCall();
  }, []);

  function onApiCall() {
    let params = { patientId };
    dispatch(getMasterPaginationData(masterPaginationServices.ultrasoundSummary, params));
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title="summary"
      menuList={requestResultMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <RadioButton
              label="All"
              name="isOnsiteVisit"
              onChange={() => {
                setIsOnsiteVisit(true);
              }}
              checked={isOnsiteVisit}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <RadioButton
              label="Blood Lab"
              name="isOnsiteVisit"
              onChange={() => {
                setIsOnsiteVisit(false);
              }}
              checked={!isOnsiteVisit}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <RadioButton
              label="USG Scan"
              name="isOnsiteVisit"
              onChange={() => {
                setIsOnsiteVisit(false);
              }}
              checked={!isOnsiteVisit}
            />
          </Grid>
          <Grid item xs={12} lg={2} md={4} sm={6}>
            <RadioButton
              label="Andrology Lab"
              name="isOnsiteVisit"
              onChange={() => {
                setIsOnsiteVisit(false);
              }}
              checked={!isOnsiteVisit}
            />
          </Grid>

          <Grid item xs={12}>
            <SimpleTable
              columns={requestAndResultSummaryColumns(formatMessage)}
              tableData={modelItems}
            />
          </Grid>
        </Grid>
      </Box>
      {loading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default RequestAndResultSummary;
