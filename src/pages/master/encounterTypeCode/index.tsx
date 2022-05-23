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
import CreateEncounterTypeCodeModal from "./CreateEncounterTypeCodeModal";
import UpdateEncounterTypeCodeModal from "./UpdateEncounterTypeCodeModal";
import { useToastMessage } from 'utils/hooks';

export default function BedStatus() {
  const [tableState, setTableState] = useState(tableInitialState);
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const dispatch = useDispatch();

  const [selectedRow, setSelectedRow] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createEncounterTypeCodeModalOpen, setCreateEncounterTypeCodeModalOpen] = useState(false);
  const [updateEncounterTypeCodeModalOpen, setUpdateEncounterTypeCodeModalOpen] = useState(false);

  const encounterTypeCodeColumns = () => [
    { name: 'code', label: formatMessage({ id: "type-code" }), type: filterTypes.text },
    { name: 'description', label: formatMessage({ id: "description" }), type: filterTypes.text }
  ]

  const { encounterTypeCodeData, loading } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      encounterTypeCodeData: masterPaginationReducer[masterPaginationServices.encounterTypeCode].data,
      loading: masterPaginationReducer[masterPaginationServices.encounterTypeCode].loading
    }),
    shallowEqual
  );

  useEffect(() => {
    onApiCall();
  }, [tableState]);

  function onApiCall(withState: boolean = true) {
    const params = getTableParams(withState ? tableState : {});
    dispatch(getMasterPaginationData(masterPaginationServices.encounterTypeCode, params));
  }

  function onDeleteData(data: any) {
    const parms = {
      consultationTypeId: data.id
    }
    setDeleteLoading(true);
    services.deleteEncounterTypesCode(parms)
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

  const { modelItems, totalRecord } = encounterTypeCodeData;

  let columnAction = {
    label: "",
    name: "",
    options: {
      customBodyRender: (_: any, tableMeta: any) => {
        return (
          <TableButtonGroup>
            <TableEditButton onClick={() => {
              setSelectedRow(modelItems[tableMeta.rowIndex]);
              setUpdateEncounterTypeCodeModalOpen(true);
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
          columns={[columnAction, ...encounterTypeCodeColumns()]}
          tableData={modelItems}
          tableState={tableState}
          rowsCount={totalRecord}
          setTableState={setTableState}
          title="Encouter Type Code List"
          toolbar={<TableCreateButton onClick={() => setCreateEncounterTypeCodeModalOpen(true)} />}
          loading={loading || deleteLoading}
        />
      </Box>

      {createEncounterTypeCodeModalOpen && (
        <CreateEncounterTypeCodeModal
          closeModal={() => setCreateEncounterTypeCodeModalOpen(false)}
          onApiCall={onApiCall}
        />
      )}

      {updateEncounterTypeCodeModalOpen && (
        <UpdateEncounterTypeCodeModal
          closeModal={() => setUpdateEncounterTypeCodeModalOpen(false)}
          selectedData={selectedRow}
          onApiCall={onApiCall}
        />
      )}
    </>
  )
}