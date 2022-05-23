import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices, labTestColumns } from 'utils/constants';
import { services } from 'utils/services';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import CreateLabTestModal from "./CreateLabTestModal";
import UpdateLabTestModal from "./UpdateLabTestModal";
import { useToastMessage } from 'utils/hooks';

export default function LabTest() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createLabTestModalOpen, setCreateLabTestModalOpen] = useState(false);
    const [updateLabTestModalOpen, setUpdateLabTestModalOpen] = useState(false);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const { toastMessage } = useToastMessage();

    const [selectedRow, setSelectedRow] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { labTestData, loading, billingServiceData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            labTestData: masterPaginationReducer[masterPaginationServices.test].data,
            loading: masterPaginationReducer[masterPaginationServices.test].loading,
            billingServiceData: masterPaginationReducer[masterPaginationServices.service].data,
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.service, {}));
    }, []);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.test, params));
    }

    let billingServiceOptions = billingServiceData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    function onDeleteData(data: any) {
        const parms = {
            testId: data.id
        }
        setDeleteLoading(true);
        services.deleteTest(parms)
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

    const { modelItems, totalRecord } = labTestData;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateLabTestModalOpen(true);
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
                    columns={[columnAction, ...labTestColumns(formatMessage, billingServiceOptions)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Lab Test List"
                    toolbar={<TableCreateButton onClick={() => setCreateLabTestModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>


            {createLabTestModalOpen && (
                <CreateLabTestModal
                    closeModal={() => setCreateLabTestModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateLabTestModalOpen && (
                <UpdateLabTestModal
                    closeModal={() => setUpdateLabTestModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}