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
import CreateEmployeeCategoryModal from "./CreateEmployeeCategoryModal";
import UpdateEmployeeCategoryModal from "./UpdateEmployeeCategoryModal";

export default function EmployeeCategory() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createEmployeeCategoryModalOpen, setCreateEmployeeCategoryModalOpen] = useState(false);
    const [updateEmployeeCategoryModalOpen, setUpdateEmployeeCategoryModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const employeeCategoryColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "employee-category" }), type: filterTypes.text }
        ]
    }

    const { employeeCategoryData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            employeeCategoryData: masterPaginationReducer[masterPaginationServices.employeeCategory].data,
            loading: masterPaginationReducer[masterPaginationServices.employeeCategory].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = employeeCategoryData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.employeeCategory, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            employeeCategoryId: data.id
        }
        setDeleteLoading(true);
        services.deleteEmployeeCategory(parms)
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
                            setUpdateEmployeeCategoryModalOpen(true);
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
                    columns={[columnAction, ...employeeCategoryColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Employee Category"
                    toolbar={<TableCreateButton onClick={() => setCreateEmployeeCategoryModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createEmployeeCategoryModalOpen && (
                <CreateEmployeeCategoryModal
                    closeModal={() => setCreateEmployeeCategoryModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateEmployeeCategoryModalOpen && (
                <UpdateEmployeeCategoryModal
                    closeModal={() => setUpdateEmployeeCategoryModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}