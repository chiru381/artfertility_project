import { useEffect, useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, EditButton, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices, packageColumns } from 'utils/constants';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import CreatePackageModal from './CreatePackageModal';
import UpdatePackageModal from './UpdatePackageModal';

export default function Package() {
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [createPackageModalOpen, setCreatePackageModalOpen] = useState(false);
    const [updatePackageModalOpen, setUpdatePackageModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [tableState, setTableState] = useState(tableInitialState);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { packageData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            packageData: masterPaginationReducer[masterPaginationServices.package].data,
            loading: masterPaginationReducer[masterPaginationServices.package].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    useEffect(() => {
        //FORM DROPDOWN SERVICES
        dispatch(getMasterPaginationData(masterPaginationServices.stage, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.service, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.merchant, {}));
    }, []);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.package, params));
    }

    function onDeleteData(data: any) {
        const params = {
            packageId: data.id
        }
        setDeleteLoading(true);
        services.deletePackage(params)
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

    const { modelItems, totalRecord } = packageData;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <div style={{ display: "flex" }}>
                        <EditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdatePackageModalOpen(true);
                        }}
                        />

                        <DeleteButton
                            onDelete={() => onDeleteData(modelItems[tableMeta.rowIndex])}
                        />
                    </div>
                )
            }
        }
    }
    return (
        <>
            <Box className="table-container">
                <CustomTable
                    columns={[columnAction, ...packageColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Package List"
                    toolbar={<TableCreateButton onClick={() => setCreatePackageModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createPackageModalOpen && (
                <CreatePackageModal
                    closeModal={() => setCreatePackageModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updatePackageModalOpen && (
                <UpdatePackageModal
                    closeModal={() => setUpdatePackageModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}