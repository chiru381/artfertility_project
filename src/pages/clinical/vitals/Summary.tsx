import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from "@material-ui/core/Grid";
import dayjs from 'dayjs';

import { TableButtonGroup, TableEditButton, DeleteButton, TableViewButton } from 'components/button';
import { services } from "utils/services";
import { SecondaryButton } from "components/button";
import { SimpleTable, HoverLoader } from 'components';
import { masterPaginationServices, vitalSummaryColumns } from 'utils/constants';
import { useToastMessage, useGetPatientId } from 'utils/hooks';
import { getMasterPaginationData } from "redux/actions";
import { RootReducerState } from 'utils/types';
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';

interface Props { }

const VitalsSummary = (props: Props) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const history = useHistory();
  const { toastMessage } = useToastMessage();

  const [loading, setLoading] = useState(false);
  const [patientTabSelected, setPatientTabSelected] = useState(true);
  const [value, setValue] = useState(0);

  let patientId = useGetPatientId();

  const { vitalSummaryData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => {
      return ({
        vitalSummaryData: masterPaginationReducer[masterPaginationServices.vitalProcess].data,
        loading: masterPaginationReducer[masterPaginationServices.vitalProcess].loading
      })
    },
    shallowEqual
  );

  useEffect(() => {
    let params = { patientId };
    dispatch(getMasterPaginationData(masterPaginationServices.vitalProcess, params));
  }, []);

  const { modelItems } = vitalSummaryData;

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  function onPatientTab() {
    setPatientTabSelected(true);
  }

  function onPartnerTab() {
    setPatientTabSelected(false);
  }

  function onAddNew() {
    if (patientTabSelected) {
      history.push(`patient`);
    }
    else {
      history.push(`partner`);
    }
  }

  function onGraphAndTrends() {
    if (patientTabSelected) {
      history.push(`graph-and-trends`);
    }
    else {
      history.push(`graph-and-trends`);
    }
  }

  function onEdit(rowData: any) {
    if (patientTabSelected) {
      history.push(`patient`, { ...rowData });
    }
    else {
      history.push(`partner`, { ...rowData });
    }
  }

  function onView(rowData: any) {

  }

  function onDelete(data: any) {
    const parms = {
      vitalCapturingId: data.id,
    }
    setLoading(true);
    services.deleteVital(parms)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          toastMessage(formatMessage({ id: "delete-message" }));
        } else {
          toastMessage(res.data?.message, 'error');
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  let tableRows = modelItems.map((item: any) => {
    return ({
      ...item,
      action: <TableButtonGroup>
        <TableEditButton
          tooltipLabel="Edit"
          onClick={() => onEdit(item)}
        />
        <DeleteButton
          tooltipLabel="Delete"
          onDelete={() => onDelete(item)}
        />
        <TableViewButton
          tooltipLabel="View"
          onClick={() => onView(item)}
        />
      </TableButtonGroup>,
      vitalCapturingDate: item?.vitalCapturingDate ? dayjs(item?.vitalCapturingDate).format('DD-MM-YYYY') : '-',
      time: item?.vitalCapturingDate ? dayjs(item?.vitalCapturingDate, "hh:mm:ss").format("hh:mm A") : '-',
    })
  });

  return (
    <CustomClinicalActionHeaderWithWrap
      title="summary"
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={2}>
          <Grid item xs={10} lg={9} md={8} sm={6}>
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab onClick={onPatientTab} label={formatMessage({ id: "Patient Name (UHID12317632)" })} />
                <Tab onClick={onPartnerTab} label={formatMessage({ id: "Partner Name (UHID12317632)" })} />
              </Tabs>
            </Box>
          </Grid>
          <SecondaryButton
            label="Graph & Trends"
            onClick={onGraphAndTrends}
            style={{ margin: "18px 10px" }}
          />
          <SecondaryButton
            label="Add item"
            onClick={onAddNew}
            style={{ margin: "18px 10px" }}
          />
          <Grid item xs={12}>
            <SimpleTable
              columns={vitalSummaryColumns}
              tableData={tableRows}
            />
          </Grid>
        </Grid>
      </Box>
      {loading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  )
}

export default VitalsSummary;