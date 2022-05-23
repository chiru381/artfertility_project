import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getMasterPaginationData } from 'redux/actions';
import { useToastMessage } from 'utils/hooks';

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import CreateDocumentTypeModal from "./CreateDocumentTypeModal";
import UpdateDocumentTypeModal from "./UpdateDocumentTypeModal";
import { RootReducerState } from 'utils/types';
import { getTableParams } from 'utils/global';
import { services } from 'utils/services';


export default function DocumentType() {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [tableState, setTableState] = useState(tableInitialState);
    const [createDocumentTypeOpen, setCreateDocumentTypeOpen] = useState(false);
    const [updateDocumentTypeOpen, setUpdateDocumentTypeOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { toastMessage } = useToastMessage();

    const { documentTypeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            documentTypeData: masterPaginationReducer[masterPaginationServices.documentType].data,
            loading: masterPaginationReducer[masterPaginationServices.documentType].loading
        }),
        shallowEqual
    );
    let tableData = documentTypeData.modelItems;

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.documentType, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            documentTypeId: data.id
        }
        setDeleteLoading(true);
        services.deleteDocumentType(parms)
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


    let columns = [
        {
            label: "",
            name: "",
            options: {
                customBodyRender: (_: any, tableMeta: any) => {
                    return (
                        <TableButtonGroup>
                            <TableEditButton
                                onClick={() => {
                                    setSelectedRow(tableData[tableMeta.rowIndex]);
                                    setUpdateDocumentTypeOpen(true);
                                }}
                            />

                            <DeleteButton
                                onDelete={() => onDeleteData(tableData[tableMeta.rowIndex])}
                            />
                        </TableButtonGroup>
                    )
                }
            }
        },
        { name: 'name', label: formatMessage({ id: "document-type-name" }) },
        { name: 'maskFormat', label: formatMessage({ id: "maskformat-name" }) }
    ]


    return (
        <>
            <Box className="table-container">
                <CustomTable
                    columns={columns}
                    tableData={tableData}
                    tableState={tableState}
                    setTableState={setTableState}
                    title="Document Type List"
                    toolbar={<TableCreateButton onClick={() => setCreateDocumentTypeOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createDocumentTypeOpen && (
                <CreateDocumentTypeModal
                    closeModal={() => setCreateDocumentTypeOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateDocumentTypeOpen && (
                <UpdateDocumentTypeModal
                    closeModal={() => setUpdateDocumentTypeOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}