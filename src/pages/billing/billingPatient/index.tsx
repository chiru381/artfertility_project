import { useEffect, useState } from 'react';
import { useIntl } from "react-intl";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';

import CustomTable from 'components/table';
import { TableButtonGroup, CustomTableButton } from 'components/button';
import { RootReducerState } from 'utils/types';
import { tableInitialState, patientColumns, masterPaginationServices, images, tableIconStyle } from 'utils/constants';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { getBillingLookup } from 'redux/actions/billingLookupAction';

import CreatePackageModal from '../packageAllocation/CreatePackageModal';
import OPDepositModal from './OPDepositModal';
import OPRefundDepositModal from './OPRefundDepositModal';
import CreateOPBillModal from '../OutPatientBill/CreateOPBillModal';
import { useToastMessage } from 'utils/hooks';


interface Props {

}


const BillingPatientList = (props: Props) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const { toastMessage } = useToastMessage();

    const [tableState, setTableState] = useState(tableInitialState);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    const [createOPBillModalOpen, setCreateOPBillModalOpen] = useState(false);
    const [opRefundDepositModalOpen, setOPRefundDepositModalOpen] = useState(false);
    const [OPRefundDepositModalOpen, setOPRefundDepositModalOPen] = useState(false);
    const [packageAllocationModalOpen, setPackageAllocationModalOpen] = useState(false);


    const { patientData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            patientData: masterPaginationReducer[masterPaginationServices.wifeWithPartner].data,
            loading: masterPaginationReducer[masterPaginationServices.wifeWithPartner].loading
        }),
        shallowEqual
    );

    const { modelItems, totalRecord } = patientData;
    const tableRows = modelItems.map((items: any) => ({
        ...items,
        partnerName: items?.wifeCouples?.length ? items?.wifeCouples?.[0]?.husbandPatientFirstName + " " + items?.wifeCouples?.[0]?.husbandPatientLastName : '-',
        partnerUHID: items?.wifeCouples?.[0]?.husbandPatientUHID ?? '-'
    }));

    useEffect(() => {
        dispatch(getBillingLookup());
    }, []);

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall() {
        const params = getTableParams(tableState);
        dispatch(getMasterPaginationData(masterPaginationServices.wifeWithPartner, params));
    }

    function checkTransactionBlock(data: any) {
        if (data?.isBlocked) {
            toastMessage("Patient is blocked for transaction.", "error");
            return false;
        } else {
            return true;
        }
    }



    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <CustomTableButton
                            tooltipLabel="Pending Orders"
                            onClick={() => {
                                if (checkTransactionBlock(modelItems[tableMeta.rowIndex])) {
                                    setSelectedPatient(modelItems[tableMeta.rowIndex]);
                                    setCreateOPBillModalOpen(true);
                                }
                            }}
                        >
                            <img src={images.boxIcon} style={tableIconStyle} alt="pending-orders" />
                        </CustomTableButton>
                        <CustomTableButton
                            tooltipLabel="OP Deposit"
                            onClick={() => {
                                if (checkTransactionBlock(modelItems[tableMeta.rowIndex])) {
                                    setSelectedPatient(modelItems[tableMeta.rowIndex]);
                                    setOPRefundDepositModalOpen(true);
                                }
                            }}
                        >
                            <img src={images.depositIcon} style={tableIconStyle} alt="op-deposit" />
                        </CustomTableButton>
                        <CustomTableButton
                            tooltipLabel="OP Refund Deposit Request"
                            onClick={() => {
                                if (checkTransactionBlock(modelItems[tableMeta.rowIndex])) {
                                    setSelectedPatient(modelItems[tableMeta.rowIndex]);
                                    setOPRefundDepositModalOPen(true);
                                }
                            }}
                        >
                            <img src={images.refundDepositIcon} style={tableIconStyle} alt="op-refund-deposit" />
                        </CustomTableButton>
                        <CustomTableButton
                            tooltipLabel="Package Allocation"
                            onClick={() => {
                                if (checkTransactionBlock(modelItems[tableMeta.rowIndex])) {
                                    setSelectedPatient(modelItems[tableMeta.rowIndex]);
                                    setPackageAllocationModalOpen(true);
                                }
                            }}
                        >
                            <img src={images.locationPackageIcon} style={tableIconStyle} alt="package-allocation" />
                        </CustomTableButton>
                    </TableButtonGroup>
                )
            }
        }
    }

    return (
        <>
            <Box className="table-container">
                <CustomTable
                    columns={[columnAction, ...patientColumns(formatMessage)]}
                    tableData={tableRows}
                    tableState={tableState}
                    setTableState={setTableState}
                    title="Patient List"
                    rowsCount={totalRecord}
                    loading={loading}
                />
            </Box>

            {createOPBillModalOpen && (
                <CreateOPBillModal
                    closeModal={() => setCreateOPBillModalOpen(false)}
                    patientId={selectedPatient.id}
                />
            )}
            {opRefundDepositModalOpen && (
                <OPDepositModal
                    closeModal={() => setOPRefundDepositModalOpen(false)}
                    patientId={selectedPatient.id}
                />
            )}
            {OPRefundDepositModalOpen && (
                <OPRefundDepositModal
                    closeModal={() => setOPRefundDepositModalOPen(false)}
                    patientId={selectedPatient.id}
                />
            )}
            {packageAllocationModalOpen && (
                <CreatePackageModal
                    closeModal={() => setPackageAllocationModalOpen(false)}
                    patientId={selectedPatient.id}
                />
            )}
        </>
    )
}

export default BillingPatientList;