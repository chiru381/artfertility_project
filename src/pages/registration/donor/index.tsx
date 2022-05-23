import { useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, DeleteButton, TableEditButton, TableButtonGroup } from 'components/button';
import { tableInitialState, donorColumns, masterPaginationServices } from 'utils/constants';
import { getTableParams } from 'utils/global';
import { getMasterPaginationData, getPatientLookup } from 'redux/actions';
import { RootReducerState } from 'utils/types';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import CreateDonor from './CreateDonor';

interface Props {

}


const Index = (props: Props) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const { toastMessage } = useContext<any>(RootContext);
    const [createDonorModalOpen, setCreateDonorModalOpen] = useState(false);
    const [updateDonorModalOpen, setUpdateDonorModalOpen] = useState(false);
    const [selectedDonorId, setSelectedDonorId] = useState("");

    const [deleteLoading, setDeleteLoading] = useState(false);
    const [tableState, setTableState] = useState(tableInitialState);


    const { donorData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            donorData: masterPaginationReducer[masterPaginationServices.donor].data,
            loading: masterPaginationReducer[masterPaginationServices.donor].loading
        }),
        shallowEqual
    );

    let tableData = donorData.modelItems.map((items: any) => ({
        ...items,
        donorName: `${items.firstName} ${items.middleName ? `${items.middleName} ` : ""}${items.lastName}`
    }));

    useEffect(() => {
        dispatch(getPatientLookup());
    }, []);

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(tableState);
        dispatch(getMasterPaginationData(masterPaginationServices.donor, params));
    }

    function onCreate() {
        setCreateDonorModalOpen(true);
    }

    function onEdit(rowData: any) {
        let donorId = rowData.id;
        setSelectedDonorId(donorId);
        setUpdateDonorModalOpen(true);
    }

    function onDeleteData(data: any) {
        const parms = {
            donorId: data.id
        }
        setDeleteLoading(true);
        services.deleteDonor(parms)
            .then((res) => {
                setDeleteLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "delete-message" }));
                } else {
                    toastMessage(res.data.message, 'error');
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
                        <TableEditButton
                            tooltipLabel="Edit Donor"
                            onClick={() => {
                                onEdit(tableData[tableMeta.rowIndex]);
                            }}
                        />

                        <DeleteButton
                            onDelete={() => onDeleteData(tableData[tableMeta.rowIndex])}
                        />
                    </TableButtonGroup>
                )
            }
        }
    }

    return (
        <Box className="table-container">
            <CustomTable
                columns={[columnAction, ...donorColumns(formatMessage)]}
                tableData={tableData}
                tableState={tableState}
                setTableState={setTableState}
                title="Donor List"
                toolbar={<TableCreateButton onClick={onCreate} />}
                loading={loading || deleteLoading}
                rowsCount={donorData.totalRecord}
            />

            {createDonorModalOpen && <CreateDonor
                closeModal={() => setCreateDonorModalOpen(false)}
                onApiCall={onApiCall}
            />}


            {updateDonorModalOpen && <CreateDonor
                closeModal={() => setUpdateDonorModalOpen(false)}
                onApiCall={onApiCall}
                isUpdateModal={true}
                donorId={selectedDonorId}
            />}
        </Box>
    )
}

export default Index;