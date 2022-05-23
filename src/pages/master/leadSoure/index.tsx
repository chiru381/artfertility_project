import { useContext, useEffect, useState } from 'react';
import { useIntl } from "react-intl";
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import RootContext from 'utils/context/RootContext';
import { RootReducerState } from 'utils/types';
import { services } from 'utils/services';
import { getTableParams } from 'utils/global';
import { getMasterPaginationData } from 'redux/actions';
import CustomTable from 'components/table';
import { TableCreateButton, EditButton, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import { filterTypes } from 'utils/constants/default';
import CreateLeadSourceModal from "./CreateLeadSourceModal";
import UpdateLeadSourceModal from "./UpdateLeadSourceModal";

const columns = (formatMessage: any) => [
    { name: 'name', label: formatMessage({ id: "lead-source-name" }), type: filterTypes.text },
    {
        name: 'leadSourceOrder', label: formatMessage({ id: "lead-source-order" }),
        options: {
            customBodyRender: (value: string) => {
                return <span>Lead Source {value}</span>
            }
        },
        type: filterTypes.select
    }
]


export default function LeadSource() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createLeadSourceModalOpen, setCreateLeadSourceModalOpen] = useState(false);
    const [updateLeadSourceModalOpen, setUpdateLeadSourceModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { leadSourceData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            leadSourceData: masterPaginationReducer[masterPaginationServices.leadSource].data,
            loading: masterPaginationReducer[masterPaginationServices.leadSource].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.leadSource, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            leadSourceId: data.id
        }
        setDeleteLoading(true);
        services.deleteLeadSource(parms)
            .then((res) => {
                setDeleteLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "delete-message" }));
                }
            })
            .catch((err) => {
                setDeleteLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    const { modelItems, totalRecord } = leadSourceData;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <div style={{ display: "flex" }}>
                        <EditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateLeadSourceModalOpen(true);
                        }}
                        />

                        <DeleteButton
                            onDelete={() => onDeleteData(modelItems[tableMeta.rowIndex])}
                        />
                    </div>
                )
            }
        }
    }

    return (
        <>
            <Box className="table-container">

                <CustomTable
                    columns={[columnAction, ...columns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Lead Source List"
                    toolbar={<TableCreateButton onClick={() => setCreateLeadSourceModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createLeadSourceModalOpen && (
                <CreateLeadSourceModal
                    closeModal={() => setCreateLeadSourceModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateLeadSourceModalOpen && (
                <UpdateLeadSourceModal
                    closeModal={() => setUpdateLeadSourceModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}