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
import CreateBlockTypeModal from "./CreateBlockTypeModal";
import UpdateBlockTypeModal from "./UpdateBlockTypeModal";

export default function BlockTYpe() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createBlockTypeModalOpen, setCreateBlockTypeModalOpen] = useState(false);
    const [updateBlockTypeModalOpen, setUpdateBlockTypeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const blockTypeColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "block-type" }), type: filterTypes.text }
        ]
    }

    const { blockTypeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            blockTypeData: masterPaginationReducer[masterPaginationServices.blockType].data,
            loading: masterPaginationReducer[masterPaginationServices.blockType].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = blockTypeData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.blockType, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            blockTypeId: data.id
        }
        setDeleteLoading(true);
        services.deleteBlockType(parms)
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
                            setUpdateBlockTypeModalOpen(true);
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
                    columns={[columnAction, ...blockTypeColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Block Type List"
                    toolbar={<TableCreateButton onClick={() => setCreateBlockTypeModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createBlockTypeModalOpen && (
                <CreateBlockTypeModal
                    closeModal={() => setCreateBlockTypeModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateBlockTypeModalOpen && (
                <UpdateBlockTypeModal
                    closeModal={() => setUpdateBlockTypeModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}