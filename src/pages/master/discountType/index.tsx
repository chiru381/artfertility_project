import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useIntl } from "react-intl";
import Box from '@material-ui/core/Box';

import CustomTable from "components/table";
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from "components/button";
import { getMasterPaginationData } from "redux/actions";
import { tableInitialState, masterPaginationServices, discountTypeColumns } from "utils/constants";
import { RootReducerState } from "utils/types";
import RootContext from "utils/context/RootContext";
import { getTableParams } from "utils/global";
import { services } from "utils/services";
import CreateDiscountTypeModal from './CreateDiscountTypeModal';
import UpdateDiscountTypeModal from './UpdateDiscountTypeModal';

export default function DiscountType() {
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [createDiscountTypeModalOpen, setCreateDiscountTypeModalOpen] = useState(false);
    const [updateDiscountTypeModalOpen, setUpdateDiscountTypeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [tableState, setTableState] = useState(tableInitialState);

    const { discountTypeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState ) => ({
            discountTypeData: masterPaginationReducer[masterPaginationServices.discountType].data,
            loading: masterPaginationReducer[masterPaginationServices.discountType].loading
        }),
        shallowEqual
    );

    const { modelItems, totalRecord } = discountTypeData;

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.discountType, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            discountTypeId: data.id
        }
        setDeleteLoading(true);
        services.deleteDiscountType(parms)
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
                                setSelectedRow(modelItems[tableMeta.rowIndex])
                                setUpdateDiscountTypeModalOpen(true)
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
                columns={[columnAction, ...discountTypeColumns(formatMessage)]}
                tableState={tableState}
                tableData={modelItems}
                setTableState={setTableState}
                title="Discount Type"
                rowsCount={totalRecord}
                toolbar={<TableCreateButton onClick={() => setCreateDiscountTypeModalOpen(true)} />}
                loading={loading || deleteLoading}
            />
        </Box>

        {createDiscountTypeModalOpen && (
            <CreateDiscountTypeModal
                closeModal={() => setCreateDiscountTypeModalOpen(false)}
                onApiCall={onApiCall}
            />
        )}

        {updateDiscountTypeModalOpen && (
            <UpdateDiscountTypeModal
                closeModal={() => setUpdateDiscountTypeModalOpen(false)}
                selectedData={selectedRow}
                onApiCall={onApiCall}
            />
        )}
        </>
    )
}