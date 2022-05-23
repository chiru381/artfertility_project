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
import CreateResultValueModal from "./CreateResultValueModal";
import UpdateResultValueModal from "./UpdateResultValueModal";

export default function ResultValue() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createResultValueModalOpen, setCreateResultValueModalOpen] = useState(false);
    const [updateResultValueModalOpen, setUpdateResultValueModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const resultValueColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "result-value-name" }), type: filterTypes.text }
        ]
    }

    const { resultValueData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            resultValueData: masterPaginationReducer[masterPaginationServices.resultValue].data,
            loading: masterPaginationReducer[masterPaginationServices.resultValue].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = resultValueData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.resultValue, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            resultValueId: data.id
        }
        setDeleteLoading(true);
        services.deleteResultValue(parms)
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
                            setUpdateResultValueModalOpen(true);
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
                    columns={[columnAction, ...resultValueColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Result Value List"
                    toolbar={<TableCreateButton onClick={() => setCreateResultValueModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createResultValueModalOpen && (
                <CreateResultValueModal
                    closeModal={() => setCreateResultValueModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateResultValueModalOpen && (
                <UpdateResultValueModal
                    closeModal={() => setUpdateResultValueModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}