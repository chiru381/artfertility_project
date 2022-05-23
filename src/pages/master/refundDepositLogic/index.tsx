import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useIntl } from "react-intl";
import Box from '@material-ui/core/Box';

import CustomTable from "components/table";
import { TableCreateButton, EditButton, DeleteButton } from "components/button";
import { getMasterPaginationData } from "redux/actions";
import { getTableParams } from "utils/global";
import { services } from "utils/services";
import { tableInitialState, masterPaginationServices, refundDepositLogicColumns } from "utils/constants";
import { RootReducerState } from "utils/types";
import RootContext from "utils/context/RootContext";
import CreateRefundDepositLogic from './CreateRefundDepositLogicModal';
import UpdateRefundDepositLogic from './UpdateRefundDepositLogicModal';

export default function RefundDepositLogic() {
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [createRefundDepositLogicModalOpen, setCreateRefundDepositLogicModalOpen] = useState(false);
    const [updateRefundDepositLogicModalOpen, setUpdateRefundDepositLogicModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [tableState, setTableState] = useState(tableInitialState);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { refundDepositLogicData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            refundDepositLogicData: masterPaginationReducer[masterPaginationServices.refundDepositLogic].data,
            loading: masterPaginationReducer[masterPaginationServices.refundDepositLogic].loading
        }),
        shallowEqual
    );

    const { modelItems, totalRecord } = refundDepositLogicData;

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.refundDepositLogic, params));
    }


    function onDeleteData(data: any) {
        const parms = {
            refundDepositLogicId: data.id
        }
        setDeleteLoading(true);
        services.deleteRefundDepositLogic(parms)
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
                    <div style={{ display: 'flex' }}>
                        <EditButton
                            onClick={() => {
                                setSelectedRow(modelItems[tableMeta.rowIndex])
                                setUpdateRefundDepositLogicModalOpen(true)
                            }}
                        />

                        <DeleteButton
                            onDelete={() => onDeleteData(modelItems[tableMeta.rowIndex])}
                        />
                    </div>
                )
            }
        }
    }
    return (
        <>
        <Box py={2} className="container">
            <CustomTable
                columns={[columnAction, ...refundDepositLogicColumns(formatMessage)]}
                tableState={tableState}
                tableData={modelItems}
                setTableState={setTableState}
                title="Refund Deposit Logic List"
                rowsCount={totalRecord}
                toolbar={<TableCreateButton onClick={() => setCreateRefundDepositLogicModalOpen(true)} />}
                loading={loading || deleteLoading}
            />
        </Box>

        {createRefundDepositLogicModalOpen && (
            <CreateRefundDepositLogic
                closeModal={() => setCreateRefundDepositLogicModalOpen(false)}
                onApiCall={onApiCall}
            />
        )}

        {updateRefundDepositLogicModalOpen && (
            <UpdateRefundDepositLogic
                closeModal={() => setUpdateRefundDepositLogicModalOpen(false)}
                selectedData={selectedRow}
                onApiCall={onApiCall}
            />
        )}
        </>
    )
}