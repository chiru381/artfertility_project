import { useEffect, useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import { filterTypes } from 'utils/constants/default';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import CreateEquipmentModal from "./CreateEquipmentModal";
import UpdateEquipmentModal from "./UpdateEquipmentModal";

export default function Equipment() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createEquipmentModalOpen, setCreateEquipmentModalOpen] = useState(false);
    const [updateEquipmentModalOpen, setUpdateEquipmentModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { formatMessage } = useIntl();
    const { toastMessage } = useContext<any>(RootContext);
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const equipmentColumns = (formatMessage: any) => [
        { name: 'name', label: formatMessage({ id: "equipment" }), type: filterTypes.text },
        { name: 'clinicName', label: formatMessage({ id: "clinic" }) },
        { name: 'subDepartmentName', label: formatMessage({ id: "sub-department" }) },
    ]

    const { equipmentData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            equipmentData: masterPaginationReducer[masterPaginationServices.equipment].data,
            loading: masterPaginationReducer[masterPaginationServices.equipment].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.equipment, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            equipmentId: data.id
        }
        setDeleteLoading(true);
        services.deleteEquipment(parms)
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

    const { modelItems, totalRecord } = equipmentData;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateEquipmentModalOpen(true);
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
                    columns={[columnAction, ...equipmentColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Equipment"
                    toolbar={<TableCreateButton onClick={() => setCreateEquipmentModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createEquipmentModalOpen && (
                <CreateEquipmentModal
                    closeModal={() => setCreateEquipmentModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateEquipmentModalOpen && (
                <UpdateEquipmentModal
                    closeModal={() => setUpdateEquipmentModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}