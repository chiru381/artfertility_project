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
import CreateLanguageModal from "./CreateLanguageModal";
import UpdateLanguageModal from "./UpdateLanguageModal";

export default function Language() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createLanguageModalOpen, setCreateLanguageModalOpen] = useState(false);
    const [updateLanguageModalOpen, setUpdateLanguageModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const languageColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "language" }), type: filterTypes.text }
        ]
    }

    const { languageData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            languageData: masterPaginationReducer[masterPaginationServices.language].data,
            loading: masterPaginationReducer[masterPaginationServices.language].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = languageData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.language, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            languageId: data.id
        }
        setDeleteLoading(true);
        services.deleteLanguage(parms)
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
                            setUpdateLanguageModalOpen(true);
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
                    columns={[columnAction, ...languageColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Language"
                    toolbar={<TableCreateButton onClick={() => setCreateLanguageModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createLanguageModalOpen && (
                <CreateLanguageModal
                    closeModal={() => setCreateLanguageModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateLanguageModalOpen && (
                <UpdateLanguageModal
                    closeModal={() => setUpdateLanguageModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}