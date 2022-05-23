import { useContext, useEffect, useState } from 'react';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Box from '@material-ui/core/Box';

import { getAppointmentLookup, getMasterPaginationData } from 'redux/actions';
import CustomTable from 'components/table';
import { TableCreateButton, DeleteButton, TableButtonGroup, TableEditButton } from 'components/button';
import { tableInitialState, masterPaginationServices, doctorSlotBlockColumn, filterTypes } from 'utils/constants';

import { RootReducerState } from 'utils/types';
import { getTableParams } from 'utils/global';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import CreateDoctorSlotBlock from "./CreateDoctorSlotBlock";
import { HoverLoader } from 'components';


export default function DoctorSlotBlock() {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const { toastMessage } = useContext<any>(RootContext);

    const [tableState, setTableState] = useState(tableInitialState);
    const [createDoctorSlotModalOpen, setCreateDoctorSlotModalOpen] = useState(false);
    const [updateDoctorSlotModalOpen, setUpdateDoctorSlotModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { doctorSlotBlockData, loading, appointmentLookupData } = useSelector(
        ({ masterPaginationReducer, appointmentLookupReducer }: RootReducerState) => ({
            doctorSlotBlockData: masterPaginationReducer[masterPaginationServices.doctorSlotBlock].data,
            loading: masterPaginationReducer[masterPaginationServices.doctorSlotBlock].loading,
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

    const { modelItems, totalRecord } = doctorSlotBlockData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.doctorSlotBlock, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            doctorSlotBlockId: data.id
        }
        setDeleteLoading(true);
        services.deleteDoctorSlotBlock(parms)
            .then((res) => {
                setDeleteLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "doctor-slot-block" }) + " " + formatMessage({ id: "delete-message" }));
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
                                setUpdateDoctorSlotModalOpen(true);
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
                    columns={[columnAction, ...doctorSlotBlockColumn(formatMessage), reasonColumn]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Doctor Slot Block"
                    toolbar={<TableCreateButton onClick={() => setCreateDoctorSlotModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createDoctorSlotModalOpen && <CreateDoctorSlotBlock
                closeModal={() => setCreateDoctorSlotModalOpen(false)}
                onApiCall={onApiCall}
            />}

            {updateDoctorSlotModalOpen && <CreateDoctorSlotBlock
                closeModal={() => setUpdateDoctorSlotModalOpen(false)}
                onApiCall={onApiCall}
                selectedData={selectedRow}
            />}

            {deleteLoading && <HoverLoader />}
        </>
    )
}