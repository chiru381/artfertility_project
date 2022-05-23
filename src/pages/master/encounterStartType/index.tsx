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
import CreateEncounterStartTypeModal from "./CreateEncounterStartTypeModal";
import UpdateEncounterStartTypeModal from "./UpdateEncounterStartTypeModal";
import { useToastMessage } from 'utils/hooks';

export default function BedStatus() {
  const [tableState, setTableState] = useState(tableInitialState);
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const dispatch = useDispatch();

  const [selectedRow, setSelectedRow] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateEncounterStartTypeModalOpen, setUpdateEncounterStartTypeModalOpen] = useState(false);
  const [createEncounterStartTypeModalOpen, setCreateEncounterStartTypeModalOpen] = useState(false);

  const encounterStartTypeColumns = () => [
    { name: 'startType', label: formatMessage({ id: "start-type" }), type: filterTypes.text },
    { name: 'description', label: formatMessage({ id: "description" }), type: filterTypes.text }
  ]

  const { encounterStartTypeData, loading } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      encounterStartTypeData: masterPaginationReducer[masterPaginationServices.encounterStartType].data,
      loading: masterPaginationReducer[masterPaginationServices.encounterStartType].loading
    }),
    shallowEqual
  );

  useEffect(() => {
    onApiCall();
  }, [tableState]);

  function onApiCall(withState: boolean = true) {
    const params = getTableParams(withState ? tableState : {});
    dispatch(getMasterPaginationData(masterPaginationServices.encounterStartType, params));
  }

  function onDeleteData(data: any) {
    const parms = {
      consultationTypeId: data.id
    }
    setDeleteLoading(true);
    services.deleteEncounterStartTypes(parms)
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

  const { modelItems, totalRecord } = encounterStartTypeData;

  let columnAction = {
    label: "",
    name: "",
    options: {
      customBodyRender: (_: any, tableMeta: any) => {
        return (
          <TableButtonGroup>
            <TableEditButton onClick={() => {
              setSelectedRow(modelItems[tableMeta.rowIndex]);
              setUpdateEncounterStartTypeModalOpen(true);
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
          columns={[columnAction, ...encounterStartTypeColumns()]}
          tableData={modelItems}
          tableState={tableState}
          rowsCount={totalRecord}
          setTableState={setTableState}
          title="Encounter Start Type List"
          toolbar={<TableCreateButton onClick={() => setCreateEncounterStartTypeModalOpen(true)} />}
          loading={loading || deleteLoading}
        />
      </Box>

      {createEncounterStartTypeModalOpen && (
        <CreateEncounterStartTypeModal
          closeModal={() => setCreateEncounterStartTypeModalOpen(false)}
          onApiCall={onApiCall}
        />
      )}

      {updateEncounterStartTypeModalOpen && (
        <UpdateEncounterStartTypeModal
          closeModal={() => setUpdateEncounterStartTypeModalOpen(false)}
          selectedData={selectedRow}
          onApiCall={onApiCall}
        />
      )}
    </>
  )
}