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
import CreateReligionModal from "./CreateReligionModal";
import UpdateReligionModal from "./UpdateReligionModal";

export default function Religion() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createReligionModalOpen, setCreateReligionModalOpen] = useState(false);
    const [updateReligionModalOpen, setUpdateReligionModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const religionColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "religion" }), type: filterTypes.text }
        ]
    }

    const { religionData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            religionData: masterPaginationReducer[masterPaginationServices.religion].data,
            loading: masterPaginationReducer[masterPaginationServices.religion].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = religionData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.religion, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            religionId: data.id
        }
        setDeleteLoading(true);
        services.deleteReligion(parms)
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
                            setUpdateReligionModalOpen(true);
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
                    columns={[columnAction, ...religionColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Religion"
                    toolbar={<TableCreateButton onClick={() => setCreateReligionModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createReligionModalOpen && (
                <CreateReligionModal
                    closeModal={() => setCreateReligionModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateReligionModalOpen && (
                <UpdateReligionModal
                    closeModal={() => setUpdateReligionModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}