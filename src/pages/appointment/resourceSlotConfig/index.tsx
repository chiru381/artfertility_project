import { useContext, useEffect, useMemo, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import RootContext from 'utils/context/RootContext';
import { RootReducerState } from 'utils/types';
import { services } from 'utils/services';
import { getTableParams } from 'utils/global';
import { getAppointmentLookup, getMasterPaginationData } from 'redux/actions';
import CustomTable from 'components/table';
import { TableCreateButton, DeleteButton, TableButtonGroup, TableEditButton } from 'components/button';
import { tableInitialState, masterPaginationServices, resourceSlotConfigColumns, getDayName } from 'utils/constants';
import CreateResourceSlotConfigModal from "./CreateResourceSlotConfigModal";
import UpdateResourceSlotConfigModal from "./UpdateResourceSlotConfigModal";

export default function ResourceSlotConfig() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createResourceSlotConfigModalOpen, setCreateResourceSlotConfigModalOpen] = useState(false);
    const [updateResourceSlotConfigModalOpen, setUpdateResourceSlotConfigModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { resourceSlotConfigData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            resourceSlotConfigData: masterPaginationReducer[masterPaginationServices.resourceSlotConfig].data,
            loading: masterPaginationReducer[masterPaginationServices.resourceSlotConfig].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(getAppointmentLookup());
    }, []);

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.resourceSlotConfig, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            resourceSlotConfigId: data.id
        }
        setDeleteLoading(true);
        services.deleteResourceSlotConfig(parms)
            .then((res) => {
                setDeleteLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "resource-slot-config" }) + " " + formatMessage({ id: "delete-message" }));
                }
            })
            .catch((err) => {
                setDeleteLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    const { modelItems, totalRecord } = resourceSlotConfigData;
    let tableRecords = useMemo(() => {
        return modelItems.map((row: any) => {
            let excludedDays = row.resourceSlotConfigDetails.filter((row: any) => row.isExcluded).map((row: any) => getDayName(row.dayOfWeekNumber));
            return ({
                ...row,
                excludedDays: excludedDays.length ? excludedDays.join(', ') : '-'
            })
        })
    }, [modelItems]);

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
                                setUpdateResourceSlotConfigModalOpen(true);
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
                    columns={[columnAction, ...resourceSlotConfigColumns(formatMessage)]}
                    tableData={tableRecords}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Resource Slot Configuration"
                    toolbar={<TableCreateButton onClick={() => setCreateResourceSlotConfigModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createResourceSlotConfigModalOpen && (
                <CreateResourceSlotConfigModal
                    closeModal={() => setCreateResourceSlotConfigModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateResourceSlotConfigModalOpen && (
                <UpdateResourceSlotConfigModal
                    closeModal={() => setUpdateResourceSlotConfigModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}