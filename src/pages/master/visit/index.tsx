import { useContext, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getMasterPaginationData } from 'redux/actions';
import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, serviceCategoryColumns, masterPaginationServices } from 'utils/constants';
import CreateServiceCategoryModal from "./CreateVisitModal";
import UpdateServiceCategoryModal from "./UpdateVisitModal";
import { RootReducerState } from 'utils/types';
import { getTableParams } from 'utils/global';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';


export default function ServiceCategory() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createVisitModalOpen, setCreateVisitModalOpen] = useState(false);
    const [updateVisitModalOpen, setUpdateVistModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { visitData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            visitData: masterPaginationReducer[masterPaginationServices.visitType].data,
            loading: masterPaginationReducer[masterPaginationServices.visitType].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = visitData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.visitType, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            serviceCategoryId: data.id
        }
        setDeleteLoading(true);
        services.deleteVisitType(parms)
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
                            setUpdateVistModalOpen(true);
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
                    title="visit"
                    toolbar={<TableCreateButton onClick={() => setCreateVisitModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createVisitModalOpen && (
                <CreateServiceCategoryModal
                    closeModal={() => setCreateVisitModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateVisitModalOpen && (
                <UpdateServiceCategoryModal
                    closeModal={() => setUpdateVistModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}


        </>
    )
}