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
import CreateReferringDoctorModal from "./CreateReferringDoctorModal";
import UpdateReferringDoctorModal from "./UpdateReferringDoctorModal";

export default function Occupation() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createReferringDoctorModalOpen, setCreateReferringDoctorModalOpen] = useState(false);
    const [updateReferringDoctorModalOpen, setUpdateReferringDoctorModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const referringDoctorColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "referring-doctor" }), type: filterTypes.text }
        ]
    }

    const { referringDoctorData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            referringDoctorData: masterPaginationReducer[masterPaginationServices.referringDoctor].data,
            loading: masterPaginationReducer[masterPaginationServices.referringDoctor].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = referringDoctorData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.referringDoctor, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            referringDoctorId: data.id
        }
        setDeleteLoading(true);
        services.deleteReferringDoctor(parms)
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
                            setUpdateReferringDoctorModalOpen(true);
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
                    columns={[columnAction, ...referringDoctorColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Referring Doctor"
                    toolbar={<TableCreateButton onClick={() => setCreateReferringDoctorModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createReferringDoctorModalOpen && (
                <CreateReferringDoctorModal
                    closeModal={() => setCreateReferringDoctorModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateReferringDoctorModalOpen && (
                <UpdateReferringDoctorModal
                    closeModal={() => setUpdateReferringDoctorModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}