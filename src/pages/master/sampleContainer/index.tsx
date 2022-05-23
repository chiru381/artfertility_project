import { useEffect, useState } from 'react';
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
import { filterTypes } from 'utils/constants/default';
import { useToastMessage } from 'utils/hooks';
import CreateSampleContainerModal from "./CreateSampleContainerModal";
import UpdateSampleContainerModal from "./UpdateSampleContainerModal";

export default function SampleContainer() {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [tableState, setTableState] = useState(tableInitialState);
    const [createSampleContainerModalOpen, setCreateSampleContainerModalOpen] = useState(false);
    const [updateSampleContainerModalOpen, setUpdateSampleContainerModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);

    const sampleContainerColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "sample-container-name" }), type: filterTypes.text }
        ]
    }

    const { sampleContainerData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            sampleContainerData: masterPaginationReducer[masterPaginationServices.sampleContainer].data,
            loading: masterPaginationReducer[masterPaginationServices.sampleContainer].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = sampleContainerData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.sampleContainer, params));
    }


    function onDeleteData(data: any) {
        const parms = {
            sampleContainerId: data.id
        }
        setDeleteLoading(true);
        services.deleteSampleContainer(parms)
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
                            setUpdateSampleContainerModalOpen(true);
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
                    columns={[columnAction, ...sampleContainerColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Sample Container List"
                    toolbar={<TableCreateButton onClick={() => setCreateSampleContainerModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createSampleContainerModalOpen && (
                <CreateSampleContainerModal
                    closeModal={() => setCreateSampleContainerModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateSampleContainerModalOpen && (
                <UpdateSampleContainerModal
                    closeModal={() => setUpdateSampleContainerModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}