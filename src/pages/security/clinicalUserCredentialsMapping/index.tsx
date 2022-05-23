import { useEffect, useState } from 'react';
import { getMasterPaginationData } from 'redux/actions';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, DeleteButton, TableButtonGroup } from 'components/button';
import { tableInitialState, masterPaginationServices, clinicalUserCrendentialsMappingColumns } from 'utils/constants';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import { useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import CreateClinicalUserCredentialsModal from "./CreateClinicalUserCredentialsModal";
import UpdateClinicalUserCredentialsModal from "./UpdateClinicalUserCredentialsModal";

export default function ClinicalUserCredentialsMapping() {
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const dispatch = useDispatch();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [tableState, setTableState] = useState(tableInitialState);
  const [selectedRow, setSelectedRow] = useState({});
  const [createClinicalUserCredentialsModalOpen, setCreateClinicalUserCredentialsModalOpen] = useState(false);
  const [updateClinicalUserCredentialsModalOpen, setUpdateClinicalUserCredentialsModalOpen] = useState(false);

  const { userData, loading, userLookupData } = useSelector(
    ({ masterPaginationReducer, userLookupReducer }: RootReducerState) => ({
      userData: masterPaginationReducer[masterPaginationServices.allClinicMedicalStaff].data,
      loading: masterPaginationReducer[masterPaginationServices.allClinicMedicalStaff].loading,
      userLookupData: userLookupReducer.data
    }),
    shallowEqual
  );

  useEffect(() => {
    onApiCall();
  }, [tableState]);

  function onApiCall(withState: boolean = true) {
    const params = getTableParams(withState ? tableState : {});
    dispatch(getMasterPaginationData(masterPaginationServices.allClinicMedicalStaff, params));
  }

  const { modelItems, totalRecord } = userData;

  let columnAction = {
    label: "",
    name: "",
    options: {
      customBodyRender: (_: any, tableMeta: any) => {
        return (
          <TableButtonGroup>
            <TableEditButton
              tooltipLabel="Edit User Credentails Mapping"
              onClick={() => {
                setSelectedRow(modelItems[tableMeta.rowIndex]);
                setUpdateClinicalUserCredentialsModalOpen(true);
              }}
            />
            <DeleteButton
              onDelete={() => onDeleteData(modelItems[tableMeta.rowIndex])}
            />
          </TableButtonGroup>
        )
      }
    }
  }

  function onDeleteData(data: any) {
    const parms = {
      doctorId: data.id
    }
    setDeleteLoading(true);
    services.deleteMedicalStaff(parms)
      .then((res) => {
        setDeleteLoading(false);
        if (res.data?.succeeded) {
          onApiCall();
          toastMessage(formatMessage({ id: "delete-message" }));
        } else {
          toastMessage(res.data?.message, 'error');
        }
      })
      .catch((err) => {
        setDeleteLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  return (
    <>
      <Box className="table-container">
        <CustomTable
          columns={[columnAction, ...clinicalUserCrendentialsMappingColumns(formatMessage)]}
          tableData={modelItems}
          tableState={tableState}
          rowsCount={totalRecord}
          setTableState={setTableState}
          title="Clinical User List"
          toolbar={<TableCreateButton onClick={() => setCreateClinicalUserCredentialsModalOpen(true)} />}
          loading={loading || deleteLoading}
        />
      </Box>
      {createClinicalUserCredentialsModalOpen && (
        <CreateClinicalUserCredentialsModal
          closeModal={() => setCreateClinicalUserCredentialsModalOpen(false)}
          onApiCall={onApiCall}
        />
      )}

      {updateClinicalUserCredentialsModalOpen && (
        <UpdateClinicalUserCredentialsModal
          closeModal={() => setUpdateClinicalUserCredentialsModalOpen(false)}
          selectedData={selectedRow}
          onApiCall={onApiCall}
        />
      )}
    </>
  )
}