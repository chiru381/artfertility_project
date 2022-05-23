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
import CreateRescheduleReasonModal from "./CreateRescheduleReasonModal";
import UpdateRescheduleReasonModal from "./UpdateRescheduleReasonModal";

export default function Occupation() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createRescheduleReasonModalOpen, setCreateRescheduleReasonModalOpen] = useState(false);
    const [updateRescheduleReasonModalOpen, setUpdateRescheduleReasonModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const rescheduleReasonColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "reschedule-reason" }), type: filterTypes.text }
        ]
    }

    const { rescheduleReasonData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            rescheduleReasonData: masterPaginationReducer[masterPaginationServices.rescheduleReason].data,
            loading: masterPaginationReducer[masterPaginationServices.rescheduleReason].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = rescheduleReasonData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.rescheduleReason, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            rescheduleReasonId: data.id
        }
        setDeleteLoading(true);
        services.deleteRescheduleReason(parms)
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
                            setUpdateRescheduleReasonModalOpen(true);
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
                    columns={[columnAction, ...rescheduleReasonColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Reschedule Reason"
                    toolbar={<TableCreateButton onClick={() => setCreateRescheduleReasonModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createRescheduleReasonModalOpen && (
                <CreateRescheduleReasonModal
                    closeModal={() => setCreateRescheduleReasonModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateRescheduleReasonModalOpen && (
                <UpdateRescheduleReasonModal
                    closeModal={() => setUpdateRescheduleReasonModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}