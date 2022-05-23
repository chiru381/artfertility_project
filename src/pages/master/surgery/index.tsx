import { useEffect, useState, useContext } from 'react';
import { getMasterPaginationData } from 'redux/actions';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import CreateSurgeryModal from "./CreateSurgeryModal";
import UpdateSurgeryModal from "./UpdateSurgeryModal";
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import RootContext from 'utils/context/RootContext';
import { services } from 'utils/services';
import { filterTypes } from 'utils/constants/default';

export default function Surgery() {
  const [tableState, setTableState] = useState(tableInitialState);
  const [createSurgeryModalOpen, setCreateSurgeryModalOpen] = useState(false);
  const [updateSurgeryModalOpen, setUpdateSurgeryModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const { formatMessage } = useIntl();
  const { toastMessage } = useContext<any>(RootContext);

  const dispatch = useDispatch();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const surgeryColumns = (formatMessage: any) => {
    return [
      { name: 'name', label: formatMessage({ id: "surgery-name" }), type: filterTypes.text },
      { name: 'duration-in-minutes', label: formatMessage({ id: "duration-in-minutes" }), primaryColumnName: "birthCountry.Name", type: filterTypes.select },
      { name: 'surgeryTypeName', label: formatMessage({ id: "surgery-type-name" }), primaryColumnName: "birthCountry.Name", type: filterTypes.select }
    ]
  }

  const { surgeryData, loading } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      surgeryData: masterPaginationReducer[masterPaginationServices.surgery].data,
      loading: masterPaginationReducer[masterPaginationServices.surgery].loading
    }),
    shallowEqual
  );

  useEffect(() => {
    onApiCall();
  }, [tableState]);

  function onApiCall(withState: boolean = true) {
    const params = getTableParams(withState ? tableState : {});
    dispatch(getMasterPaginationData(masterPaginationServices.surgery, params));
  }

  function onDeleteData(data: any) {
    const parms = {
      surgeryId: data.id
    }
    setDeleteLoading(true);
    services.deleteSurgery(parms)
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

  const { modelItems, totalRecord } = surgeryData;

  let columnAction = {
    label: "",
    name: "",
    options: {
      customBodyRender: (_: any, tableMeta: any) => {
        return (
          <TableButtonGroup>
            <TableEditButton onClick={() => {
              setSelectedRow(modelItems[tableMeta.rowIndex]);
              setUpdateSurgeryModalOpen(true);
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
          columns={[columnAction, ...surgeryColumns(formatMessage)]}
          tableData={modelItems}
          tableState={tableState}
          rowsCount={totalRecord}
          setTableState={setTableState}
          title="Surgery List"
          toolbar={<TableCreateButton onClick={() => setCreateSurgeryModalOpen(true)} />}
          loading={loading || deleteLoading}
        />
      </Box>

      {createSurgeryModalOpen && (
        <CreateSurgeryModal
          closeModal={() => setCreateSurgeryModalOpen(false)}
          onApiCall={onApiCall}
        />
      )}

      {updateSurgeryModalOpen && (
        <UpdateSurgeryModal
          closeModal={() => setUpdateSurgeryModalOpen(false)}
          selectedData={selectedRow}
          onApiCall={onApiCall}
        />
      )}
    </>
  )
}