import { useEffect, useState } from 'react';
import { getMasterPaginationData } from 'redux/actions';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useHistory } from 'react-router-dom';

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, DeleteButton,TableButtonGroup } from 'components/button';
import { tableInitialState, masterPaginationServices, userColumns } from 'utils/constants';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import { useToastMessage, useCreateLookupOptions } from 'utils/hooks';
import { services } from 'utils/services';
import { getUserLookup } from 'redux/actions';
import { filterTypes } from 'utils/constants/default';

export default function User() {
    const [tableState, setTableState] = useState(tableInitialState);
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const history = useHistory();

    const { userData, loading, userLookupData } = useSelector(
        ({ masterPaginationReducer, userLookupReducer }: RootReducerState) => ({
            userData: masterPaginationReducer[masterPaginationServices.user].data,
            loading: masterPaginationReducer[masterPaginationServices.user].loading,
            userLookupData: userLookupReducer.data
        }),
        shallowEqual
    );

    useEffect(() => {
        if (!Object.keys(userLookupData).length) {
            dispatch(getUserLookup());
        }
    }, []);

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.user, params));
    }

    // Lookup options for dropdown
    let selectOptions = useCreateLookupOptions(userLookupData);

    const { modelItems, totalRecord } = userData;

    const columns = [
        ...userColumns(formatMessage),
        {
            name: 'departmentName', label: formatMessage({ id: "department" }),
            type: filterTypes.select,
            selectOptions: selectOptions?.departments ?? [],
            hideGlobalSearchFilter: true,
            primaryColumnName: "Department.Name",
            secondaryColumnName:"departmentId"
        },
        {
            name: 'designationName', label: formatMessage({ id: "designation" }),
            type: filterTypes.select,
            selectOptions: selectOptions?.designations ?? [],
            hideGlobalSearchFilter: true,
            primaryColumnName: "Designation.Name",
            secondaryColumnName:"designationId"
        },
        {
            name: 'employeeCategoryName', label: formatMessage({ id: "employee-category" }),
            type: filterTypes.select,
            selectOptions: selectOptions?.employeeCategories ?? [],
            hideGlobalSearchFilter: true,
            primaryColumnName: "EmployeeCategory.Name",
            secondaryColumnName:"employeeCategoryId"
        },
        {
            name: 'employeeTypeName', label: formatMessage({ id: "employee-type" }),
            type: filterTypes.select,
            selectOptions: selectOptions?.employeeTypes ?? [],
            hideGlobalSearchFilter: true,
            primaryColumnName: "EmployeeType.Name",
            secondaryColumnName:"employeeTypeId" 
        }
    ]

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton
                            tooltipLabel="Edit User"
                            onClick={() => handleRowClick(modelItems[tableMeta.rowIndex])}
                        />
                        <DeleteButton
                            onDelete={() => onDeleteData(modelItems[tableMeta.rowIndex])}
                        />
                    </TableButtonGroup>
                )
            }
        }
    }

    const handleCreateClick = () => {
        history.push(`user/create`, {});
    }

    function handleRowClick(rowData: any) {
        history.push(`user/update`, { ...rowData });
    }

    function onDeleteData(data: any) {
        const parms = {
            userId: data.id
        }
        setDeleteLoading(true);
        services.deleteUser(parms)
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

    return (
        <Box className="table-container">
            <CustomTable
                columns={[columnAction, ...columns]}
                tableData={modelItems}
                tableState={tableState}
                rowsCount={totalRecord}
                setTableState={setTableState}
                title="User List"
                toolbar={<TableCreateButton onClick={handleCreateClick} />}
                loading={loading || deleteLoading}
            />
        </Box>
    )
}