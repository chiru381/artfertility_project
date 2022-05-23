import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from '@material-ui/core/Paper';

import { TableButtonGroup, TableEditButton, TableDeleteButton, TableViewButton, SecondaryButton } from 'components/button';
import { HoverLoader, SimpleTable } from "components";
import { masterPaginationServices, bloodLabSummaryColumns } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";

import AddNewRequest from "./AddNewRequest";

interface Props { }

const BloodLabRequest = (props: Props) => {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const [selectedRow, setSelectedRow] = useState({});
  const [addNewRequestOpen, setAddNewRequestOpen] = useState(false);
  const [isPatientTabSelected, setIsPatientTabSelected] = useState(true);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [value, setValue] = useState(0);

  let patientId = useGetPatientId();

  const { bloodLabSummaryData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => {
      return ({
        bloodLabSummaryData: masterPaginationReducer[masterPaginationServices.patientBloodLabSummary].data,
        loading: masterPaginationReducer[masterPaginationServices.patientBloodLabSummary].loading
      })
    },
    shallowEqual
  );

  useEffect(() => {
    onApiCall(patientId);
  }, []);

  const { modelItems } = bloodLabSummaryData;

  function onApiCall(id: any) {
    let params = { patientId: id, coupleId: 0 }
    dispatch(getMasterPaginationData(masterPaginationServices.patientBloodLabSummary, params));
  }

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  }

  function onPatientTabClick() {
    setIsPatientTabSelected(true);
    onApiCall(patientId);
  }

  function onPartnerTabClick() {
    setIsPatientTabSelected(false);
    onApiCall(patientId);
  }

  function handleRowClick(data: any) {

  }

  function onDelete(data: any) {
    const parms = {
      InvestigationRequestId: data.id,
    }
    setDeleteLoading(true);
    services.deleteBloodLabRequest(parms)
      .then((res) => {
        setDeleteLoading(false);
        if (res.data?.succeeded) {
          toastMessage(formatMessage({ id: "delete-message" }));
          onApiCall(patientId);
        } else {
          toastMessage(res.data?.message, 'error');
        }
      })
      .catch((err) => {
        setDeleteLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  function onViewFile(data: any) {

  }

  let tableRows = modelItems.map((item: any) => {
    return ({
      ...item,
      action: <TableButtonGroup>
        <TableEditButton
          tooltipLabel="Edit"
          onClick={() => handleRowClick(item)}
        />
        <TableDeleteButton
          tooltipLabel="Delete"
          onClick={() => onDelete(item)}
        />
        <TableViewButton
          tooltipLabel="View File"
          onClick={() => onViewFile(item)}
        />
      </TableButtonGroup >
    })
  });

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "blood-lab-request" })}
      menuList={anamnesisMenuList}
    >
      <Box padding={3} component={Paper}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Tabs
              value={value}
              onChange={handleChange}
              style={{ float: "left" }}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab onClick={onPatientTabClick} label={formatMessage({ id: "patient-name(uhid12317632)" })} />
              <Tab onClick={onPartnerTabClick} label={formatMessage({ id: "partner-name(uhid12317632)" })} />
            </Tabs>
          </Grid>

          <Grid item xs={6}>
            <SecondaryButton
              label={formatMessage({ id: "add-new" })}
              style={{ float: "right" }}
              onClick={() => {
                setAddNewRequestOpen(true);
                setSelectedRow({});
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <SimpleTable
              columns={bloodLabSummaryColumns(formatMessage)}
              tableData={tableRows}
            />
          </Grid>
        </Grid>
      </Box>
      {addNewRequestOpen && (
        <AddNewRequest
          closeModal={() => setAddNewRequestOpen(false)}
          onApiCall={onApiCall}
        />
      )}
      {loading || deleteLoading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  );
};

export default BloodLabRequest;
