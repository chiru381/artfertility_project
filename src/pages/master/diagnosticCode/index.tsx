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
import CreateDiagnosticCodeModal from "./CreateDiagnosticCodeModal";
import UpdateDiagnosticCodeModal from "./UpdateDiagnosticCodeModal";

export default function Department() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createDiagnosticCodeModalOpen, setCreateDiagnosticCodeModalOpen] = useState(false);
    const [updateDiagnosticCodeModalOpen, setUpdateDiagnosticCodeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const diagnosticCodeColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "icd-code-name" }), type: filterTypes.text },
            {
                name: 'icdDescriptionName', label: formatMessage({ id: "icd-description-name" }),
                hideGlobalSearchFilter: true, type: filterTypes.text
            },
            {
                name: 'genderApplicability', label: formatMessage({ id: "gender-applicability" }),
                options: {
                    customBodyRender: (value: string) => {
                        return <span>{value ? "Yes" : "No"}</span>
                    }
                },
                hideGlobalSearchFilter: true,
                type: filterTypes.boolean,
                selectOptions: [{ label: "Yes", value: "true" }, { label: "No", value: "false" }]
            }
        ]
    }

    const { diagnosticCodeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            diagnosticCodeData: masterPaginationReducer[masterPaginationServices.diagnosticCode].data,
            loading: masterPaginationReducer[masterPaginationServices.diagnosticCode].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { totalRecord } = diagnosticCodeData;

    const tableRow = diagnosticCodeData.modelItems?.map((item: any) => ({
        ...item,
        isParent: item?.parentDepartmentId === null ? true : false
    }))

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.diagnosticCode, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            departmentId: data.id
        }
        setDeleteLoading(true);
        services.deleteDiagnosisCode(parms)
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
                            setSelectedRow(tableRow[tableMeta.rowIndex]);
                            setUpdateDiagnosticCodeModalOpen(true);
                        }}
                        />

                        <DeleteButton
                            onDelete={() => onDeleteData(tableRow[tableMeta.rowIndex])}
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
                    columns={[columnAction, ...diagnosticCodeColumns(formatMessage)]}
                    tableData={tableRow}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Diagnostic Code List"
                    toolbar={<TableCreateButton onClick={() => setCreateDiagnosticCodeModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createDiagnosticCodeModalOpen && (
                <CreateDiagnosticCodeModal
                    closeModal={() => setCreateDiagnosticCodeModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateDiagnosticCodeModalOpen && (
                <UpdateDiagnosticCodeModal
                    closeModal={() => setUpdateDiagnosticCodeModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}