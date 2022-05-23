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
import CreateOccupationModal from "./CreateOccupationModal";
import UpdateOccupationModal from "./UpdateOccupationModal";

export default function Occupation() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createOccupationModalOpen, setCreateOccupationModalOpen] = useState(false);
    const [updateOccupationModalOpen, setUpdateOccupationModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const occupationColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "occupation" }), type: filterTypes.text }
        ]
    }

    const { occupationData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            occupationData: masterPaginationReducer[masterPaginationServices.occupation].data,
            loading: masterPaginationReducer[masterPaginationServices.occupation].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = occupationData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.occupation, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            occupationId: data.id
        }
        setDeleteLoading(true);
        services.deleteOccupation(parms)
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
                            setUpdateOccupationModalOpen(true);
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
                    columns={[columnAction, ...occupationColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Occupation"
                    toolbar={<TableCreateButton onClick={() => setCreateOccupationModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createOccupationModalOpen && (
                <CreateOccupationModal
                    closeModal={() => setCreateOccupationModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateOccupationModalOpen && (
                <UpdateOccupationModal
                    closeModal={() => setUpdateOccupationModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}