import { useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getMasterPaginationData } from 'redux/actions';
import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, serviceCategoryColumns, masterPaginationServices } from 'utils/constants';
import CreateServiceCategoryModal from "./CreateServiceCategoryModal";
import UpdateServiceCategoryModal from "./UpdateServiceCategoryModal";
import { RootReducerState } from 'utils/types';
import { getTableParams } from 'utils/global';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';


export default function ServiceCategory() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createServiceCategoryModalOpen, setCreateServiceCategoryModalOpen] = useState(false);
    const [updateServiceCategoryModalOpen, setUpdateServiceCategoryModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { serviceCategoryData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            serviceCategoryData: masterPaginationReducer[masterPaginationServices.serviceCategory].data,
            loading: masterPaginationReducer[masterPaginationServices.serviceCategory].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = serviceCategoryData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.serviceCategory, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            serviceCategoryId: data.id
        }
        setDeleteLoading(true);
        services.deleteServiceCategory(parms)
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
                            setUpdateServiceCategoryModalOpen(true);
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
                    columns={[columnAction, ...serviceCategoryColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Service Category"
                    toolbar={<TableCreateButton onClick={() => setCreateServiceCategoryModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createServiceCategoryModalOpen && (
                <CreateServiceCategoryModal
                    closeModal={() => setCreateServiceCategoryModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateServiceCategoryModalOpen && (
                <UpdateServiceCategoryModal
                    closeModal={() => setUpdateServiceCategoryModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}


        </>
    )
}