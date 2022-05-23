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
import CreateDiscountReasonModal from "./CreateDiscountReasonModal";
import UpdateDiscountReasonModal from "./UpdateDiscountReasonModal";

export default function DiscountReason() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createDiscountReasonModalOpen, setCreateDiscountReasonModalOpen] = useState(false);
    const [updateDiscountReasonModalOpen, setUpdateDiscountReasonModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const discountReasonColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "reason" }), type: filterTypes.text }
        ]
    }

    const { discountReasonData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            discountReasonData: masterPaginationReducer[masterPaginationServices.discountReason].data,
            loading: masterPaginationReducer[masterPaginationServices.discountReason].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = discountReasonData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.discountReason, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            discountReasonId: data.id
        }
        setDeleteLoading(true);
        services.deleteDiscountReason(parms)
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
                            setUpdateDiscountReasonModalOpen(true);
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
                    columns={[columnAction, ...discountReasonColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Discount Reason List"
                    toolbar={<TableCreateButton onClick={() => setCreateDiscountReasonModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createDiscountReasonModalOpen && (
                <CreateDiscountReasonModal
                    closeModal={() => setCreateDiscountReasonModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateDiscountReasonModalOpen && (
                <UpdateDiscountReasonModal
                    closeModal={() => setUpdateDiscountReasonModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}