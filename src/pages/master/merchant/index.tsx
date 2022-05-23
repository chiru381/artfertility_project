import { useEffect, useState, useContext } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import CustomTable from 'components/table';
import { TableCreateButton, EditButton, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices, merchantColumns } from 'utils/constants';
import { services } from 'utils/services';
import RootContext from 'utils/context/RootContext';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { RootReducerState } from 'utils/types';
import CreateMerchantModal from './CreateMerchantModal';
import UpdateMerchantModal from './UpdateMerchantModal';

export default function Merchant() {
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [createMerchantModalOpen, setCreateMerchantModalOpen] = useState(false);
    const [updateMerchantModalOpne, setUpdateMerchantModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [tableState, setTableState] = useState(tableInitialState);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { merchantData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            merchantData: masterPaginationReducer[masterPaginationServices.merchant].data,
            loading: masterPaginationReducer[masterPaginationServices.merchant].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.merchant, params));
    }

    function onDeleteData(data: any) {
        const params = {
            merchantId: data.id
        }
        setDeleteLoading(true);
        services.deleteMerchant(params)
        .then((res) => {
            setDeleteLoading(false);
            if(res.data?.succeeded) {
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

    const { modelItems, totalRecord } = merchantData;

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <div style={{ display: "flex" }}>
                        <EditButton onClick={() => {
                            setSelectedRow(modelItems[tableMeta.rowIndex]);
                            setUpdateMerchantModalOpen(true);
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
                columns={[columnAction, ...merchantColumns(formatMessage)]}
                tableData={modelItems}
                tableState={tableState}
                rowsCount={totalRecord}
                setTableState={setTableState}
                title="Merchant List"
                toolbar={<TableCreateButton onClick={() => setCreateMerchantModalOpen(true)} />}
                loading={loading || deleteLoading}
            />
        </Box>

        {createMerchantModalOpen && (
            <CreateMerchantModal
                closeModal={() => setCreateMerchantModalOpen(false)} 
                onApiCall={onApiCall}
            />
        )}

        {updateMerchantModalOpne && (
            <UpdateMerchantModal
                closeModal={() => setUpdateMerchantModalOpen(false)} 
                selectedData={selectedRow}
                onApiCall={onApiCall}
            />
        )}
        </>
    )
}