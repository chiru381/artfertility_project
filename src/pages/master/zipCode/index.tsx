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
import CreateZipCodeModal from "./CreateZipCodeModal";
import UpdateZipCodeModal from "./UpdateZipCodeModal";

export default function ZipCode() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createZipCodeModalOpen, setCreateZipCodeModalOpen] = useState(false);
    const [updateZipCodeModalOpen, setUpdateZipCodeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const zipCodeColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "locality-name" }), type: filterTypes.text },
            { name: 'cityName', label: formatMessage({ id: "city-name" }), type: filterTypes.text }
        ]
    }

    const { zipCodeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            zipCodeData: masterPaginationReducer[masterPaginationServices.zipCode].data,
            loading: masterPaginationReducer[masterPaginationServices.zipCode].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = zipCodeData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.zipCode, params));
    }

    // function onDeleteData(data: any) {
    //    const parms = {
    //         zipCodeId: data.id
    //     }
    //     setDeleteLoading(true);
    //     services.deleteZipCode(parms)
    //         .then((res) => {
    //             setDeleteLoading(false);
    //             if (res.data?.succeeded) {
    //                 onApiCall();
    //                 toastMessage(formatMessage({ id: "delete-message" }));
    //             }else{
    //                 toastMessage(res.data?.message, 'error');
    //               }
    //         })
    //         .catch((err) => {
    //             setDeleteLoading(false);
    //             toastMessage(err.message, 'error');
    //         })
    // }

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton
                            onClick={() => {
                                setSelectedRow(modelItems[tableMeta.rowIndex]);
                                setUpdateZipCodeModalOpen(true);
                            }}
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
                    columns={[columnAction, ...zipCodeColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Locality"
                    toolbar={<TableCreateButton onClick={() => setCreateZipCodeModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createZipCodeModalOpen && (
                <CreateZipCodeModal
                    closeModal={() => setCreateZipCodeModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateZipCodeModalOpen && (
                <UpdateZipCodeModal
                    closeModal={() => setUpdateZipCodeModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}