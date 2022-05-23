import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import Grid from "@material-ui/core/Grid";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { TableButtonGroup, TableEditButton, SecondaryButton, DeleteButton } from 'components/button';
import { CustomTextBox, CustomDatePicker } from "components/forms";
import { HoverLoader } from "components";
import { tableInitialState, masterPaginationServices } from "utils/constants";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import { getFormBody, validationRule } from "utils/global";
import { RootReducerState } from "utils/types";
import { useToastMessage, useGetPatientId } from "utils/hooks";
import Header from "pages/clinical/Header";

import AddNewRequest from "./AddNewRequest";
import { getTableParams } from 'utils/global';
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { surgeryMenuList } from 'utils/constants/menu';

interface Props { }

const PreOperativeCheckUp = (props: Props) => {

  const [selectedRow, setSelectedRow] = useState({});
  const [tableState, setTableState] = useState(tableInitialState);
  const [addNewRequestOpen, setAddNewRequestOpen] = useState(false);
  const dispatch = useDispatch();
  const { handleSubmit, formState: { errors }, control, watch, getValues, reset, } = useForm({ mode: "all" });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { fields, append, remove } = useFieldArray({ control, name: "clinicalHistoryContraceptions", });
  const [value, setValue] = useState(0);

  let patientId = useGetPatientId();

  useEffect(() => {
    onApiCall();
  }, [tableState]);

  function onApiCall(withState: boolean = true) {
    const params = getTableParams(withState ? tableState : {});
    dispatch(getMasterPaginationData(masterPaginationServices.clinic, params));
  }
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);

  }

  const tab1 = () => {
    onApiCall();
  }
  const tab2 = () => {
    onApiCall();
  }

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "pre-operative-checkup" })}
      menuList={surgeryMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Tabs
              value={value}
              onChange={handleChange}
              style={{ float: "left" }}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab onClick={tab1} label={formatMessage({ id: "patient-name(uhid12317632)" })} />|
              <Tab onClick={tab2} label={formatMessage({ id: "partner-name(uhid12317632)" })} />
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

          <Grid item xs={12} lg={12} md={12} sm={12}>
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell><FormattedMessage id="surgery-no" /></TableCell>
                    <TableCell><FormattedMessage id="date" /></TableCell>
                    <TableCell><FormattedMessage id="professional" /></TableCell>
                    <TableCell><FormattedMessage id="patient-name" /></TableCell>
                    <TableCell><FormattedMessage id="uhid" /></TableCell>
                    <TableCell><FormattedMessage id="surgical-intervention" /></TableCell>
                    <TableCell><FormattedMessage id="suitable-for-anesthesia" /></TableCell>
                    <TableCell><FormattedMessage id="asa-risk" /></TableCell>
                    <TableCell><FormattedMessage id="mallampatti" /></TableCell>
                    <TableCell><FormattedMessage id="edit-delete" /></TableCell>
                    <TableCell><FormattedMessage id="add-view" /></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody></TableBody>
              </Table>
            </TableContainer>
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

export default PreOperativeCheckUp;
