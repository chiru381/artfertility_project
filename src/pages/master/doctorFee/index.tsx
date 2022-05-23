import { useEffect, useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton,  TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices, doctorfeeColumns } from 'utils/constants';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import CreateDoctorFeeModal from './CreateDoctorFeeModal';
import UpdateDoctorFeeModal from './UpdateDoctorFeeModal';

export default function DoctorFee(){
    const { formatMessage } = useIntl();
    const { toastMessage } = useContext<any>(RootContext);
    const dispatch = useDispatch();

    const [tableState, setTableState] = useState(tableInitialState);
    const [createDoctorFeeModalOpen, setCreateDoctorFeeModalOpen] = useState(false);
    const [updateDoctorFeeModalOpen, setUpdateDoctorFeeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { doctorFeeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            doctorFeeData: masterPaginationReducer[masterPaginationServices.doctorFee].data,
            loading: masterPaginationReducer[masterPaginationServices.doctorFee].loading
        }),
        shallowEqual
    );

    useEffect(()=>{
        onApiCall();
    },[tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.doctorFee, params));
    }
    
    function onDeleteData(data: any) {
        const parms = {
            doctorFeeId: data.id
        }
        setDeleteLoading(true);
        services.deleteDoctorFee(parms)
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

    const { modelItems, totalRecord } = doctorFeeData;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                            <TableEditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateDoctorFeeModalOpen(true);
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
                    columns={[columnAction, ...doctorfeeColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Doctor Fee List"
                    toolbar={<TableCreateButton onClick={() => setCreateDoctorFeeModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createDoctorFeeModalOpen && (
                <CreateDoctorFeeModal
                    closeModal={() => setCreateDoctorFeeModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateDoctorFeeModalOpen && (
                <UpdateDoctorFeeModal
                    closeModal={() => setUpdateDoctorFeeModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}