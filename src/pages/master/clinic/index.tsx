import { useEffect, useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, clinicColumns, masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import CreateClinicModal from "./CreateClinicModal";
import UpdateClinicModal from "./UpdateClinicModal";

export default function Clinic() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createClinicModalOpen, setCreateClinicModalOpen] = useState(false);
    const [updateClinicModalOpen, setUpdateClinicModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { formatMessage } = useIntl();
    const { toastMessage } = useContext<any>(RootContext);

    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { clinicData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            clinicData: masterPaginationReducer[masterPaginationServices.clinic].data,
            loading: masterPaginationReducer[masterPaginationServices.clinic].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.clinic, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            clinicId: data.id
        }
        setDeleteLoading(true);
        services.deleteClinic(parms)
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

    const { modelItems, totalRecord } = clinicData;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateClinicModalOpen(true);
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
                    columns={[columnAction, ...clinicColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Clinic List"
                    toolbar={<TableCreateButton onClick={() => setCreateClinicModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createClinicModalOpen && (
                <CreateClinicModal
                    closeModal={() => setCreateClinicModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateClinicModalOpen && (
                <UpdateClinicModal
                    closeModal={() => setUpdateClinicModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}