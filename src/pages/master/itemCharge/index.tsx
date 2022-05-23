import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useIntl } from "react-intl";
import Box from '@material-ui/core/Box';

import CustomTable from "components/table";
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { getMasterPaginationData } from "redux/actions";
import { getTableParams } from "utils/global";
import { services } from "utils/services";
import { tableInitialState, masterPaginationServices, itemChargeColumns } from "utils/constants";
import { RootReducerState } from "utils/types";
import RootContext from "utils/context/RootContext";
import CreateItemCharge from './CreateItemChargeModal';
import UpdateItemCharge from './UpdateItemChargeModal';

export default function ItemCharge() {
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [createItemChargeModalOpen, setCreateItemChargeModalOpen] = useState(false);
    const [updateItemChargeModalOpen, setUpdateItemChargeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [tableState, setTableState] = useState(tableInitialState);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { itemChargeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            itemChargeData: masterPaginationReducer[masterPaginationServices.itemCharge].data,
            loading: masterPaginationReducer[masterPaginationServices.itemCharge].loading
        }),
        shallowEqual
    );

    const { modelItems, totalRecord } = itemChargeData;

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.itemCharge, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            itemChargeId: data.id
        }
        setDeleteLoading(true);
        services.deleteItemCharge(parms)
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
            customRenderBody: (_:any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton
                            onClick={() => {
                                setSelectedRow(modelItems[tableMeta.rowIndex]);
                                setUpdateItemChargeModalOpen(true);
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
                columns={[columnAction, ...itemChargeColumns(formatMessage)]}
                tableState={tableState}
                tableData={modelItems}
                setTableState={setTableState}
                title="Item Charge List"
                rowsCount={totalRecord}
                toolbar={<TableCreateButton onClick={() => setCreateItemChargeModalOpen(true)} />}
                loading={loading || deleteLoading}
            />
        </Box>

        {createItemChargeModalOpen && (
            <CreateItemCharge
                closeModal={() => setCreateItemChargeModalOpen(false)}
                onApiCall={onApiCall}
            />
        )}

        {updateItemChargeModalOpen && (
            <UpdateItemCharge
                closeModal={() => setUpdateItemChargeModalOpen(false)}
                selectedData={selectedRow}
                onApiCall={onApiCall}
            />
        )}
        </>
    )
}