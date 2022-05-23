import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import { filterTypes } from 'utils/constants/default';
import { services } from 'utils/services';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import CreateSampleStatusModal from "./CreateSampleStatusModal";
import UpdateSampleStatusModal from "./UpdateSampleStatusModal";
import { useToastMessage } from 'utils/hooks';

export default function SampleStatus() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createSampleStatusModalOpen, setCreateSampleStatusModalOpen] = useState(false);
    const [updateSampleStatusModalOpen, setUpdateSampleStatusModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const sampleStatusColumns = () => [
        { name: 'name', label: formatMessage({ id: "sample-status-name" }), type: filterTypes.text },
        {
            name: 'colorCode', label: formatMessage({ id: "color-code" }),
            options: {
                customBodyRender: (value: string) => {
                    return <Chip label={value} style={{ backgroundColor: value }} />
                }
            },
            type: filterTypes.text
        }
    ]

    const { sampleStatusData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            sampleStatusData: masterPaginationReducer[masterPaginationServices.sampleStatus].data,
            loading: masterPaginationReducer[masterPaginationServices.sampleStatus].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.sampleStatus, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            sampleStatusId: data.id
        }
        setDeleteLoading(true);
        services.deleteSampleStatus(parms)
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

    const { modelItems, totalRecord } = sampleStatusData;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateSampleStatusModalOpen(true);
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
                    columns={[columnAction, ...sampleStatusColumns()]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Sample Status List"
                    toolbar={<TableCreateButton onClick={() => setCreateSampleStatusModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createSampleStatusModalOpen && (
                <CreateSampleStatusModal
                    closeModal={() => setCreateSampleStatusModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateSampleStatusModalOpen && (
                <UpdateSampleStatusModal
                    closeModal={() => setUpdateSampleStatusModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}