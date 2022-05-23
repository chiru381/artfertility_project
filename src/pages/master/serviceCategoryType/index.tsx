import { useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getMasterPaginationData } from 'redux/actions';
import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, serviceCategoryTypeColumns, masterPaginationServices } from 'utils/constants';
import CreateServiceCategoryTypeModal from "./CreateServiceCategoryTypeModal";
import UpdateServiceCategoryTypeModal from "./UpdateServiceCategoryTypeModal";
import { RootReducerState } from 'utils/types';
import { getTableParams } from 'utils/global';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';


export default function ServiceCategory() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createServiceCategoryTypeModalOpen, setCreateServiceCategoryTypeModalOpen] = useState(false);
    const [updateServiceCategoryTypeModalOpen, setUpdateServiceCategoryTypeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { serviceCategoryTypeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            serviceCategoryTypeData: masterPaginationReducer[masterPaginationServices.serviceCategoryType].data,
            loading: masterPaginationReducer[masterPaginationServices.serviceCategoryType].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = serviceCategoryTypeData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.serviceCategoryType, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            serviceCategoryId: data.id
        }
        setDeleteLoading(true);
        services.deleteServiceCategoryType(parms)
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
                        <TableEditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateServiceCategoryTypeModalOpen(true);
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
                    columns={[columnAction, ...serviceCategoryTypeColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Service Category Type"
                    toolbar={<TableCreateButton onClick={() => setCreateServiceCategoryTypeModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createServiceCategoryTypeModalOpen && (
                <CreateServiceCategoryTypeModal
                    closeModal={() => setCreateServiceCategoryTypeModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateServiceCategoryTypeModalOpen && (
                <UpdateServiceCategoryTypeModal
                    closeModal={() => setUpdateServiceCategoryTypeModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}


        </>
    )
}