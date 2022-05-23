import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import { filterTypes } from 'utils/constants/default';
import { services } from 'utils/services';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import CreateEncounterEndTypeModal from "./CreateEncounterEndTypeModal";
import UpdateEncounterEndTypeModal from "./UpdateEncounterEndTypeModal";
import { useToastMessage } from 'utils/hooks';

export default function BedStatus() {
  const [tableState, setTableState] = useState(tableInitialState);
  const [createEncounterEndTypeModalOpen, setCreateEncounterEndTypeModalOpen] = useState(false);
  const [updateEncounterEndTypeModalOpen, setUpdateEncounterEndTypeModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const dispatch = useDispatch();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const encounterEndTypeColumns = () => [
    { name: 'endType', label: formatMessage({ id: "end-type" }), type: filterTypes.text },
    { name: 'description', label: formatMessage({ id: "description" }), type: filterTypes.text }
  ]

  const { encounterEndTypeData, loading } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      encounterEndTypeData: masterPaginationReducer[masterPaginationServices.encounterEndType].data,
      loading: masterPaginationReducer[masterPaginationServices.encounterEndType].loading
    }),
    shallowEqual
  );

  useEffect(() => {
    onApiCall();
  }, [tableState]);

  function onApiCall(withState: boolean = true) {
    const params = getTableParams(withState ? tableState : {});
    dispatch(getMasterPaginationData(masterPaginationServices.encounterEndType, params));
  }

  function onDeleteData(data: any) {
    const parms = {
      consultationTypeId: data.id
    }
    setDeleteLoading(true);
    services.deleteEncounterEndTypes(parms)
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

  const { modelItems, totalRecord } = encounterEndTypeData;

  let columnAction = {
    label: "",
    name: "",
    options: {
      customBodyRender: (_: any, tableMeta: any) => {
        return (
          <TableButtonGroup>
            <TableEditButton onClick={() => {
              setSelectedRow(modelItems[tableMeta.rowIndex]);
              setUpdateEncounterEndTypeModalOpen(true);
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
          columns={[columnAction, ...encounterEndTypeColumns()]}
          tableData={modelItems}
          tableState={tableState}
          rowsCount={totalRecord}
          setTableState={setTableState}
          title="Encounter End Type List"
          toolbar={<TableCreateButton onClick={() => setCreateEncounterEndTypeModalOpen(true)} />}
          loading={loading || deleteLoading}
        />
      </Box>

      {createEncounterEndTypeModalOpen && (
        <CreateEncounterEndTypeModal
          closeModal={() => setCreateEncounterEndTypeModalOpen(false)}
          onApiCall={onApiCall}
        />
      )}

      {updateEncounterEndTypeModalOpen && (
        <UpdateEncounterEndTypeModal
          closeModal={() => setUpdateEncounterEndTypeModalOpen(false)}
          selectedData={selectedRow}
          onApiCall={onApiCall}
        />
      )}
    </>
  )
}