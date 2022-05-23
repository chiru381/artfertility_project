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
import CreateContactTypeModal from "./CreateContactTypeModal";
import UpdateContactTypeModal from "./UpdateContactTypeModal";

export default function Occupation() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createContactTypeModalOpen, setCreateContactTypeModalOpen] = useState(false);
    const [updateContactTypeModalOpen, setUpdateContactTypeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const contactTypeColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "contact-type" }), type: filterTypes.text }
        ]
    }

    const { contactTypeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            contactTypeData: masterPaginationReducer[masterPaginationServices.contactType].data,
            loading: masterPaginationReducer[masterPaginationServices.contactType].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = contactTypeData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.contactType, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            contactTypeId: data.id
        }
        setDeleteLoading(true);
        services.deleteContactType(parms)
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
                            setUpdateContactTypeModalOpen(true);
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
                    columns={[columnAction, ...contactTypeColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Contact Type"
                    toolbar={<TableCreateButton onClick={() => setCreateContactTypeModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createContactTypeModalOpen && (
                <CreateContactTypeModal
                    closeModal={() => setCreateContactTypeModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateContactTypeModalOpen && (
                <UpdateContactTypeModal
                    closeModal={() => setUpdateContactTypeModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}