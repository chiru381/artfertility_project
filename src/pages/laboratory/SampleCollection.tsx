import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { CheckBox } from 'components/forms';
import { TableButtonGroup, ButtonGroup, PrimaryButton } from 'components/button';
import { tableInitialState, masterPaginationServices, sampleCollectionColumns, testReportStatus } from 'utils/constants';
import { getMasterPaginationData } from 'redux/actions';
import { HoverLoader } from 'components';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import { useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { ReactComponent as TestTubeIcon } from 'assets/images/icons/test-tube-icon.svg';
import { ReactComponent as BarCodeIcon } from 'assets/images/icons/barcode-icon.svg';

export default function SampleCollection() {
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [tableState, setTableState] = useState(tableInitialState);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [selectedIds, setSelectedIds] = useState<any>([]);

    const { testOrderData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            testOrderData: masterPaginationReducer[masterPaginationServices.testOrder].data,
            loading: masterPaginationReducer[masterPaginationServices.testOrder].loading,
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.testOrder, params));
    }

    let tableRow = testOrderData.modelItems?.map((item: any) => ({
        ...item,
        partnerUHID: item.testOrderPatientGenderName?.toLowerCase() === "male" ? item?.testOrderCoupleWifePatientUHID : item?.testOrderCoupleHusbandPatientUHID,
        partnerName: item.testOrderPatientGenderName?.toLowerCase() === "male" ? item?.testOrderCoupleWifeFullName : item?.testOrderCoupleHusbandFullName,
        isSelected: false
    }));

    const { totalRecord } = tableRow;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customHeadLabelRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <CheckBox
                            label=""
                            onChange={(e: any) => {
                                if (e.target.checked) {
                                    tableRow = tableRow.map((item: any) => ({
                                        ...item,
                                        isSelected: item.labNumber ? false : true
                                    }));
                                    setIsSelectAll(true);
                                }
                                else {
                                    tableRow = tableRow.map((item: any) => ({
                                        ...item,
                                        isSelected: false
                                    }));
                                    setIsSelectAll(false);
                                }
                                const record = tableRow?.filter((item: any) => item.isSelected == true)?.map((item: any) => { return item.id });
                                setSelectedIds(record);
                            }}
                            name="isSelectedAll"
                            size="small"
                            checked={isSelectAll}
                        />
                    </TableButtonGroup>
                )
            },
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <CheckBox
                            label=""
                            onChange={(e: any) => {
                                if (e.target.checked) {
                                    tableRow = tableRow.map((item: any, index: any) => ({
                                        ...item,
                                        isSelected: index === tableMeta.rowIndex ? true : item.isSelected
                                    }));
                                    setIsSelectAll(tableRow?.filter((item: any) => item.isSelected === false)?.length == 0 ? true : false)
                                }
                                else {
                                    setIsSelectAll(false);
                                    tableRow = tableRow.map((item: any, index: any) => ({
                                        ...item,
                                        isSelected: index === tableMeta.rowIndex ? false : item.isSelected
                                    }));
                                }
                                const record = tableRow?.filter((item: any) => item.isSelected === true)?.map((item: any) => { return item.id });
                                setSelectedIds(record);
                            }}
                            name={`data[${tableMeta.rowIndex}][isSelected]}`}
                            size="small"
                            disabled={tableRow[tableMeta.rowIndex].labNumber ? true : false}
                        />
                    </TableButtonGroup>
                )
            },
            sort: false
        },
        hideGlobalSearchFilter: true,
    }

    function handleCollectSampleClick() {
        if (selectedIds?.length > 0) {
            let bodyData = {
                testStatusId: testReportStatus.SampleCollected,
                testOrderDetailIds: selectedIds
            }
            setSubmitLoading(true);
            services.updateSampleCollection(bodyData)
                .then((res) => {
                    setSubmitLoading(false);
                    if (res.data?.succeeded) {
                        onApiCall();
                        toastMessage(formatMessage({ id: "insert-message" }));
                    } else {
                        toastMessage(res.data?.message, 'error');
                    }
                })
                .catch((err) => {
                    setSubmitLoading(false);
                    toastMessage(err.message, 'error');
                })
        }
        else {
            toastMessage(formatMessage({ id: "checkbox-selection-validation-message" }), 'error');
        }
    }

    function handlePrintBarCodeLabelClick(data: any) {

    }

    return (
        <>
            <Box className="table-container">
                <CustomTable
                    columns={tableRow?.length ? [columnAction, ...sampleCollectionColumns(formatMessage)] : [...sampleCollectionColumns(formatMessage)]}
                    tableData={tableRow}
                    rowsCount={totalRecord}
                    tableState={tableState}
                    setTableState={setTableState}
                    title="Sample Collection"
                    toolbar={
                        <ButtonGroup>
                            <PrimaryButton
                                label={formatMessage({ id: "collect-sample" })}
                                endIcon={<TestTubeIcon style={{ objectFit: "cover" }} fill="rgba(0, 0, 0, 0.54)" />}
                                onClick={handleCollectSampleClick}
                                disabled={selectedIds?.length > 0 ? false : true}
                            />
                            <PrimaryButton
                                label={formatMessage({ id: "print-bar-code-label" })}
                                endIcon={<BarCodeIcon style={{ objectFit: "cover" }} fill="rgba(0, 0, 0, 0.54)" />}
                                onClick={handlePrintBarCodeLabelClick}
                            />
                        </ButtonGroup>
                    }
                    loading={loading}

                />
            </Box>
            {submitLoading && <HoverLoader />}
        </>
    )
}
