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
import CreateTitleModal from "./CreateTitleModal";
import UpdateTitleModal from "./UpdateTitleModal";

export default function Title() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createTitleModalOpen, setCreateTitleModalOpen] = useState(false);
    const [updateTitleModalOpen, setUpdateTitleModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const titleColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "title" }), type: filterTypes.text }
        ]
    }

    const { titleData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            titleData: masterPaginationReducer[masterPaginationServices.title].data,
            loading: masterPaginationReducer[masterPaginationServices.title].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = titleData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.title, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            titleId: data.id
        }
        setDeleteLoading(true);
        services.deleteTitle(parms)
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
                            setUpdateTitleModalOpen(true);
                        }}
                        />

                        {/* <DeleteButton
                            onDelete={() => onDeleteData(modelItems[tableMeta.rowIndex])}
                        /> */}
                    </TableButtonGroup>
                )
            }
        }
    }

    return (
        <>
            <Box className="table-container">
                <CustomTable
                    columns={[columnAction, ...titleColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Title"
                    toolbar={<TableCreateButton onClick={() => setCreateTitleModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createTitleModalOpen && (
                <CreateTitleModal
                    closeModal={() => setCreateTitleModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateTitleModalOpen && (
                <UpdateTitleModal
                    closeModal={() => setUpdateTitleModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}