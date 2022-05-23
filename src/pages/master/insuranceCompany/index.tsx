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
import CreateInsuranceCompanyModal from "./CreateInsuranceCompanyModal";
import UpdateInsuranceCompanyModal from "./UpdateInsuranceCompanyModal";

export default function InsuranceCompany() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createInsuranceCompanyModalOpen, setCreateInsuranceCompanyModalOpen] = useState(false);
    const [updateInsuranceCompanyModalOpen, setUpdateInsuranceCompanyModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const insuranceCompanyColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "compnay-name" }), type: filterTypes.text },
            { name: 'address', label: formatMessage({ id: "address" }), type: filterTypes.text },
            { name: 'code', label: formatMessage({ id: "code" }), type: filterTypes.text },
            { name: 'telephone', label: formatMessage({ id: "telephone" }), type: filterTypes.text }
        ]
    }

    const { insuranceCompanyData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            insuranceCompanyData: {modelItems: [], totalRecord: 0},
            loading: false
            // insuranceCompanyData: masterPaginationReducer[masterPaginationServices.insuranceCompany].data,
            // loading: masterPaginationReducer[masterPaginationServices.insuranceCompany].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = insuranceCompanyData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        // dispatch(getMasterPaginationData(masterPaginationServices.insuranceCompany, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            insuranceCompanyId: data.id
        }
        // setDeleteLoading(true);
        // services.deleteInsuranceCompany(parms)
        //     .then((res) => {
        //         setDeleteLoading(false);
        //         if (res.data?.succeeded) {
        //             onApiCall();
        //             toastMessage(formatMessage({ id: "delete-message" }));
        //         } else {
        //             toastMessage(res.data?.message, 'error');
        //         }
        //     })
        //     .catch((err) => {
        //         setDeleteLoading(false);
        //         toastMessage(err.message, 'error');
        //     })
    }

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateInsuranceCompanyModalOpen(true);
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
                    columns={[columnAction, ...insuranceCompanyColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Insurance Company"
                    toolbar={<TableCreateButton onClick={() => setCreateInsuranceCompanyModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createInsuranceCompanyModalOpen && (
                <CreateInsuranceCompanyModal
                    closeModal={() => setCreateInsuranceCompanyModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateInsuranceCompanyModalOpen && (
                <UpdateInsuranceCompanyModal
                    closeModal={() => setUpdateInsuranceCompanyModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}