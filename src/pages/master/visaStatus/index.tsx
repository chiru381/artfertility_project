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
import CreateVisaStatusModal from "./CreateVisaStatusModal";
import UpdateVisaStatusModal from "./UpdateVisaStatusModal";

export default function Occupation() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createVisaStatusModalOpen, setCreateVisaStatusModalOpen] = useState(false);
    const [updateVisaStatusModalOpen, setUpdateVisaStatusModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const visaStatusColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "visa-status" }), type: filterTypes.text }
        ]
    }

    const { visaStatusData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            visaStatusData: masterPaginationReducer[masterPaginationServices.visaStatus].data,
            loading: masterPaginationReducer[masterPaginationServices.visaStatus].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = visaStatusData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.visaStatus, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            visaStatusId: data.id
        }
        setDeleteLoading(true);
        services.deleteVisaStatus(parms)
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
                            setUpdateVisaStatusModalOpen(true);
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
                    columns={[columnAction, ...visaStatusColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Visa Status"
                    toolbar={<TableCreateButton onClick={() => setCreateVisaStatusModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createVisaStatusModalOpen && (
                <CreateVisaStatusModal
                    closeModal={() => setCreateVisaStatusModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateVisaStatusModalOpen && (
                <UpdateVisaStatusModal
                    closeModal={() => setUpdateVisaStatusModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}