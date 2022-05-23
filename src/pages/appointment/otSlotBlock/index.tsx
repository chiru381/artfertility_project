import { useEffect, useState } from 'react';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Box from '@material-ui/core/Box';

import { getAppointmentLookup, getMasterPaginationData } from 'redux/actions';
import CustomTable from 'components/table';
import { TableCreateButton, DeleteButton, TableButtonGroup, TableEditButton } from 'components/button';
import { tableInitialState, masterPaginationServices, otSlotBlockColumn, filterTypes } from 'utils/constants';

import { RootReducerState } from 'utils/types';
import { getTableParams } from 'utils/global';
import { services } from 'utils/services';
import CreateOTSlotBlock from "./CreateOTSlotBlock";
import { HoverLoader } from 'components';
import { useToastMessage } from 'utils/hooks';


export default function OTSlotBlock() {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const { toastMessage } = useToastMessage();

    const [tableState, setTableState] = useState(tableInitialState);
    const [createOTSlotModalOpen, setCreateOTSlotModalOpen] = useState(false);
    const [updateOTSlotModalOpen, setUpdateOTSlotModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { otSlotBlockData, loading, appointmentLookupData } = useSelector(
        ({ masterPaginationReducer, appointmentLookupReducer }: RootReducerState) => ({
            otSlotBlockData: masterPaginationReducer[masterPaginationServices.otSlotBlock].data,
            loading: masterPaginationReducer[masterPaginationServices.otSlotBlock].loading,
            appointmentLookupData: appointmentLookupReducer.data,
        }),
        shallowEqual
    );
    let reasonOptions = appointmentLookupData?.blockReasons?.map((reason: any) => ({ label: reason.text, value: reason.text }));

    useEffect(() => {
        dispatch(getAppointmentLookup());
    }, []);

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = otSlotBlockData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.otSlotBlock, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            operationTheatreSlotBlockId: data.id
        }
        setDeleteLoading(true);
        services.deleteOTSlotBlock(parms)
            .then((res) => {
                setDeleteLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "ot-slot-block" }) + " " + formatMessage({ id: "delete-message" }));
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
                                setUpdateOTSlotModalOpen(true);
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

    let reasonColumn = {
        name: 'blockReasonName',
        label: formatMessage({ id: "reason" }),
        primaryColumnName: 'BlockReason.Name',
        type: filterTypes.select,
        selectOptions: reasonOptions ?? []
    }

    return (
        <>
            <Box className="table-container">
                <CustomTable
                    columns={[columnAction, ...otSlotBlockColumn(formatMessage), reasonColumn]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="OT Slot Block"
                    toolbar={<TableCreateButton onClick={() => setCreateOTSlotModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createOTSlotModalOpen && <CreateOTSlotBlock
                closeModal={() => setCreateOTSlotModalOpen(false)}
                onApiCall={onApiCall}
            />}

            {updateOTSlotModalOpen && <CreateOTSlotBlock
                closeModal={() => setUpdateOTSlotModalOpen(false)}
                onApiCall={onApiCall}
                selectedData={selectedRow}
            />}

            {deleteLoading && <HoverLoader />}
        </>
    )
}