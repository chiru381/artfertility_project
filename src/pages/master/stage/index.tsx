import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useIntl } from "react-intl";
import Box from '@material-ui/core/Box';

import CustomTable from "components/table";
import { TableCreateButton, TableButtonGroup, TableEditButton, DeleteButton } from "components/button";
import { getMasterPaginationData } from "redux/actions";
import { tableInitialState, masterPaginationServices, stageColumns } from "utils/constants";
import { getTableParams } from "utils/global";
import { RootReducerState } from "utils/types";
import { services } from "utils/services";
import { masterPaginationReducer } from "redux/reducers";
import RootContext from "utils/context/RootContext";
import CreateStageModal from './CreateStageModal';
import UpdateStageModal from './UpdateStageModal';

export default function Stage() {
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [createStageModalOpen, setCreateStageModalOpen] = useState(false);
    const [updateStageModalOpen, setUpdateStageModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [tableState, setTableState] = useState(tableInitialState);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { stageData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            stageData: masterPaginationReducer[masterPaginationServices.stage].data,
            loading: masterPaginationReducer[masterPaginationServices.stage].loading
        }),
        shallowEqual
    );


    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.stage, params));
    }

    const { modelItems, totalRecord } = stageData;

    function onDeleteData(data: any) {
        const parms = {
            stageId: data.id
        }
        setDeleteLoading(true);
        services.deleteStage(parms)
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
                                setSelectedRow(modelItems[tableMeta.rowIndex])
                                setUpdateStageModalOpen(true)
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
        <Box py={2} className="container">
            <CustomTable
                columns={[columnAction, ...stageColumns(formatMessage)]}
                tableState={tableState}
                tableData={modelItems}
                setTableState={setTableState}
                rowsCount={totalRecord}
                title="Stage List"
                toolbar={<TableCreateButton onClick={() => setCreateStageModalOpen(true)} />}
                loading={loading || deleteLoading}
            />
        </Box>

        {createStageModalOpen && (
            <CreateStageModal
                closeModal={() => setCreateStageModalOpen(false)}
                onApiCall={onApiCall}
            />
        )}


        {updateStageModalOpen && (
            <UpdateStageModal
                closeModal={() => setUpdateStageModalOpen(false)}
                selectedData={selectedRow}
                onApiCall={onApiCall}
            />
        )}
        </>
    )
}