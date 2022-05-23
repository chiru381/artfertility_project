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
import CreateVisitTypeModal from "./CreatevVisitTypeModal";
import UpdateVisitTypeModal from "./UpdateVisitTypeModal";

export default function Occupation() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createVisitTypeModalOpen, setCreateVisitTypeModalOpen] = useState(false);
    const [updateVisitTypeModalOpen, setUpdateVisitTypeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const visitTypeColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "visit-type" }), type: filterTypes.text }
        ]
    }

    const { visitTypeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            visitTypeData: masterPaginationReducer[masterPaginationServices.visitType].data,
            loading: masterPaginationReducer[masterPaginationServices.visitType].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = visitTypeData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.visitType, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            visitTypeId: data.id
        }
        setDeleteLoading(true);
        services.deleteVisitType(parms)
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
                            setUpdateVisitTypeModalOpen(true);
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
                    columns={[columnAction, ...visitTypeColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Visit Type"
                    toolbar={<TableCreateButton onClick={() => setCreateVisitTypeModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createVisitTypeModalOpen && (
                <CreateVisitTypeModal
                    closeModal={() => setCreateVisitTypeModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateVisitTypeModalOpen && (
                <UpdateVisitTypeModal
                    closeModal={() => setUpdateVisitTypeModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}