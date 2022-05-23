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
import CreatePaymentTypeModal from "./CreatePaymentTypeModal";
import UpdatePaymentTypeModal from "./UpdatePaymentTypeModal";

export default function Occupation() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createPaymentTypeModalOpen, setCreatePaymentTypeModalOpen] = useState(false);
    const [updatePaymentTypeModalOpen, setUpdatePaymentTypeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const paymentTypeColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "paymenttype" }), type: filterTypes.text }
        ]
    }

    const { paymentTypeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            paymentTypeData: masterPaginationReducer[masterPaginationServices.paymentType].data,
            loading: masterPaginationReducer[masterPaginationServices.paymentType].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = paymentTypeData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.paymentType, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            paymentTypeId: data.id
        }
        setDeleteLoading(true);
        services.deletePaymentType(parms)
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
                            setUpdatePaymentTypeModalOpen(true);
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
                    columns={[columnAction, ...paymentTypeColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Payment Type"
                    toolbar={<TableCreateButton onClick={() => setCreatePaymentTypeModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createPaymentTypeModalOpen && (
                <CreatePaymentTypeModal
                    closeModal={() => setCreatePaymentTypeModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updatePaymentTypeModalOpen && (
                <UpdatePaymentTypeModal
                    closeModal={() => setUpdatePaymentTypeModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}