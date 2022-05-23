import { useEffect, useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices, tariffItemColumns } from 'utils/constants';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import CreateTariffItemModal from './CreateTariffItemModal';
import UpdateTariffItemModal from './UpdateTariffItemModal';

export default function TariffItem() {
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [createTariffItemModalOpen, setCreateTariffItemModalOpen] = useState(false);
    const [updateTariffItemModalOpen, setUpdateTariffItemModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [tableState, setTableState] = useState(tableInitialState);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { tariffItemData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            tariffItemData: masterPaginationReducer[masterPaginationServices.tariffItem].data,
            loading: masterPaginationReducer[masterPaginationServices.tariffItem].loading
        }),
        shallowEqual
    );

    useEffect(()=>{
        onApiCall();
    },[tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.tariffItem, params));
    }
    
    function onDeleteData(data: any) {
        const parms = {
            tariffItemId: data.id
        }
        setDeleteLoading(true);
        services.deleteTariffItem(parms)
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

    const { modelItems, totalRecord } = tariffItemData;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateTariffItemModalOpen(true);
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
                    columns={[columnAction, ...tariffItemColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Tariff List"
                    toolbar={<TableCreateButton onClick={() => setCreateTariffItemModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createTariffItemModalOpen && (
                <CreateTariffItemModal
                    closeModal={() => setCreateTariffItemModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateTariffItemModalOpen && (
                <UpdateTariffItemModal
                    closeModal={() => setUpdateTariffItemModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}