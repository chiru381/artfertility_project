import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { Select } from 'components/forms';
import { TableButtonGroup, TableDispatchButton } from 'components/button';
import { tableInitialState, masterPaginationServices, sampleDispatchColumns, testReportStatus } from 'utils/constants';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import { useToastMessage } from 'utils/hooks';
import { services } from 'utils/services';
import { HoverLoader } from 'components';

export default function SampleDispatch() {
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [tableState, setTableState] = useState(tableInitialState);

    const { testOrderData, clinicData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            testOrderData: masterPaginationReducer[masterPaginationServices.testOrderDispatch].data,
            clinicData: masterPaginationReducer[masterPaginationServices.clinic].data,
            loading: masterPaginationReducer[masterPaginationServices.testOrderDispatch].loading,
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.clinic, {}));
    }, []);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.testOrderDispatch, params));
    }


    let clinicOptions = clinicData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    let tableRows = testOrderData.modelItems?.map((item: any) => ({
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
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableDispatchButton
                            tooltipLabel="Dispatch"
                            onClick={() => {
                                // if (!tableRows[tableMeta.rowIndex]?.dispatchClinicId) {
                                handleDispatchClick(tableRows[tableMeta.rowIndex])
                                // }
                            }}
                            className={tableRows[tableMeta.rowIndex]?.dispatchClinicId ? "disable-image" : ""}
                        />
                    </TableButtonGroup>
                )
            },
            sort: false
        },
        hideGlobalSearchFilter: true
    }

    let columns = [
        {
            name: 'dispatchLocationName',
            label: formatMessage({ id: "dispatch-location" }),
            options: {
                customBodyRender: (_: any, tableMeta: any) => {
                    return (
                        <TableButtonGroup>
                            {tableRows[tableMeta.rowIndex]?.dispatchClinicId > 0 ?
                                <>{tableRows[tableMeta.rowIndex]?.dispatchClinicName}</>
                                :
                                <Select
                                    options={clinicOptions}
                                    label={formatMessage({ id: "clinic-name" })}
                                    onChange={(_, data: any) => {
                                        tableRows = tableRows.map((item: any, index: any) => ({
                                            ...item,
                                            dispatchClinicName: tableMeta.rowIndex === index ? data?.label : item.dispatchClinicName,
                                            dispatchClinicId: tableMeta.rowIndex === index ? data?.value : item.dispatchClinicId
                                        }))
                                    }}
                                    defaultValue={tableRows[tableMeta.rowIndex]?.dispatchClinicId > 0 ? { label: tableRows[tableMeta.rowIndex]?.dispatchClinicName, value: tableRows[tableMeta.rowIndex]?.dispatchClinicId } : []}
                                />
                            }
                        </TableButtonGroup>
                    )
                },
                sort: false
            },
            hideGlobalSearchFilter: true
        },
        ...sampleDispatchColumns(formatMessage)
    ]

    function handleDispatchClick(data: any) {
        let bodyData = {
            id: data.id,
            dispatchClinicId: data.dispatchClinicId,
            TestStatusId: testReportStatus.SampleDispatched
        }

        if (bodyData.dispatchClinicId) {
            setSubmitLoading(true);
            services.updateSampleDispatch(bodyData)
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
    }

    return (
        <>
            <Box className="table-container">
                <CustomTable
                    columns={tableRows?.length ? [columnAction, ...columns] : [...columns]}
                    tableData={tableRows}
                    rowsCount={totalRecord}
                    tableState={tableState}
                    setTableState={setTableState}
                    title="Sample Dispatch"
                    loading={loading}
                />
            </Box>
            {submitLoading && <HoverLoader />}
        </>
    )
}
