import { useEffect, useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import CreateSurgeryTypeModal from "./CreateSurgeryTypeModal";
import UpdateSurgeryTypeModal from "./UpdateSurgeryTypeModal";
import { filterTypes } from 'utils/constants/default';
import { RootReducerState } from 'utils/types';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';


export default function SurgeryType() {
  const [tableState, setTableState] = useState(tableInitialState);
  const [createSurgeryTypeModalOpen, setCreateSurgeryTypeModalOpen] = useState(false);
  const [updateSurgeryTypeModalOpen, setUpdateSurgeryTypeModalOpen] = useState(false);

  const [selectedRow, setSelectedRow] = useState({});
  const { formatMessage } = useIntl();
  const { toastMessage } = useContext<any>(RootContext);

  const dispatch = useDispatch();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const surgeryTypeColumns = (formatMessage: any) => {
    return [
      { name: 'name', label: formatMessage({ id: "surgery-type" }), type: filterTypes.text }
    ]
  }

  const { surgeryTypeData, loading } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      surgeryTypeData: masterPaginationReducer[masterPaginationServices.surgeryType].data,
      loading: masterPaginationReducer[masterPaginationServices.surgeryType].loading
    }),
    shallowEqual
  );

  useEffect(() => {
    onApiCall();
  }, [tableState]);

  function onApiCall(withState: boolean = true) {
    const params = getTableParams(withState ? tableState : {});
    dispatch(getMasterPaginationData(masterPaginationServices.surgeryType, params));
  }

  function onDeleteData(data: any) {
    const parms = {
      surgeryTypeId: data.id
    }
    setDeleteLoading(true);
    services.deleteSurgeryType(parms)
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

  const { modelItems, totalRecord } = surgeryTypeData;

  let columnAction = {
    label: "",
    name: "",
    options: {
      customBodyRender: (_: any, tableMeta: any) => {
        return (
          <TableButtonGroup>
            <TableEditButton onClick={() => {
              setSelectedRow(modelItems[tableMeta.rowIndex]);
              setUpdateSurgeryTypeModalOpen(true);
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

  return (
    <>
      <Box className="table-container">
        <CustomTable
          columns={[columnAction, ...surgeryTypeColumns(formatMessage)]}
          tableData={modelItems}
          tableState={tableState}
          rowsCount={totalRecord}
          setTableState={setTableState}
          title="Surgery Type List"
          toolbar={<TableCreateButton onClick={() => setCreateSurgeryTypeModalOpen(true)} />}
          loading={loading || deleteLoading}
        />
      </Box>

      {createSurgeryTypeModalOpen && (
        <CreateSurgeryTypeModal
          closeModal={() => setCreateSurgeryTypeModalOpen(false)}
          onApiCall={onApiCall}
        />
      )}

      {updateSurgeryTypeModalOpen && (
        <UpdateSurgeryTypeModal
          closeModal={() => setUpdateSurgeryTypeModalOpen(false)}
          selectedData={selectedRow}
          onApiCall={onApiCall}
        />
      )}
    </>
  )
}