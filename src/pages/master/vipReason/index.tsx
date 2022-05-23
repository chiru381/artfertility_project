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
import CreateVipReasonModal from "./CreateVipReasonModal";
import UpdateVipReasonModal from "./UpdateVipReasonModal";

export default function Occupation() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createVipReasonModalOpen, setCreateVipReasonModalOpen] = useState(false);
    const [updateVipReasonModalOpen, setUpdateVipReasonModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const vipReasonColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "vip-reason" }), type: filterTypes.text }
        ]
    }

    const { vipReasonData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            vipReasonData: masterPaginationReducer[masterPaginationServices.vipReason].data,
            loading: masterPaginationReducer[masterPaginationServices.vipReason].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = vipReasonData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.vipReason, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            vipReasonId: data.id
        }
        setDeleteLoading(true);
        services.deleteVipReason(parms)
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
                            setUpdateVipReasonModalOpen(true);
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
                    columns={[columnAction, ...vipReasonColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="VIP Reason"
                    toolbar={<TableCreateButton onClick={() => setCreateVipReasonModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createVipReasonModalOpen && (
                <CreateVipReasonModal
                    closeModal={() => setCreateVipReasonModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateVipReasonModalOpen && (
                <UpdateVipReasonModal
                    closeModal={() => setUpdateVipReasonModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}