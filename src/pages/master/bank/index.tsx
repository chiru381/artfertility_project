import { useState, useEffect, useContext } from "react";
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import CustomTable from "components/table";
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from "components/button";
import { tableInitialState, masterPaginationServices, bankColumns } from "utils/constants";
import { RootReducerState } from "utils/types";
import { getTableParams } from "utils/global";
import { getMasterPaginationData } from "redux/actions";
import { services } from "utils/services";
import RootContext from "utils/context/RootContext";
import CreateBankModal from './CreateBankModal';
import UpdateBankModal from './UpdateBankModal';

export default function Bank() {
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [createBankModalOpen, setCreateBankModalOpen] = useState(false);
    const [updateBankModalOpen, setUpdateBankModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [tableState, setTableState] = useState(tableInitialState);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { bankDetailData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState ) => ({
            bankDetailData: masterPaginationReducer[masterPaginationServices.bankDetail].data,
            loading: masterPaginationReducer[masterPaginationServices.bankDetail].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.bankDetail, params));
    }

    const { modelItems, totalRecord } = bankDetailData;
    
    function onDeleteData(data: any) {
        const parms = {
            bankDetailId: data.id
        }
        setDeleteLoading(true);
        services.deleteBankDetail(parms)
        .then((res) => {
            setDeleteLoading(false);
            if(res.data?.succeeded) {
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
                    <TableEditButton
                            onClick={() => {
                                setSelectedRow(modelItems[tableMeta.rowIndex]);
                                setUpdateBankModalOpen(true);
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
                columns={[columnAction, ...bankColumns(formatMessage)]}
                tableData={modelItems}
                tableState={tableState}
                rowsCount={totalRecord}
                setTableState={setTableState}
                title="Bank List"
                toolbar={<TableCreateButton onClick={() => setCreateBankModalOpen(true)} />}
                loading={loading || deleteLoading}
            />
        </Box>

        {createBankModalOpen && (
            <CreateBankModal
                closeModal={() => setCreateBankModalOpen(false)}
                onApiCall={onApiCall}
            />
        )}

        {updateBankModalOpen && (
            <UpdateBankModal
                closeModal={() => setUpdateBankModalOpen(false)}
                selectedData={selectedRow}
                onApiCall={onApiCall}
            />
        )}
        </>
    )
}