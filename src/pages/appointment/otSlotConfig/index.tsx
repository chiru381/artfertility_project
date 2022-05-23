import { useEffect, useMemo, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { RootReducerState } from 'utils/types';
import { services } from 'utils/services';
import { getTableParams } from 'utils/global';
import { getAppointmentLookup, getMasterPaginationData } from 'redux/actions';
import CustomTable from 'components/table';
import { TableCreateButton, DeleteButton, TableEditButton, TableButtonGroup } from 'components/button';
import { tableInitialState, masterPaginationServices, otSlotConfigColumns, getDayName } from 'utils/constants';
import CreateOTSlotConfigModal from "./CreateOTSlotConfigModal";
import UpdateOTSlotConfigModal from "./UpdateOTSlotConfigModal";
import { useToastMessage } from 'utils/hooks';

export default function OTSlotConfiguration() {
    const { toastMessage } = useToastMessage();
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [tableState, setTableState] = useState(tableInitialState);
    const [createOTSlotConfigModalOpen, setCreateOTSlotConfigModalOpen] = useState(false);
    const [updateOTSlotConfigModalOpen, setUpdateOTSlotConfigModalOpen] = useState(false);
    const [selectedOTSlot, setSelectedselectedOTSlot] = useState<any>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { otSlotConfigData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            otSlotConfigData: masterPaginationReducer[masterPaginationServices.otSlotConfig].data,
            loading: masterPaginationReducer[masterPaginationServices.otSlotConfig].loading
        }),
        shallowEqual
    );

    const { modelItems, totalRecord } = otSlotConfigData;
    let tableRecords = useMemo(() => {
        return modelItems.map((row: any) => {
            let excludedDays = row.operatingTheatreSlotConfigDetails.filter((row: any) => row.isExcluded).map((row: any) => getDayName(row.dayOfWeekNumber));
            return ({
                ...row,
                excludedDays: excludedDays.length ? excludedDays.join(', ') : '-'
            })
        })
    }, [modelItems]);

    useEffect(() => {
        dispatch(getAppointmentLookup());
    }, []);

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.otSlotConfig, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            operatingTheatreSlotConfigId: data.id
        }
        setDeleteLoading(true);
        services.deleteOTSlotConfig(parms)
            .then((res) => {
                setDeleteLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "ot-slot-config" }) + " " + formatMessage({ id: "delete-message" }));
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
                                setSelectedselectedOTSlot(modelItems[tableMeta.rowIndex]);
                                setUpdateOTSlotConfigModalOpen(true);
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
                    columns={[columnAction, ...otSlotConfigColumns(formatMessage)]}
                    tableData={tableRecords}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="OT Slot Configuration"
                    toolbar={<TableCreateButton onClick={() => setCreateOTSlotConfigModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createOTSlotConfigModalOpen && (
                <CreateOTSlotConfigModal
                    closeModal={() => setCreateOTSlotConfigModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateOTSlotConfigModalOpen && (
                <UpdateOTSlotConfigModal
                    closeModal={() => setUpdateOTSlotConfigModalOpen(false)}
                    selectedOTSlotData={selectedOTSlot}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}