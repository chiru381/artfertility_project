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
import CreateSampleModal from "./CreateSampleModal";
import UpdateSampleModal from "./UpdateSampleModal";

export default function Sample() {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [tableState, setTableState] = useState(tableInitialState);
    const [createSampleModalOpen, setCreateSampleModalOpen] = useState(false);
    const [updateSampleModalOpen, setUpdateSampleModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);

    const sampleColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "sample-name" }), type: filterTypes.text }
        ]
    }

    const { sampleData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            sampleData: masterPaginationReducer[masterPaginationServices.sample].data,
            loading: masterPaginationReducer[masterPaginationServices.sample].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = sampleData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.sample, params));
    }


    function onDeleteData(data: any) {
        const parms = {
            sampleId: data.id
        }
        setDeleteLoading(true);
        services.deleteSample(parms)
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
                            setUpdateSampleModalOpen(true);
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
                    columns={[columnAction, ...sampleColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Sample List"
                    toolbar={<TableCreateButton onClick={() => setCreateSampleModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createSampleModalOpen && (
                <CreateSampleModal
                    closeModal={() => setCreateSampleModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateSampleModalOpen && (
                <UpdateSampleModal
                    closeModal={() => setUpdateSampleModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}