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
import CreateSkinColorModal from "./CreateSkinColorModal";
import UpdateSkinColorModal from "./UpdateSkinColorModal";

export default function SkinColor() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createSkinColorModalOpen, setCreateSkinColorModalOpen] = useState(false);
    const [updateSkinColorModalOpen, setUpdateSkinColorModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const skinColorColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "skin-color" }), type: filterTypes.text }
        ]
    }

    const { skinColorData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            skinColorData: masterPaginationReducer[masterPaginationServices.skinColor].data,
            loading: masterPaginationReducer[masterPaginationServices.skinColor].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = skinColorData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.skinColor, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            skinColorId: data.id
        }
        setDeleteLoading(true);
        services.deleteSkinColor(parms)
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
                            setUpdateSkinColorModalOpen(true);
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
                    columns={[columnAction, ...skinColorColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Skin Color"
                    toolbar={<TableCreateButton onClick={() => setCreateSkinColorModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createSkinColorModalOpen && (
                <CreateSkinColorModal
                    closeModal={() => setCreateSkinColorModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateSkinColorModalOpen && (
                <UpdateSkinColorModal
                    closeModal={() => setUpdateSkinColorModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}