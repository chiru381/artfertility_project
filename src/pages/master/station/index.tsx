import { useEffect, useState } from 'react';
import { getMasterPaginationData } from 'redux/actions';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import CreateStationModal from "./CreateStationModal";
import UpdateStationModal from "./UpdateStationModal";
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import { useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { filterTypes } from 'utils/constants/default';

export default function Station() {
  const [tableState, setTableState] = useState(tableInitialState);
  const [createStationModalOpen, setCreateStationModalOpen] = useState(false);
  const [updateStationModalOpen, setUpdateStationModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const dispatch = useDispatch();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { stationData, loading, clinicData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      stationData: masterPaginationReducer[masterPaginationServices.station].data,
      loading: masterPaginationReducer[masterPaginationServices.station].loading,
      clinicData: masterPaginationReducer[masterPaginationServices.clinic].data
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.clinic, {}));
  }, []);

  useEffect(() => {
    onApiCall();
  }, [tableState]);

  function onApiCall(withState: boolean = true) {
    const params = getTableParams(withState ? tableState : {});
    dispatch(getMasterPaginationData(masterPaginationServices.station, params));
  }

  function onDeleteData(data: any) {
    const parms = {
      stationId: data.id
    }
    setDeleteLoading(true);
    services.deleteStation(parms)
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

  let clinicOptions = clinicData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
  const { modelItems, totalRecord } = stationData;

  const stationColumns = (formatMessage: any) => {
    return [
      { name: 'name', label: formatMessage({ id: "station-name" }), type: filterTypes.text },
      {
        name: 'clinicName', label: formatMessage({ id: "clinic" }),
        type: filterTypes.select,
        primaryColumnName: "Clinic.Name",
        selectOptions: clinicOptions ?? {},
      },
      {
        name: 'isStore', label: formatMessage({ id: "is-store" }),
        options: {
          customBodyRender: (value: string) => {
            return <span>{value ? "Yes" : "No"}</span>
          }
        },
        hideGlobalSearchFilter: true,
      },
      {
        name: 'isPharmacyStore', label: formatMessage({ id: "is-pharmacy-store" }),
        options: {
          customBodyRender: (value: string) => {
            return <span>{value ? "Yes" : "No"}</span>
          }
        },
        hideGlobalSearchFilter: true,
      },
      {
        name: 'isWard', label: formatMessage({ id: "is-ward" }),
        options: {
          customBodyRender: (value: string) => {
            return <span>{value ? "Yes" : "No"}</span>
          }
        },
        hideGlobalSearchFilter: true,
      },
      {
        name: 'isLabStation', label: formatMessage({ id: "is-lab-station" }),
        options: {
          customBodyRender: (value: string) => {
            return <span>{value ? "Yes" : "No"}</span>
          }
        },
        hideGlobalSearchFilter: true,
      },
    ]
  }

  let columnAction = {
    label: "",
    name: "",
    options: {
      customBodyRender: (_: any, tableMeta: any) => {
        return (
          <TableButtonGroup>
            <TableEditButton onClick={() => {
              setSelectedRow(modelItems[tableMeta.rowIndex]);
              setUpdateStationModalOpen(true);
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
          columns={[columnAction, ...stationColumns(formatMessage)]}
          tableData={modelItems}
          tableState={tableState}
          rowsCount={totalRecord}
          setTableState={setTableState}
          title="Station List"
          toolbar={<TableCreateButton onClick={() => setCreateStationModalOpen(true)} />}
          loading={loading || deleteLoading}
        />
      </Box>

      {createStationModalOpen && (
        <CreateStationModal
          closeModal={() => setCreateStationModalOpen(false)}
          onApiCall={onApiCall}
        />
      )}

      {updateStationModalOpen && (
        <UpdateStationModal
          closeModal={() => setUpdateStationModalOpen(false)}
          selectedData={selectedRow}
          onApiCall={onApiCall}
        />
      )}
    </>
  )
}