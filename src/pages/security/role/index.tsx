import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getMasterPaginationData } from 'redux/actions';
import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton, TablePermissionButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { useToastMessage } from 'utils/hooks';
import { getTableParams } from 'utils/global';
import { services } from 'utils/services';
import { filterTypes } from 'utils/constants/default';
import CreateRoleModal from "./CreateRoleModal";
import UpdateRoleModal from "./UpdateRoleModal";

export default function Role() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
    const [updateRoleModalOpen, setUpdateRoleModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    const { toastMessage } = useToastMessage();
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();

    const roleColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "role-name" }) }
        ]
    }

    const { roleData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            roleData: masterPaginationReducer[masterPaginationServices.role].data,
            loading: masterPaginationReducer[masterPaginationServices.role].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = roleData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.role, params));
    }

    
    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        {/* <TableEditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateRoleModalOpen(true);
                        }}
                        /> */}

                        <DeleteButton
                            onDelete={() => onDeleteData(modelItems[tableMeta.rowIndex])}
                        />
                        <TablePermissionButton
                            tooltipLabel="Permission"
                            onClick={() => {
                                handlePermissionClick(modelItems[tableMeta.rowIndex]);
                            }}
                        />
                    </TableButtonGroup>
                )
            }
        }
    }

    function handlePermissionClick(dataRow:any){
        history.push('role-permission', { ...dataRow });
    }

    function onDeleteData(data: any) {
        const parms = {
            roleId: data.id
        }
        setDeleteLoading(true);
        services.deleteRole(parms)
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
        <>
            <Box className="table-container">
                <CustomTable
                    columns={[columnAction, ...roleColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Role List"
                    toolbar={<TableCreateButton onClick={() => setCreateRoleModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createRoleModalOpen && (
                <CreateRoleModal
                    closeModal={() => setCreateRoleModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateRoleModalOpen && (
                <UpdateRoleModal
                    closeModal={() => setUpdateRoleModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}