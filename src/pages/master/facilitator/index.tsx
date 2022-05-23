import { useEffect, useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, EditButton, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices, facilitatorColumns } from 'utils/constants';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import CreateFacilitatorModal from './CreateFacilitatorModal';
import UpdateFacilitatorModal from './UpdateFacilitatorModal';

export default function Facilitator(){
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [createFacilitatorModalOpen, setCreateFacilitatorModalOpen] = useState(false);
    const [updateFacilitatorModalOpen, setUpdateFacilitatorModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [tableState, setTableState] = useState(tableInitialState);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { facilitatorData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            facilitatorData: masterPaginationReducer[masterPaginationServices.facilitator].data,
            loading: masterPaginationReducer[masterPaginationServices.facilitator].loading
        }),
        shallowEqual
    );

    useEffect(()=>{
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.facilitator, params));
    }

    function onDeleteData(data: any) {
        const params = {
            facilitatorId: data.id
        }
        setDeleteLoading(true);
        services.deleteFacilitator(params)
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

    const { modelItems, totalRecord } = facilitatorData;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <div style={{ display: "flex" }}>
                        <EditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateFacilitatorModalOpen(true);
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
                    columns={[columnAction, ...facilitatorColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Facilitator List"
                    toolbar={<TableCreateButton onClick={() => setCreateFacilitatorModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createFacilitatorModalOpen && (
                <CreateFacilitatorModal
                    closeModal={() => setCreateFacilitatorModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateFacilitatorModalOpen && (
                <UpdateFacilitatorModal
                    closeModal={() => setUpdateFacilitatorModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}