import { useEffect, useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import { filterTypes } from 'utils/constants/default';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import CreateCityModal from "./CreateCityModal";
import UpdateCityModal from "./UpdateCityModal";

export default function City() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createCityModalOpen, setCreateCityModalOpen] = useState(false);
    const [updateCityModalOpen, setUpdateCityModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { formatMessage } = useIntl();
    const { toastMessage } = useContext<any>(RootContext);
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const cityColumns = (formatMessage: any) => [
        { name: 'name', label: formatMessage({ id: "city" }), type: filterTypes.text },
        { name: 'provinceName', label: formatMessage({ id: "state" }) },
        { name: 'provinceCountryName', label: formatMessage({ id: "country" }) },
    ]

    const { cityData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            cityData: masterPaginationReducer[masterPaginationServices.city].data,
            loading: masterPaginationReducer[masterPaginationServices.city].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.city, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            cityId: data.id
        }
        setDeleteLoading(true);
        services.deleteCity(parms)
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

    const { modelItems, totalRecord } = cityData;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateCityModalOpen(true);
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
                    columns={[columnAction, ...cityColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="City List"
                    toolbar={<TableCreateButton onClick={() => setCreateCityModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createCityModalOpen && (
                <CreateCityModal
                    closeModal={() => setCreateCityModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateCityModalOpen && (
                <UpdateCityModal
                    closeModal={() => setUpdateCityModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}