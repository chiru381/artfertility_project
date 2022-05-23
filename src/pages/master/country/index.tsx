import { useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { getMasterPaginationData } from 'redux/actions';
import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, countryColumns, masterPaginationServices } from 'utils/constants';
import CreateCountryModal from "./CreateCountryModal";
import UpdateCountryModal from "./UpdateCountryModal";
import { RootReducerState } from 'utils/types';
import { getTableParams } from 'utils/global';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';


export default function Country() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createCountryModalOpen, setCreateCountryModalOpen] = useState(false);
    const [updateCountryModalOpen, setUpdateCountryModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { countryData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            countryData: masterPaginationReducer[masterPaginationServices.country].data,
            loading: masterPaginationReducer[masterPaginationServices.country].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = countryData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(tableState);
        dispatch(getMasterPaginationData(masterPaginationServices.country, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            countryId: data.id
        }
        setDeleteLoading(true);
        services.deleteCountry(parms)
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
                            setUpdateCountryModalOpen(true);
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
                    columns={[columnAction, ...countryColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Country List"
                    toolbar={<TableCreateButton onClick={() => setCreateCountryModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createCountryModalOpen && <CreateCountryModal
                closeModal={() => setCreateCountryModalOpen(false)}
                onApiCall={onApiCall}
            />}

            {updateCountryModalOpen && <UpdateCountryModal
                closeModal={() => setUpdateCountryModalOpen(false)}
                selectedData={selectedRow}
                onApiCall={onApiCall}
            />}
        </>
    )
}