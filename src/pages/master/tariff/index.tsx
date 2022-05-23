import { useEffect, useState, useContext } from 'react';
import { getMasterPaginationData } from 'redux/actions';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import CreateTariffModal from "./CreateTariffModal";
import UpdateTariffModal from "./UpdateTariffModal";
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import RootContext from 'utils/context/RootContext';
import { services } from 'utils/services';
import { filterTypes } from 'utils/constants/default';

export default function Tariff() {
  const [tableState, setTableState] = useState(tableInitialState);
  const [createTariffModalOpen, setCreateTariffModalOpen] = useState(false);
  const [updateTariffModalOpen, setUpdateTariffModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const { formatMessage } = useIntl();
  const { toastMessage } = useContext<any>(RootContext);

  const dispatch = useDispatch();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const tariffColumns = (formatMessage: any) => {
    return [
      { name: 'name', label: formatMessage({ id: "tariff-name" }), primaryColumnName: "birthCountry.Name", type: filterTypes.select },
      { name: 'effectiveFrom', label: formatMessage({ id: "Effective From" }), type: filterTypes.text },
      { name: 'effectiveTo', label: formatMessage({ id: "Effective To" }), type: filterTypes.text }
     
    ]
  }

  const { tariffData, loading } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      tariffData: masterPaginationReducer[masterPaginationServices.tariff].data,
      loading: masterPaginationReducer[masterPaginationServices.tariff].loading
    }),
    shallowEqual
  );

  useEffect(() => {
    onApiCall();
  }, [tableState]);

  function onApiCall(withState: boolean = true) {
    const params = getTableParams(withState ? tableState : {});
    dispatch(getMasterPaginationData(masterPaginationServices.tariff, params));
  }

  function onDeleteData(data: any) {
    const parms = {
      tariffId: data.id
    }
    setDeleteLoading(true);
    services.deleteTariff(parms)
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

  const { modelItems, totalRecord } = tariffData;

  let columnAction = {
    label: "",
    name: "",
    options: {
      customBodyRender: (_: any, tableMeta: any) => {
        return (
          <TableButtonGroup>
            <TableEditButton onClick={() => {
              setSelectedRow(modelItems[tableMeta.rowIndex]);
              setUpdateTariffModalOpen(true);
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
          columns={[columnAction, ...tariffColumns(formatMessage)]}
          tableData={modelItems}
          tableState={tableState}
          rowsCount={totalRecord}
          setTableState={setTableState}
          title="Tariff List"
          toolbar={<TableCreateButton onClick={() => setCreateTariffModalOpen(true)} />}
          loading={loading || deleteLoading}
        />
      </Box>

      {createTariffModalOpen && (
        <CreateTariffModal
          closeModal={() => setCreateTariffModalOpen(false)}
          onApiCall={onApiCall}
        />
      )}

      {updateTariffModalOpen && (
        <UpdateTariffModal
          closeModal={() => setUpdateTariffModalOpen(false)}
          selectedData={selectedRow}
          onApiCall={onApiCall}
        />
      )}
    </>
  )
}