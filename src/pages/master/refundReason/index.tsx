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
import CreateRefundReasonModal from "./CreateRefundReasonModal";
import UpdateRefundReasonModal from "./UpdateRefundReasonModal";

export default function RefundReason() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createRefundReasonModalOpen, setCreateRefundReasonModalOpen] = useState(false);
    const [updateRefundReasonModalOpen, setUpdateRefundReasonModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const refundReasonColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "reason" }), type: filterTypes.text }
        ]
    }

    const { refundReasonData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            refundReasonData: masterPaginationReducer[masterPaginationServices.refundReason].data,
            loading: masterPaginationReducer[masterPaginationServices.refundReason].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = refundReasonData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.refundReason, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            refundReasonId: data.id
        }
        setDeleteLoading(true);
        services.deleteRefundReason(parms)
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
                            setUpdateRefundReasonModalOpen(true);
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
                    columns={[columnAction, ...refundReasonColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Refund Reason List"
                    toolbar={<TableCreateButton onClick={() => setCreateRefundReasonModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createRefundReasonModalOpen && (
                <CreateRefundReasonModal
                    closeModal={() => setCreateRefundReasonModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateRefundReasonModalOpen && (
                <UpdateRefundReasonModal
                    closeModal={() => setUpdateRefundReasonModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}