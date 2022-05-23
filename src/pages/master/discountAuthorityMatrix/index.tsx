import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useIntl } from "react-intl";
import Box from '@material-ui/core/Box';

import CustomTable from "components/table";
import { TableCreateButton, TableButtonGroup, TableEditButton, DeleteButton } from "components/button";
import { getMasterPaginationData } from "redux/actions";
import { getTableParams } from "utils/global";
import { services } from "utils/services";
import { tableInitialState, masterPaginationServices, discountAuthorityMatrixColumns } from "utils/constants";
import { RootReducerState } from "utils/types";
import RootContext from "utils/context/RootContext";
import CreateDiscountAuthorityMatrix from './CreateDiscountAuthorityMatrixModal';
import UpdateDiscountAuthorityMatrix from './UpdateDiscountAuthorityMatrixModal';

export default function DiscountAuthorityMatrix() {
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [createDiscountAuthorityMatrixModalOpen, setCreateDiscountAuthorityMatrixModalOpen] = useState(false);
    const [updateDiscountAuthorityMatrixModalOpen, setUpdateDiscountAuthorityMatrixModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [tableState, setTableState] = useState(tableInitialState);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { discountAuthorityMatrixData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            discountAuthorityMatrixData: masterPaginationReducer[masterPaginationServices.discountAuthorityMatrix].data,
            loading: masterPaginationReducer[masterPaginationServices.discountAuthorityMatrix].loading
        }),
        shallowEqual
    );

    const { modelItems, totalRecord } = discountAuthorityMatrixData;

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.discountAuthorityMatrix, params));
    }


    function onDeleteData(data: any) {
        const parms = {
            discountAuthorityMatrixId: data.id
        }
        setDeleteLoading(true);
        services.deleteDiscountAuthorityMatrix(parms)
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

    // let columnAction = {
    //     label: "",
    //     name: "",
    //     options: {
    //         customRenderBody: (_:any, tableMeta: any) => {
    //             return (
    //                 <TableButtonGroup>
    //                     <TableEditButton
    //                         onClick={() => {
    //                             setSelectedRow(modelItems[tableMeta.rowIndex])
    //                             setUpdateDiscountAuthorityMatrixModalOpen(true)
    //                         }}
    //                     />

    //                     <DeleteButton
    //                         onDelete={() => onDeleteData(modelItems[tableMeta.rowIndex])}
    //                     />
    //                 </TableButtonGroup>
    //             )
    //         }
    //     }
    // }

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
                                setUpdateDiscountAuthorityMatrixModalOpen(true)
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
            <Box py={2} className="container">
                <CustomTable
                    columns={[columnAction, ...discountAuthorityMatrixColumns(formatMessage)]}
                    tableState={tableState}
                    tableData={modelItems}
                    setTableState={setTableState}
                    title="Discount Authrity Matrix List"
                    rowsCount={totalRecord}
                    toolbar={<TableCreateButton onClick={() => setCreateDiscountAuthorityMatrixModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createDiscountAuthorityMatrixModalOpen && (
                <CreateDiscountAuthorityMatrix
                    closeModal={() => setCreateDiscountAuthorityMatrixModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateDiscountAuthorityMatrixModalOpen && (
                <UpdateDiscountAuthorityMatrix
                    closeModal={() => setUpdateDiscountAuthorityMatrixModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}