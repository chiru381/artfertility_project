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
import CreateBedStatusModal from "./CreateBedStatusModal";
import UpdateBedStatusModal from "./UpdateBedStatusModal";
import { useToastMessage } from 'utils/hooks';

export default function BedStatus() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createBedStatusModalOpen, setCreateBedStatusModalOpen] = useState(false);
    const [updateBedStatusModalOpen, setUpdateBedStatusModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const bedStatusColumns = () => [
        { name: 'name', label: formatMessage({ id: "bed-status-name" }), type: filterTypes.text },
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

    const { bedStatusData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            bedStatusData: masterPaginationReducer[masterPaginationServices.bedStatus].data,
            loading: masterPaginationReducer[masterPaginationServices.bedStatus].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.bedStatus, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            bedStatusId: data.id
        }
        setDeleteLoading(true);
        services.deleteBedStatus(parms)
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

    const { modelItems, totalRecord } = bedStatusData;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateBedStatusModalOpen(true);
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
                    columns={[columnAction, ...bedStatusColumns()]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Bed Status List"
                    toolbar={<TableCreateButton onClick={() => setCreateBedStatusModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createBedStatusModalOpen && (
                <CreateBedStatusModal
                    closeModal={() => setCreateBedStatusModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateBedStatusModalOpen && (
                <UpdateBedStatusModal
                    closeModal={() => setUpdateBedStatusModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}