import { useState, useEffect } from 'react';
import { useIntl } from "react-intl";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';

import CustomTable from 'components/table';
import { Select } from 'components/forms';
import { images, masterPaginationServices, refundListColumn, refundTypeList, tableIconStyle, tableInitialState } from 'utils/constants';
import { CustomTableButton, TableButtonGroup } from 'components/button';
import { RootReducerState } from 'utils/types';
import { getTableParams } from 'utils/global';
import { getMasterPaginationData } from 'redux/actions';

import VerifyOPBillRefundModal from './VerifyOPBillRefundModal';
import VerifyInPatientPackageCancelModal from './VerifyInPatientPackageCancelModal';
import VerifiyOPRefundDepositModal from './VerifiyOPRefundDepositModal';

interface Props {

}


const PackageAllocation = (props: Props) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [tableState, setTableState] = useState(tableInitialState);
    const [refundType, setRefundType] = useState<any>(refundTypeList[0]);
    const [refundModalOpen, setRefundModalOpen] = useState(false);

    const [selectedRefundRow, setSelectedRefundRow] = useState<any>(null);

    const { refundApprovalListData, refundApprovalListLoading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            refundApprovalListData: masterPaginationReducer[masterPaginationServices.refundApprovalList].data,
            refundApprovalListLoading: masterPaginationReducer[masterPaginationServices.refundApprovalList].loading
        }),
        shallowEqual
    );
    let loading = refundApprovalListLoading;

    let tableRows = refundApprovalListData.modelItems;
    let tableRecords = refundApprovalListData.totalRecord;
    let refundTypeColumn = refundListColumn;

    useEffect(() => {
        onRefundTypeApiCall();
    }, [tableState, refundType]);

    function onRefundTypeApiCall() {
        const params = {
            refundType: +refundType.value,
            ...getTableParams(tableState)
        };
        dispatch(getMasterPaginationData(masterPaginationServices.refundApprovalList, params));
    }

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                let row = tableRows[tableMeta.rowIndex];
                let enableButton = row?.refundStatus === 1;
                return (
                    <TableButtonGroup>

                        {enableButton && <CustomTableButton
                            // tooltipLabel={rowData[tableMeta.rowIndex].refundType}
                            onClick={() => {
                                setRefundModalOpen(true);
                                setSelectedRefundRow(tableRows[tableMeta.rowIndex]);
                            }}
                        >
                            <img src={images.refundIcon} style={tableIconStyle} alt="refund" />
                        </CustomTableButton>}
                    </TableButtonGroup>
                )
            }
        }
    }

    function RefundTypeSelection() {
        return (
            <div className="asdasd">
                <Select
                    options={refundTypeList}
                    value={refundType}
                    onChange={(_, data) => onChangeRefundType(data)}
                    disableClearable
                    style={{ width: "200px", marginLeft: "15px", height: "35px !important" }}
                />
            </div>
        )
    }

    function onChangeRefundType(refundType: any) {
        setRefundType(refundType);
        setTableState(tableInitialState);
    }

    return (
        <>
            <Box className="table-container">
                <CustomTable
                    columns={[columnAction, ...refundTypeColumn(formatMessage)]}
                    tableData={tableRows}
                    tableState={tableState}
                    setTableState={setTableState}
                    title="Refund List"
                    rowsCount={tableRecords}
                    loading={loading}
                    toolbar={<RefundTypeSelection />}
                />
            </Box>

            {(refundType?.value === "1" && refundModalOpen) && (
                <VerifiyOPRefundDepositModal
                    closeModal={() => setRefundModalOpen(false)}
                    selectedRow={selectedRefundRow}
                    onApiCall={onRefundTypeApiCall}
                />
            )}
            {(refundType?.value === "2" && refundModalOpen) && (
                <VerifyOPBillRefundModal
                    closeModal={() => setRefundModalOpen(false)}
                    selectedRow={selectedRefundRow}
                    onApiCall={onRefundTypeApiCall}
                />
            )}
            {(refundType?.value === "3" && refundModalOpen) && (
                <VerifyInPatientPackageCancelModal
                    closeModal={() => setRefundModalOpen(false)}
                    selectedRow={selectedRefundRow}
                    onApiCall={onRefundTypeApiCall}
                />
            )}
        </>
    )
}

export default PackageAllocation;