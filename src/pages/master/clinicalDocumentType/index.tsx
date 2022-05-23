import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getMasterPaginationData } from 'redux/actions';
import { useToastMessage } from 'utils/hooks';

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import Form from "./Form";
import { RootReducerState } from 'utils/types';
import { getTableParams } from 'utils/global';
import { services } from 'utils/services';

export default function DocumentType() {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [tableState, setTableState] = useState(tableInitialState);
    const [drawer, setDrawer] = useState(false)
    const [selectedRow, setSelectedRow] = useState({});
    const [createMode, setCreateMode] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { toastMessage } = useToastMessage();

    const { clinicalDocumentTypeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            clinicalDocumentTypeData: masterPaginationReducer[masterPaginationServices.clinicalDocumentType].data,
            loading: masterPaginationReducer[masterPaginationServices.clinicalDocumentType].loading
        }),
        shallowEqual
    );

    let tableData = clinicalDocumentTypeData.modelItems;

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.clinicalDocumentType, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            clinicalDocumentTypeId: data.id
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
                                    setDrawer(true);
                                    setCreateMode(false);
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
                    toolbar={<TableCreateButton onClick={() => {
                        setSelectedRow({});
                        setDrawer(true);
                        setCreateMode(true);
                    }} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {drawer && (
                <Form
                    closeModal={() => setDrawer(false)}
                    onApiCall={onApiCall}
                    formMode={createMode ? 'create' : 'update'}
                    selectedData={selectedRow}
                    headerText={createMode ? formatMessage({ id: "create-document-type" }) : formatMessage({ id: "update-document-type" })}
                />
            )}
        </>
    )
}