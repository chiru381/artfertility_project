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
import CreateCancelReasonModal from "./CreateCancelReasonModal";
import UpdateCancelReasonModal from "./UpdateCancelReasonModal";

export default function CancelReason() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createCancelReasonModalOpen, setCreateCancelReasonModalOpen] = useState(false);
    const [updateCancelReasonModalOpen, setUpdateCancelReasonModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const cancelReasonColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "cancel-reason" }), type: filterTypes.text }
        ]
    }

    const { cancelReasonData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            cancelReasonData: masterPaginationReducer[masterPaginationServices.cancelReason].data,
            loading: masterPaginationReducer[masterPaginationServices.cancelReason].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = cancelReasonData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.cancelReason, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            cancelReasonId: data.id
        }
        setDeleteLoading(true);
        services.deleteCancelReason(parms)
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
                            setUpdateCancelReasonModalOpen(true);
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
                    columns={[columnAction, ...cancelReasonColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Cancel Reason List"
                    toolbar={<TableCreateButton onClick={() => setCreateCancelReasonModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createCancelReasonModalOpen && (
                <CreateCancelReasonModal
                    closeModal={() => setCreateCancelReasonModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateCancelReasonModalOpen && (
                <UpdateCancelReasonModal
                    closeModal={() => setUpdateCancelReasonModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}