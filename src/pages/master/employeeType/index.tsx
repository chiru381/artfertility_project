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
import CreateDepartmentModal from "./CreateEmployeeModal";
import UpdateDepartmentModal from "./UpdateEmployeeModal";

export default function EmployeeType() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createDepartmentModalOpen, setCreateEmployeeTypeModalOpen] = useState(false);
    const [updateDepartmentModalOpen, setUpdateEmployeeTypeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const employeeTypeColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "employee-type" }), type: filterTypes.text }
        ]
    }

    const { employeeTypeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            employeeTypeData: masterPaginationReducer[masterPaginationServices.employeeType].data,
            loading: masterPaginationReducer[masterPaginationServices.employeeType].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = employeeTypeData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.employeeType, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            employeeTypeId: data.id
        }
        setDeleteLoading(true);
        services.deleteEmployeeType(parms)
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
                            setUpdateEmployeeTypeModalOpen(true);
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
                    columns={[columnAction, ...employeeTypeColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Employee Type"
                    toolbar={<TableCreateButton onClick={() => setCreateEmployeeTypeModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createDepartmentModalOpen && (
                <CreateDepartmentModal
                    closeModal={() => setCreateEmployeeTypeModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateDepartmentModalOpen && (
                <UpdateDepartmentModal
                    closeModal={() => setUpdateEmployeeTypeModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}