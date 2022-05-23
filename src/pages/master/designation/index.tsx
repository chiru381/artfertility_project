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
import CreateDesignationModal from "./CreateDesignationModal";
import UpdateDesignationModal from "./UpdateDesignationModal";

export default function Designation() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createDesignationModalOpen, setCreateDesignationModalOpen] = useState(false);
    const [updateDesignationModalOpen, setUpdateDesignationModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const designationColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "designation-name" }), type: filterTypes.text }
        ]
    }

    const { designationData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            designationData: masterPaginationReducer[masterPaginationServices.designation].data,
            loading: masterPaginationReducer[masterPaginationServices.designation].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = designationData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.designation, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            DesignationId: data.id
        }
        setDeleteLoading(true);
        services.deleteDesignation(parms)
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
                            setUpdateDesignationModalOpen(true);
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
                    columns={[columnAction, ...designationColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Designation List"
                    toolbar={<TableCreateButton onClick={() => setCreateDesignationModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createDesignationModalOpen && (
                <CreateDesignationModal
                    closeModal={() => setCreateDesignationModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateDesignationModalOpen && (
                <UpdateDesignationModal
                    closeModal={() => setUpdateDesignationModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}