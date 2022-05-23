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
import CreateDepartmentModal from "./CreateDepartmentModal";
import UpdateDepartmentModal from "./UpdateDepartmentModal";

export default function Department() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createDepartmentModalOpen, setCreateDepartmentModalOpen] = useState(false);
    const [updateDepartmentModalOpen, setUpdateDepartmentModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const departmentColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "department-name" }), type: filterTypes.text },
            {
                name: 'isParent', label: formatMessage({ id: "is-parent" }),
                options: {
                    customBodyRender: (value: string) => {
                        return <span>{value ? "Yes" : "No"}</span>
                    }
                },
                hideGlobalSearchFilter: true
            },
            {
                name: 'hasSpeciality', label: formatMessage({ id: "is-specialty" }),
                options: {
                    customBodyRender: (value: string) => {
                        return <span>{value ? "Yes" : "No"}</span>
                    }
                },
                hideGlobalSearchFilter: true,
                type: filterTypes.boolean,
                selectOptions: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }]
            }
        ]
    }

    const { departmentData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            departmentData: masterPaginationReducer[masterPaginationServices.department].data,
            loading: masterPaginationReducer[masterPaginationServices.department].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { totalRecord } = departmentData;

    const tableRow = departmentData.modelItems?.map((item: any) => ({
        ...item,
        isParent: item?.parentDepartmentId === null ? true : false
    }))

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.department, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            departmentId: data.id
        }
        setDeleteLoading(true);
        services.deleteDepartment(parms)
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
                            setSelectedRow(tableRow[tableMeta.rowIndex]);
                            setUpdateDepartmentModalOpen(true);
                        }}
                        />

                        <DeleteButton
                            onDelete={() => onDeleteData(tableRow[tableMeta.rowIndex])}
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
                    columns={[columnAction, ...departmentColumns(formatMessage)]}
                    tableData={tableRow}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Department List"
                    toolbar={<TableCreateButton onClick={() => setCreateDepartmentModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createDepartmentModalOpen && (
                <CreateDepartmentModal
                    closeModal={() => setCreateDepartmentModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateDepartmentModalOpen && (
                <UpdateDepartmentModal
                    closeModal={() => setUpdateDepartmentModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}