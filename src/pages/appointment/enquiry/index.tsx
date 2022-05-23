import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { getAppointmentLookup, getMasterPaginationData } from 'redux/actions';
import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup } from 'components/button';
import { tableInitialState, masterPaginationServices, filterOperators, enquiryColumns } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { getTableParams } from 'utils/global';
import CreateEnquiryModal from "./CreateEnquiryModal";
import UpdateEnquiryModal from "./UpdateEnquiryModal";

export default function Enquiry() {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [tableState, setTableState] = useState(tableInitialState);
    const [createEnquiryModalOpen, setCreateEnquiryModalOpen] = useState(false);
    const [updateEnquiryModalOpen, setUpdateEnquiryModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});

    const { appointmentData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            appointmentData: masterPaginationReducer[masterPaginationServices.appointment].data,
            loading: masterPaginationReducer[masterPaginationServices.appointment].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = appointmentData;

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.leadSource, {}));
        dispatch(getAppointmentLookup());
    }, []);

    function onApiCall(withState: boolean = true) {
        const tableParams = getTableParams(tableState);

        let params = {
            ...tableParams,
            customFilters: [
                ...tableParams?.customFilters ?? [],
                {
                    member: "appointmentCallTypeId",
                    value: "1",
                    operator: filterOperators.isEqualTo
                }
            ]
        };

        dispatch(getMasterPaginationData(masterPaginationServices.appointment, params));
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
                                setSelectedRow(modelItems[tableMeta.rowIndex]);
                                setUpdateEnquiryModalOpen(true);
                            }}
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
                    columns={[columnAction, ...enquiryColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title={formatMessage({ id: "enquiry" })}
                    toolbar={<TableCreateButton onClick={() => setCreateEnquiryModalOpen(true)} />}
                    loading={loading}
                />
            </Box>

            {createEnquiryModalOpen && (
                <CreateEnquiryModal
                    closeModal={() => setCreateEnquiryModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateEnquiryModalOpen && (
                <UpdateEnquiryModal
                    closeModal={() => setUpdateEnquiryModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}