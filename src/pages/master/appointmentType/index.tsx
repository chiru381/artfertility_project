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
import CreateAppointmentTypeModal from "./CreateAppointmentTypeModal";
import UpdateAppointmentTypeModal from "./UpdateAppointmentTypeModal";

export default function Occupation() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createAppointmentTypeModalOpen, setCreateAppointmentTypeModalOpen] = useState(false);
    const [updateAppointmentTypeModalOpen, setUpdateAppointmentTypeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const appointmentTypeColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "appointment-type" }), type: filterTypes.text }
        ]
    }

    const { appointmentTypeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            appointmentTypeData: masterPaginationReducer[masterPaginationServices.appointmentType].data,
            loading: masterPaginationReducer[masterPaginationServices.appointmentType].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = appointmentTypeData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.appointmentType, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            appointmentTypeId: data.id
        }
        setDeleteLoading(true);
        services.deleteAppointmentType(parms)
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
                            setUpdateAppointmentTypeModalOpen(true);
                        }}
                        />

                        <DeleteButton
                            onDelete={() => onDeleteData(modelItems[tableMeta.rowIndex])}
                        />
                    </TableButtonGroup >
                )
            }
        }
    }

    return (
        <>
            <Box className="table-container">

                <CustomTable
                    columns={[columnAction, ...appointmentTypeColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Appointment Type"
                    toolbar={<TableCreateButton onClick={() => setCreateAppointmentTypeModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createAppointmentTypeModalOpen && (
                <CreateAppointmentTypeModal
                    closeModal={() => setCreateAppointmentTypeModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateAppointmentTypeModalOpen && (
                <UpdateAppointmentTypeModal
                    closeModal={() => setUpdateAppointmentTypeModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}