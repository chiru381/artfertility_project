import { useEffect, useState } from 'react'
import { useIntl } from "react-intl";
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Receipt from '@material-ui/icons/Receipt';

import CustomTable from 'components/table';
import { billsColumn, masterPaginationServices, tableInitialState } from 'utils/constants';
import { TableButtonGroup, TableCreateButton, TableEditButton, TableRefundButton } from 'components/button';

import { RootReducerState } from 'utils/types';
import { getTableParams } from 'utils/global';
import { getMasterPaginationData } from 'redux/actions';
import { getBillingLookup } from 'redux/actions/billingLookupAction';

import OPBillRefundModal from './OPBillRefundModal';
import CreateOPBillModal from './CreateOPBillModal';
import UpdateOPBillModal from './UpdateOPBillModal';

interface Props {

}


const OPBillsList = (props: Props) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [tableState, setTableState] = useState(tableInitialState);
    const [selectedOPBill, setSelectedOPBill] = useState(null);

    const [createOPBillModalOpen, setCreateOPBillModalOpen] = useState(false);
    const [updateOPBillModalOpen, setUpdateOPBillModalOpen] = useState(false);
    const [opBillRefundModalOpen, setOPBillRefundModalOpen] = useState(false);

    const { billData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            billData: masterPaginationReducer[masterPaginationServices.bills].data,
            loading: masterPaginationReducer[masterPaginationServices.bills].loading
        }),
        shallowEqual
    );
    const { modelItems, totalRecord } = billData;
    const tableRows = modelItems.map((items: any) => {
        let partner = items?.patientWifeCouples?.[0];
        return ({
            ...items,
            partnerName: partner?.husbandPatientFullNameWithTitle ?? '-',
            partnerUHID: partner?.husbandPatientUHID ?? '-'
        })
    })

    useEffect(() => {
        dispatch(getBillingLookup());
    }, []);

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall() {
        const params = getTableParams(tableState);
        dispatch(getMasterPaginationData(masterPaginationServices.bills, params));
    }

    function refreshApi(isRefresh: boolean = true) {
        if (isRefresh && tableInitialState !== tableState) {
            setTableState(tableInitialState);
        } else {
            onApiCall();
        }
    }

    function onCreate() {
        setCreateOPBillModalOpen(true);
    }

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton
                            onClick={() => {
                                setUpdateOPBillModalOpen(true);
                                setSelectedOPBill(modelItems[tableMeta.rowIndex]);
                            }}
                            tooltipLabel="Edit"
                        />

                        {modelItems[tableMeta.rowIndex]?.billType === 1 && (
                            <TableRefundButton
                                onClick={() => {
                                    setOPBillRefundModalOpen(true);
                                    setSelectedOPBill(modelItems[tableMeta.rowIndex]);
                                }}
                                tooltipLabel="Refund"
                            />
                        )}
                    </TableButtonGroup>
                )
            }
        }
    }

    return (
        <>
            <Box className="table-container">
                <CustomTable
                    columns={[columnAction, ...billsColumn(formatMessage)]}
                    tableData={tableRows}
                    tableState={tableState}
                    setTableState={setTableState}
                    title="Patient BILLS List"
                    rowsCount={totalRecord}
                    toolbar={<TableCreateButton
                        onClick={onCreate}
                        label="Create Bill"
                        endIcon={<Receipt color="primary" style={{fontSize: "20px"}}/>}
                    />}
                    loading={loading}
                />
            </Box>

            {createOPBillModalOpen && (
                <CreateOPBillModal
                    closeModal={() => setCreateOPBillModalOpen(false)}
                    onApiCall={refreshApi}
                />
            )}

            {updateOPBillModalOpen && (
                <UpdateOPBillModal
                    closeModal={() => {
                        setSelectedOPBill(null);
                        setUpdateOPBillModalOpen(false)
                    }}
                    selectedBill={selectedOPBill}
                    onApiCall={() => refreshApi(false)}
                />
            )}
                

            {opBillRefundModalOpen && (
                <OPBillRefundModal
                    closeModal={() => {
                        setOPBillRefundModalOpen(false);
                        setSelectedOPBill(null);
                    }}
                    selectedBill={selectedOPBill}
                />
            )}
        </>
    )
}

export default OPBillsList;