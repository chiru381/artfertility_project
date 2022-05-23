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
import CreateGenderModal from "./CreateGenderModal";
import UpdateGenderModal from "./UpdateGenderModal";

export default function Gender() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createGenderModalOpen, setCreateGenderModalOpen] = useState(false);
    const [updateGenderModalOpen, setUpdateGenderModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const genderColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "gender" }), type: filterTypes.text }
        ]
    }

    const { genderData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            genderData: masterPaginationReducer[masterPaginationServices.gender].data,
            loading: masterPaginationReducer[masterPaginationServices.gender].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = genderData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.gender, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            genderId: data.id
        }
        setDeleteLoading(true);
        services.deleteGender(parms)
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
                            setUpdateGenderModalOpen(true);
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
                    columns={[columnAction, ...genderColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Gender"
                    toolbar={<TableCreateButton onClick={() => setCreateGenderModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createGenderModalOpen && (
                <CreateGenderModal
                    closeModal={() => setCreateGenderModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateGenderModalOpen && (
                <UpdateGenderModal
                    closeModal={() => setUpdateGenderModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}