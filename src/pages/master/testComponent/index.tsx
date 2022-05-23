import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices, testComponentColumns } from 'utils/constants';
import { filterTypes } from 'utils/constants/default';
import { services } from 'utils/services';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import CreateTestComponentModal from "./CreateTestComponentModal";
import UpdateTestComponentModal from "./UpdateTestComponentModal";
import { useToastMessage } from 'utils/hooks';

export default function TestComponent() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createTestComponentModalOpen, setCreateTestComponentModalOpen] = useState(false);
    const [updateTestComponentModalOpen, setUpdateTestComponentModalOpen] = useState(false);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const { toastMessage } = useToastMessage();

    const [selectedRow, setSelectedRow] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { testComponentData, loading, sampleTypeData, unitOfMeasureData, sampleContainerData, resultValueData, departmentData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            testComponentData: masterPaginationReducer[masterPaginationServices.component].data,
            loading: masterPaginationReducer[masterPaginationServices.component].loading,
            sampleTypeData: masterPaginationReducer[masterPaginationServices.sample].data,
            unitOfMeasureData: masterPaginationReducer[masterPaginationServices.unitOfMeasure].data,
            sampleContainerData: masterPaginationReducer[masterPaginationServices.sampleContainer].data,
            resultValueData: masterPaginationReducer[masterPaginationServices.resultValue].data,
            departmentData: masterPaginationReducer[masterPaginationServices.department].data
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.sample, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.unitOfMeasure, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.sampleContainer, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.resultValue, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.department, {}));
    }, []);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.component, params));
    }

    let sampleTypeOptions = sampleTypeData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let unitOfMeasureOptions = unitOfMeasureData.modelItems?.map((option: any) => ({ label: option.uomShortName, value: option.id }));
    let sampleContainerOptions = sampleContainerData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));
    let resultValueOptions = resultValueData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    function onDeleteData(data: any) {
        const parms = {
            componentId: data.id
        }
        setDeleteLoading(true);
        services.deleteComponent(parms)
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

    const { modelItems, totalRecord } = testComponentData;

    const columns = [
        ...testComponentColumns(formatMessage),
        {
            name: 'sampleName', label: formatMessage({ id: "sample-type" }),
            type: filterTypes.select,
            selectOptions: sampleTypeOptions ?? [],
            hideGlobalSearchFilter: true,
            primaryColumnName: 'Sample.Name',
            secondaryColumnName: 'sampleId'
        },
        {
            name: 'resultValueName', label: formatMessage({ id: "result-value" }),
            type: filterTypes.select,
            selectOptions: resultValueOptions ?? [],
            hideGlobalSearchFilter: true,
            primaryColumnName: 'ResultValue.Name',
            secondaryColumnName: 'resultValueId'
        },
        {
            name: 'unitOfMeasureUOMShortName', label: formatMessage({ id: "unit-of-measurement" }),
            type: filterTypes.select,
            selectOptions: unitOfMeasureOptions ?? [],
            hideGlobalSearchFilter: true,
            primaryColumnName: 'UnitOfMeasure.UOMShortName',
            secondaryColumnName: 'unitOfMeasureId'
        },
        {
            name: 'sampleContainerName', label: formatMessage({ id: "sample-container" }),
            type: filterTypes.select,
            selectOptions: sampleContainerOptions ?? [],
            hideGlobalSearchFilter: true,
            primaryColumnName: 'SampleContainer.Name',
            secondaryColumnName: 'sampleContainerId'
        }
    ]

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateTestComponentModalOpen(true);
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
                    columns={[columnAction, ...columns]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Test Component List"
                    toolbar={<TableCreateButton onClick={() => setCreateTestComponentModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createTestComponentModalOpen && (
                <CreateTestComponentModal
                    closeModal={() => setCreateTestComponentModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateTestComponentModalOpen && (
                <UpdateTestComponentModal
                    closeModal={() => setUpdateTestComponentModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}