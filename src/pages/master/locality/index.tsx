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
import CreateLocalityModal from "./CreateLocalityModal";
import UpdateLocalityModal from "./UpdateLocalityModal";

export default function Locality() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createLocalityModalOpen, setCreateLocalityModalOpen] = useState(false);
    const [updateLocalityModalOpen, setUpdateLocalityModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const localityColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "locality-name" }), type: filterTypes.text },
            { name: 'cityName', label: formatMessage({ id: "city-name" }), type: filterTypes.text },
            { name: 'cityProvinceName', label: formatMessage({ id: "province-name" }), type: filterTypes.text },
            { name: 'cityProvinceCountryName', label: formatMessage({ id: "province-country" }), type: filterTypes.text },
        ]
    }

    const { localityData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            localityData: masterPaginationReducer[masterPaginationServices.locality].data,
            loading: masterPaginationReducer[masterPaginationServices.locality].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = localityData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.locality, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            localityId: data.id
        }
        setDeleteLoading(true);
        services.deleteLocality(parms)
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
                            setUpdateLocalityModalOpen(true);
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
                    columns={[columnAction, ...localityColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Locality"
                    toolbar={<TableCreateButton onClick={() => setCreateLocalityModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createLocalityModalOpen && (
                <CreateLocalityModal
                    closeModal={() => setCreateLocalityModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateLocalityModalOpen && (
                <UpdateLocalityModal
                    closeModal={() => setUpdateLocalityModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />          
            )}
        </>
    )
}