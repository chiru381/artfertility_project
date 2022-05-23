import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import { filterTypes } from 'utils/constants/default';
import { services } from 'utils/services';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import CreateResultTemplateModal from "./CreateResultTemplateModal";
import UpdateResultTemplateModal from "./UpdateResultTemplateModal";
import { useToastMessage } from 'utils/hooks';

export default function ResultTemplate() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createResultTemplateModalOpen, setCreateResultTemplateModalOpen] = useState(false);
    const [updateResultTemplateModalOpen, setUpdateResultTemplateModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { componentData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            componentData: masterPaginationReducer[masterPaginationServices.component].data
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.component, {}));
    }, []);

    const { resultTemplateData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            resultTemplateData: masterPaginationReducer[masterPaginationServices.resultTemplate].data,
            loading: masterPaginationReducer[masterPaginationServices.resultTemplate].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.resultTemplate, params));
    }

    let componentOptions = componentData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    const resultTemplateColumns = () => [
        { name: 'name', label: formatMessage({ id: "template-name" }), type: filterTypes.text },
        {
            name: 'componentName', label: formatMessage({ id: "component" }),
            type: filterTypes.select,
            selectOptions: componentOptions ?? [],
            hideGlobalSearchFilter: true,
            primaryColumnName: "Component.Name",
        },
        { name: 'template', label: formatMessage({ id: "template-content" }), type: filterTypes.text },
    ]
    
    function onDeleteData(data: any) {
        const parms = {
            resultTemplateId: data.id
        }
        setDeleteLoading(true);
        services.deleteResultTemplate(parms)
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

    const { modelItems, totalRecord } = resultTemplateData;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateResultTemplateModalOpen(true);
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
                    columns={[columnAction, ...resultTemplateColumns()]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Result Template List"
                    toolbar={<TableCreateButton onClick={() => setCreateResultTemplateModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createResultTemplateModalOpen && (
                <CreateResultTemplateModal
                    closeModal={() => setCreateResultTemplateModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateResultTemplateModalOpen && (
                <UpdateResultTemplateModal
                    closeModal={() => setUpdateResultTemplateModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}