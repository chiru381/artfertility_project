import { useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { getMasterPaginationData } from 'redux/actions';
import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { getTableParams } from 'utils/global';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import { filterTypes } from 'utils/constants/default';
import CreateBlockReasonModal from "./CreateBlockReasonModal";
import UpdateBlockReasonModal from "./UpdateBlockReasonModal";

export default function BlockReason() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createBlockReasonModalOpen, setCreateBlockReasonModalOpen] = useState(false);
    const [updateBlockReasonModalOpen, setUpdateBlockReasonModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const blockReasonColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "block-reason" }), type: filterTypes.text }
        ]
    }

    const { blockReasonData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            blockReasonData: masterPaginationReducer[masterPaginationServices.blockReason].data,
            loading: masterPaginationReducer[masterPaginationServices.blockReason].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = blockReasonData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.blockReason, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            blockReasonId: data.id
        }
        setDeleteLoading(true);
        services.deleteBlockReason(parms)
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

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateBlockReasonModalOpen(true);
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
                    columns={[columnAction, ...blockReasonColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Block Reason List"
                    toolbar={<TableCreateButton onClick={() => setCreateBlockReasonModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createBlockReasonModalOpen && (
                <CreateBlockReasonModal
                    closeModal={() => setCreateBlockReasonModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateBlockReasonModalOpen && (
                <UpdateBlockReasonModal
                    closeModal={() => setUpdateBlockReasonModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}