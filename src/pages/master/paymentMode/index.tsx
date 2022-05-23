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
import CreatePaymentModeModal from "./CreatePaymentModeModal";
import UpdatePaymentModeModal from "./UpdatePaymentModeModal";

export default function Occupation() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createPaymentModeModalOpen, setCreatePaymentModeModalOpen] = useState(false);
    const [updatePaymentModeModalOpen, setUpdatePaymentModeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const paymentModeColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "payment-mode" }), type: filterTypes.text }
        ]
    }

    const { paymentModeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            paymentModeData: masterPaginationReducer[masterPaginationServices.paymentMode].data,
            loading: masterPaginationReducer[masterPaginationServices.paymentMode].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = paymentModeData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.paymentMode, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            paymentModeId: data.id
        }
        setDeleteLoading(true);
        services.deletePaymentMode(parms)
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
                            setUpdatePaymentModeModalOpen(true);
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
                    columns={[columnAction, ...paymentModeColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Payment Mode"
                    toolbar={<TableCreateButton onClick={() => setCreatePaymentModeModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createPaymentModeModalOpen && (
                <CreatePaymentModeModal
                    closeModal={() => setCreatePaymentModeModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updatePaymentModeModalOpen && (
                <UpdatePaymentModeModal
                    closeModal={() => setUpdatePaymentModeModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}