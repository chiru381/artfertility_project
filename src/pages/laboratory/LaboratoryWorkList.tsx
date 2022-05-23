import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useIntl } from "react-intl";
import { useHistory } from 'react-router-dom';

import CustomTable from 'components/table';
import { CheckBox } from 'components/forms';
import { TableButtonGroup, TableReSamplingButton, TableEditButton, TableResultEntryButton, TableAuthorizationButton, ButtonGroup, PrimaryButton } from 'components/button';
import { tableInitialState, masterPaginationServices, laboratoryWorklistColumns, testReportStatus } from 'utils/constants';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import { useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { HoverLoader } from 'components';
import ReSamplingModal from './ReSamplingModal';
import { ReactComponent as LikeIcon } from 'assets/images/icons/like-icon.svg';

export default function LaboratoryWorkList() {
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [tableState, setTableState] = useState(tableInitialState);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [selectedIds, setSelectedIds] = useState<any>([]);
    const [reSamplingConfirmationModalOpen, setReSamplingConfirmationModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});

    const history = useHistory();

    const { testOrderData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            testOrderData: masterPaginationReducer[masterPaginationServices.testOrderAcknowledge].data,
            loading: masterPaginationReducer[masterPaginationServices.testOrderAcknowledge].loading,
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.testOrderAcknowledge, params));
    }

    let tableRow = testOrderData.modelItems?.map((item: any) => ({
        ...item,
        partnerUHID: item.testOrderPatientGenderName?.toLowerCase() === "male" ? item?.testOrderCoupleWifePatientUHID : item?.testOrderCoupleHusbandPatientUHID,
        partnerName: item.testOrderPatientGenderName?.toLowerCase() === "male" ? item?.testOrderCoupleWifeFullName : item?.testOrderCoupleHusbandFullName,
        isSelected: false
    }));

    const { totalRecord } = testOrderData;

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
                                        isSelected: true
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
                        />
                        <TableEditButton
                            tooltipLabel="Edit"
                            onClick={() => handleEditRowClick(tableRow[tableMeta.rowIndex])}
                        />
                        <TableAuthorizationButton
                            tooltipLabel="Result Entry"
                            onClick={() => handleResultEntryClick(tableRow[tableMeta.rowIndex])}
                        />
                        <TableResultEntryButton
                            tooltipLabel="Result Authorization"
                            onClick={() => handleResultAuthorizationClick(tableRow[tableMeta.rowIndex])}
                        />
                        <TableReSamplingButton
                            tooltipLabel="Re-Sampling"
                            onClick={() => {
                                setSelectedRow(tableRow[tableMeta.rowIndex]);
                                setReSamplingConfirmationModalOpen(true);
                            }}
                        />
                    </TableButtonGroup>
                )
            },
            sort: false
        },
        hideGlobalSearchFilter: true,
    }

    function handleEditRowClick(dataRow: any) {
        history.push('result-entry', { ...dataRow, IsUpdate: true, IsAuthorization: false });
    }

    function handleResultEntryClick(dataRow: any) {
        history.push('result-entry', { ...dataRow, IsUpdate: false, IsAuthorization: false });
    }

    function handleResultAuthorizationClick(dataRow: any) {
        history.push('result-entry', { ...dataRow, IsUpdate: false, IsAuthorization: true });
    }

    function handleAchnowledgementClick(data: any) {
        if (selectedIds?.length > 0) {

            let bodyData = {
                testStatusId: testReportStatus.SampleAcknowledged,
                testOrderDetailIds: selectedIds
            }

            setSubmitLoading(true);
            services.updateSampleAcknowledge(bodyData)
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

    return (
        <>
            <Box className="table-container">
                <CustomTable
                    columns={tableRow?.length ? [columnAction, ...laboratoryWorklistColumns(formatMessage)] : [...laboratoryWorklistColumns(formatMessage)]}
                    tableData={tableRow}
                    rowsCount={totalRecord}
                    tableState={tableState}
                    setTableState={setTableState}
                    title="Laboratory List"
                    toolbar={
                        <ButtonGroup>
                            <PrimaryButton
                                label={formatMessage({ id: "acknowledge" })}
                                endIcon={<LikeIcon style={{ objectFit: "cover" }} fill="rgba(0, 0, 0, 0.54)" />}
                                onClick={handleAchnowledgementClick}
                                disabled={selectedIds?.length > 0 ? false : true}
                            />
                        </ButtonGroup>
                    }
                    loading={loading}
                />
            </Box>
            {submitLoading && <HoverLoader />}

            {reSamplingConfirmationModalOpen && (
                <ReSamplingModal
                    closeModal={() => setReSamplingConfirmationModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}