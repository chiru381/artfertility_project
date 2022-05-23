import { useEffect, useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, TableButtonGroup, TableEditButton, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices, seriesColumns } from 'utils/constants';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import CreateSeriesModal from './CreateSeriesModal';
import UpdateSeriesModal from './UpdateSeriesModal';

export default function Series() {
    const { formatMessage } = useIntl();
    const { toastMessage } = useContext<any>(RootContext);
    const dispatch = useDispatch();

    const [tableState, setTableState] = useState(tableInitialState);
    const [createSeriesModalOpen, setCreateSeriesModalOpen] = useState(false);
    const [updateSeriesModalOpen, setUpdateSeriesModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { seriesData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            seriesData: masterPaginationReducer[masterPaginationServices.series].data,
            loading: masterPaginationReducer[masterPaginationServices.series].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.series, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            seriesId: data.id
        }
        setDeleteLoading(true);
        services.deleteSeries(parms)
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

    const { modelItems, totalRecord } = seriesData;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton 
                            onClick={() => {
                                setSelectedRow(modelItems[tableMeta.rowIndex]);
                                setUpdateSeriesModalOpen(true);
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
                    columns={[columnAction, ...seriesColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Series List"
                    toolbar={<TableCreateButton onClick={() => setCreateSeriesModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createSeriesModalOpen && (
                <CreateSeriesModal
                    closeModal={() => setCreateSeriesModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateSeriesModalOpen && (
                <UpdateSeriesModal
                    closeModal={() => setUpdateSeriesModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}
