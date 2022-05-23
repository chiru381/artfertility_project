import { useEffect, useState, useContext } from 'react';
import { getMasterPaginationData } from 'redux/actions';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import CreateProvinceModal from "./CreateProvinceModal";
import UpdateProvinceModal from "./UpdateProvinceModal";
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import RootContext from 'utils/context/RootContext';
import { services } from 'utils/services';
import { filterTypes } from 'utils/constants/default';

export default function Province() {
  const [tableState, setTableState] = useState(tableInitialState);
  const [createProvinceModalOpen, setCreateProvinceModalOpen] = useState(false);
  const [updateProvinceModalOpen, setUpdateProvinceModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const { formatMessage } = useIntl();
  const { toastMessage } = useContext<any>(RootContext);

  const dispatch = useDispatch();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const provinceColumns = (formatMessage: any) => {
    return [
      { name: 'name', label: formatMessage({ id: "province-name" }), type: filterTypes.text },
      { name: 'countryName', label: formatMessage({ id: "country" }), primaryColumnName: "birthCountry.Name", type: filterTypes.select }
    ]
  }

  const { provinceData, loading } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      provinceData: masterPaginationReducer[masterPaginationServices.province].data,
      loading: masterPaginationReducer[masterPaginationServices.province].loading
    }),
    shallowEqual
  );

  useEffect(() => {
    onApiCall();
  }, [tableState]);

  function onApiCall(withState: boolean = true) {
    const params = getTableParams(withState ? tableState : {});
    dispatch(getMasterPaginationData(masterPaginationServices.province, params));
  }

  function onDeleteData(data: any) {
    const parms = {
      provinceId: data.id
    }
    setDeleteLoading(true);
    services.deleteProvince(parms)
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

  const { modelItems, totalRecord } = provinceData;

  let columnAction = {
    label: "",
    name: "",
    options: {
      customBodyRender: (_: any, tableMeta: any) => {
        return (
          <TableButtonGroup>
            <TableEditButton onClick={() => {
              setSelectedRow(modelItems[tableMeta.rowIndex]);
              setUpdateProvinceModalOpen(true);
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
          columns={[columnAction, ...provinceColumns(formatMessage)]}
          tableData={modelItems}
          tableState={tableState}
          rowsCount={totalRecord}
          setTableState={setTableState}
          title="Province List"
          toolbar={<TableCreateButton onClick={() => setCreateProvinceModalOpen(true)} />}
          loading={loading || deleteLoading}
        />
      </Box>

      {createProvinceModalOpen && (
        <CreateProvinceModal
          closeModal={() => setCreateProvinceModalOpen(false)}
          onApiCall={onApiCall}
        />
      )}

      {updateProvinceModalOpen && (
        <UpdateProvinceModal
          closeModal={() => setUpdateProvinceModalOpen(false)}
          selectedData={selectedRow}
          onApiCall={onApiCall}
        />
      )}
    </>
  )
}