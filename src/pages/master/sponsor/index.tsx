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
import CreateSponsorModal from "./CreateSponsorModal";
import UpdateSponsorModal from "./UpdateSponsorModal";

export default function Sponsor() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createSponsorModalOpen, setCreateSponsorModalOpen] = useState(false);
    const [updateSponsorModalOpen, setUpdateSponsorModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const sponsorColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "sponsor-name" }), type: filterTypes.text },
            { name: 'primarySponsorCode', label: formatMessage({ id: "primary-sponsor-code" }), type: filterTypes.text },
            { name: 'secondarySponsorCode', label: formatMessage({ id: "secondary-sponsor-code" }), type: filterTypes.text },
            { name: 'address', label: formatMessage({ id: "billing-address" }), type: filterTypes.text },
            { name: 'telephone', label: formatMessage({ id: "Contact " }), type: filterTypes.text },
            { name: 'email', label: formatMessage({ id: "contact-email" }), type: filterTypes.text },    
            { name: 'creditLimit', label: formatMessage({ id: "credit-limit-in-days" }), type: filterTypes.text },
            { name: 'validFrom', label: formatMessage({ id: "validity-from" }), type: filterTypes.text },
            { name: 'validTo', label: formatMessage({ id: "validity-to" }), type: filterTypes.text }
        ]
    }

    const { sponsorData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            sponsorData: masterPaginationReducer[masterPaginationServices.sponsor].data,
            loading: masterPaginationReducer[masterPaginationServices.sponsor].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = sponsorData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.sponsor, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            sponsorId: data.id
        }
        setDeleteLoading(true);
        services.deleteSponsor(parms)
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

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton
                            onClick={() => {
                                setSelectedRow(modelItems[tableMeta.rowIndex])
                                setUpdateSponsorModalOpen(true)
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
                    columns={[columnAction, ...sponsorColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Sponsor"
                    toolbar={<TableCreateButton onClick={() => setCreateSponsorModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createSponsorModalOpen && (
                <CreateSponsorModal
                    closeModal={() => setCreateSponsorModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateSponsorModalOpen && (
                <UpdateSponsorModal
                    closeModal={() => setUpdateSponsorModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}