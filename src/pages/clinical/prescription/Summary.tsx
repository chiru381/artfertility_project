import { useState, useEffect } from "react";
import { useIntl } from "react-intl";

import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from "@material-ui/core/Paper";

import { useDispatch, useSelector, shallowEqual } from "react-redux";


import { TableButtonGroup, TableEditButton, TableDeleteButton } from 'components/button';  
import { getTableParams } from "utils/global";
import { SimpleTable, HoverLoader } from 'components';
import { useToastMessage, useGetPatientId } from "utils/hooks";
import { prescriptionSummaryColumns, masterPaginationServices } from 'utils/constants';
import { SecondaryButton } from "components/button";
import { useLocation, useHistory } from "react-router-dom";
import { prescriptionMenuList } from 'utils/constants/menu';

import { getMasterPaginationData } from "redux/actions";
import { RootReducerState } from 'utils/types';
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';

interface Props {

}

const Summary = (props: Props) => {
  const location = useLocation<any>();
  const { formatMessage } = useIntl();
  const history = useHistory();
  const { toastMessage } = useToastMessage();
  const [value, setValue] = useState(0);

  const dispatch = useDispatch();
  const [patientTabSelected, setPatientTabSelected] = useState(true);
  const [prescriptionSummaryProcessList, setPrescriptionSummaryProcessList] = useState<any>([]);

  let patientId = useGetPatientId();

  const { prescriptionSummaryData, loading } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => {
      return ({
        prescriptionSummaryData: masterPaginationReducer[masterPaginationServices.prescriptionProcess].data,
        loading: masterPaginationReducer[masterPaginationServices.prescriptionProcess].loading
      })
    },
    shallowEqual
  );

  const { modelItems } = prescriptionSummaryData;



  useEffect(() => {
    let params = { patientId };
    dispatch(getMasterPaginationData(masterPaginationServices.prescriptionProcess, params));
  }, []);

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
      history.push(`new-prescription/patient`);
    }
    else {
      history.push(`new-prescription/partner`);
    }
  }

  function onEdit(rowData: any) {
    if (patientTabSelected) {
      history.push(`new-prescription/patient`, { ...rowData });
    }
    else {
      history.push(`new-prescription/partner`, { ...rowData });
    }
  }

  function handleRowClick(rowData: any) {
    history.push(`general`, { ...rowData });
  }

  function onDelete(data: any) {
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
      </TableButtonGroup>
    })
  }
  )
  return (
    <CustomClinicalActionHeaderWithWrap
      title="summary"
      menuList={prescriptionMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={3} >
          <Grid item xs={10} lg={10} md={8} sm={6}>
            <Box>
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab onClick={onPatientTab} label={formatMessage({ id: "Swapna Gupta (UHID12317632)" })} />
                <Tab onClick={onPartnerTab} label={formatMessage({ id: "Partner Name (UHID12317632)" })} />
              </Tabs>
            </Box>
          </Grid>
          <SecondaryButton
            label="Add item"
            onClick={onAddNew}
            style={{ margin: "18px 10px" }}
          />
          <Grid item xs={12}>
            <SimpleTable
              columns={prescriptionSummaryColumns}
              tableData={tableRows}
            />
          </Grid>
        </Grid>
      </Box>
      {/* {loading && <HoverLoader />} */}
    </CustomClinicalActionHeaderWithWrap>

  );
};

export default Summary;