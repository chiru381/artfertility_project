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
import CreateMaritalStatusModal from "./CreateMaritalStatusModal";
import UpdateMaritalStatusModal from "./UpdateMaritalStatusModal";

export default function MaritalStatus() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createMaritalStatusModalOpen, setCreateMaritalStatusModalOpen] = useState(false);
    const [updateMaritalStatusModalOpen, setUpdateMaritalStatusModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const maritalStatusColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "marital-status" }), type: filterTypes.text }
        ]
    }

    const { maritalStatusData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            maritalStatusData: masterPaginationReducer[masterPaginationServices.maritalStatus].data,
            loading: masterPaginationReducer[masterPaginationServices.maritalStatus].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = maritalStatusData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.maritalStatus, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            maritalStatusId: data.id
        }
        setDeleteLoading(true);
        services.deleteMaritalStatus(parms)
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
                            setUpdateMaritalStatusModalOpen(true);
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
                    columns={[columnAction, ...maritalStatusColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Gender"
                    toolbar={<TableCreateButton onClick={() => setCreateMaritalStatusModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createMaritalStatusModalOpen && (
                <CreateMaritalStatusModal
                    closeModal={() => setCreateMaritalStatusModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateMaritalStatusModalOpen && (
                <UpdateMaritalStatusModal
                    closeModal={() => setUpdateMaritalStatusModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}