import { useState, useEffect } from 'react'
import { useIntl } from "react-intl";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';

import CustomTable from 'components/table';
import CreatePackageModal from './CreatePackageModal';
import PackageDepositModal from './PackageDepositModal';
import PackageFolioModal from './PackageFolioModal';
import PackageSettlementModal from './PackageSettlementModal';
import PackageCancellationModal from './PackageCancellationModal';

import { images, packageAllocationColumn, tableIconStyle, tableInitialState } from 'utils/constants';
import { CustomTableButton, TableButtonGroup, TableCreateButton, TableEditButton } from 'components/button';
import { RootReducerState } from 'utils/types';
import { masterPaginationServices } from 'utils/constants';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { getBillingLookup } from 'redux/actions/billingLookupAction';

interface Props {

}


const PackageAllocation = (props: Props) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [tableState, setTableState] = useState(tableInitialState);
    const [selectedPackageBill, setSelectedPackageBill] = useState<any>(null);

    const [createPackageModalOpen, setCreatePackageModalOpen] = useState(false);
    const [editPackageModalOpen, setEditPackageModalOpen] = useState(false);
    const [packageDepositModalOpen, setPackageDepositModalOpen] = useState(false);
    const [packageFolioModalOpen, setPackageFolioModalOpen] = useState(false);
    const [packageSettlementModalOpen, setPackageSettlementModalOpen] = useState(false);
    const [packageCancellationModalOpen, setPackageCancellationModalOpen] = useState(false);

    const { packageBillData, packageBillDataLoading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => {
            return ({
                packageBillData: masterPaginationReducer[masterPaginationServices.packageBill].data,
                packageBillDataLoading: masterPaginationReducer[masterPaginationServices.packageBill].loading,
            })
        },
        shallowEqual
    );
    const { modelItems, totalRecord } = packageBillData;

    useEffect(() => {
        dispatch(getBillingLookup());
    }, []);

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall() {
        const params = getTableParams(tableState);
        dispatch(getMasterPaginationData(masterPaginationServices.packageBill, params));
    }

    function onCreate() {
        setCreatePackageModalOpen(true);
    }

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                const { isPackageCancel, isPackageSettled } = modelItems[tableMeta.rowIndex];
                let hideAction = isPackageCancel || isPackageSettled;

                return (
                    <TableButtonGroup>
                        <TableEditButton
                            tooltipLabel="Edit"
                            onClick={() => {
                                setEditPackageModalOpen(true);
                                setSelectedPackageBill(modelItems[tableMeta.rowIndex]);
                            }}
                        />

                        {!hideAction && <CustomTableButton
                            tooltipLabel="Package Deposit"
                            onClick={() => {
                                setPackageDepositModalOpen(true);
                                setSelectedPackageBill(modelItems[tableMeta.rowIndex]);
                            }}
                        >
                            <img src={images.packageIcon} style={tableIconStyle} alt="package-deposit" />
                        </CustomTableButton>}

                        {!hideAction && <CustomTableButton
                            tooltipLabel="Package Folio"
                            onClick={() => {
                                setPackageFolioModalOpen(true);
                                setSelectedPackageBill(modelItems[tableMeta.rowIndex]);
                            }}
                        >
                            <img src={images.portfolioIcon} style={tableIconStyle} alt="package-folio" />
                        </CustomTableButton>}

                        {!hideAction && <CustomTableButton
                            tooltipLabel="Settle Package"
                            onClick={() => {
                                setPackageSettlementModalOpen(true);
                                setSelectedPackageBill(modelItems[tableMeta.rowIndex]);
                            }}
                        >
                            <img src={images.partnershipIcon} style={tableIconStyle} alt="settle-package" />
                        </CustomTableButton>}

                        {!hideAction && <CustomTableButton
                            tooltipLabel="Cancel Package"
                            onClick={() => {
                                setPackageCancellationModalOpen(true);
                                setSelectedPackageBill(modelItems[tableMeta.rowIndex]);
                            }}
                        >
                            <img src={images.businessIcon} style={tableIconStyle} alt="cancel-package" />
                        </CustomTableButton>}
                    </TableButtonGroup>
                )
            }
        }
    }

    return (
        <>
            <Box className="table-container">
                <CustomTable
                    columns={[columnAction, ...packageAllocationColumn(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    setTableState={setTableState}
                    title="Package Allocation"
                    rowsCount={totalRecord}
                    toolbar={<TableCreateButton
                        onClick={onCreate}
                        label="Assign"
                    />}
                    loading={packageBillDataLoading}
                />
            </Box>

            {createPackageModalOpen && (
                <CreatePackageModal
                    closeModal={() => setCreatePackageModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {editPackageModalOpen && (
                <CreatePackageModal
                    closeModal={() => {
                        setEditPackageModalOpen(false);
                        setSelectedPackageBill(null);
                    }}
                    selectedPackageBill={selectedPackageBill}
                    onApiCall={onApiCall}
                />
            )}

            {packageDepositModalOpen && (
                <PackageDepositModal
                    closeModal={() => {
                        setPackageDepositModalOpen(false);
                        setSelectedPackageBill(null);
                    }}
                    selectedPackageBill={selectedPackageBill}
                />
            )}

            {packageFolioModalOpen && (
                <PackageFolioModal
                    closeModal={() => {
                        setPackageFolioModalOpen(false);
                        setSelectedPackageBill(null);
                    }}
                    selectedPackageBill={selectedPackageBill}
                />
            )}

            {packageSettlementModalOpen && (
                <PackageSettlementModal
                    closeModal={() => {
                        setPackageSettlementModalOpen(false);
                        setSelectedPackageBill(null);
                    }}
                    selectedPackageBill={selectedPackageBill}
                    onApiCall={onApiCall}
                />
            )}

            {packageCancellationModalOpen && (
                <PackageCancellationModal
                    closeModal={() => {
                        setPackageCancellationModalOpen(false);
                        setSelectedPackageBill(null);
                    }}
                    selectedPackageBill={selectedPackageBill}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}

export default PackageAllocation;