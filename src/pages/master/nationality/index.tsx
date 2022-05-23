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
import CreateNationalityModal from "./CreateNationalityModal";
import UpdateNationalityModal from "./UpdateNationalityModal";

export default function Nationality() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createNationalityModalOpen, setCreateNationalityModalOpen] = useState(false);
    const [updateNationalityModalOpen, setUpdateNationalityModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const nationalityColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "nationality" }), type: filterTypes.text }
        ]
    }

    const { nationalityData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            nationalityData: masterPaginationReducer[masterPaginationServices.nationality].data,
            loading: masterPaginationReducer[masterPaginationServices.nationality].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = nationalityData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.nationality, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            nationalityId: data.id
        }
        setDeleteLoading(true);
        services.deleteNationality(parms)
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
                            setUpdateNationalityModalOpen(true);
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
                    columns={[columnAction, ...nationalityColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Nationality"
                    toolbar={<TableCreateButton onClick={() => setCreateNationalityModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createNationalityModalOpen && (
                <CreateNationalityModal
                    closeModal={() => setCreateNationalityModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateNationalityModalOpen && (
                <UpdateNationalityModal
                    closeModal={() => setUpdateNationalityModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}