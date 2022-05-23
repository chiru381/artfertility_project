import { useEffect, useState } from 'react';
import { getMasterPaginationData } from 'redux/actions';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import CreateBedModal from "./CreateBedModal";
import UpdateBedModal from "./UpdateBedModal";
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import { useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { filterTypes } from 'utils/constants/default';

export default function Bed() {
  const [tableState, setTableState] = useState(tableInitialState);
  const [createBedModalOpen, setCreateBedModalOpen] = useState(false);
  const [updateBedModalOpen, setUpdateBedModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();

  const dispatch = useDispatch();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { BedData, loading, clinicData, stationData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      BedData: masterPaginationReducer[masterPaginationServices.bed].data,
      loading: masterPaginationReducer[masterPaginationServices.bed].loading,
      clinicData: masterPaginationReducer[masterPaginationServices.clinic].data,
      stationData: masterPaginationReducer[masterPaginationServices.station].data
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.clinic, {}));
    dispatch(getMasterPaginationData(masterPaginationServices.station, {}));
  }, []);


  useEffect(() => {
    onApiCall();
  }, [tableState]);

  function onApiCall(withState: boolean = true) {
    const params = getTableParams(withState ? tableState : {});
    dispatch(getMasterPaginationData(masterPaginationServices.bed, params));
  }

  function onDeleteData(data: any) {
    const parms = {
      bedId: data.id
    }
    setDeleteLoading(true);
    services.deleteBed(parms)
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
  let clinicOptions = clinicData.modelItems?.map((option: any) => ({ label: option.name, value: option.name }));
  let stationOptions = stationData.modelItems?.map((option: any) => ({ label: option.name, value: option.name }));

  const { modelItems, totalRecord } = BedData;

  const bedColumns = (formatMessage: any) => {
    return [
      { name: 'name', label: formatMessage({ id: "bed-name" }), type: filterTypes.text },
      {
        name: 'stationName', label: formatMessage({ id: "station" }),
        hideGlobalSearchFilter: true,
        type: filterTypes.select,
        primaryColumnName: "Station.Name",
        selectOptions: stationOptions ?? {},
      },
      {
        name: 'stationClinicName', label: formatMessage({ id: "clinic" }),
        hideGlobalSearchFilter: true,
        type: filterTypes.select,
        primaryColumnName: "Station.Clinic.Name",
        selectOptions: clinicOptions ?? {},
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
              setUpdateBedModalOpen(true);
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
          columns={[columnAction, ...bedColumns(formatMessage)]}
          tableData={modelItems}
          tableState={tableState}
          rowsCount={totalRecord}
          setTableState={setTableState}
          title="Bed List"
          toolbar={<TableCreateButton onClick={() => setCreateBedModalOpen(true)} />}
          loading={loading || deleteLoading}
        />
      </Box>

      {createBedModalOpen && (
        <CreateBedModal
          closeModal={() => setCreateBedModalOpen(false)}
          onApiCall={onApiCall}
        />
      )}

      {updateBedModalOpen && (
        <UpdateBedModal
          closeModal={() => setUpdateBedModalOpen(false)}
          selectedData={selectedRow}
          onApiCall={onApiCall}
        />
      )}
    </>
  )
}