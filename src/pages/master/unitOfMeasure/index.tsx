import { useEffect, useState } from 'react';
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
import { filterTypes } from 'utils/constants/default';
import { useToastMessage } from 'utils/hooks';
import CreateUnitOfMeasureModal from "./CreateUnitOfMeasureModal";
import UpdateUnitOfMeasureModal from "./UpdateUnitOfMeasureModal";

export default function UnitOfMeasure() {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [tableState, setTableState] = useState(tableInitialState);
    const [createUnitOfMeasureModalOpen, setCreateUnitOfMeasureModalOpen] = useState(false);
    const [updateUnitOfMeasureModalOpen, setUpdateUnitOfMeasureModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);

    const unitOfMeasureColumns = (formatMessage: any) => {
        return [
            { name: 'uomShortName', label: formatMessage({ id: "uom-short-name" }), type: filterTypes.text },
            { name: 'uomLongName', label: formatMessage({ id: "uom-long-name" }), type: filterTypes.text }
        ]
    }

    const { unitOfMeasureData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            unitOfMeasureData: masterPaginationReducer[masterPaginationServices.unitOfMeasure].data,
            loading: masterPaginationReducer[masterPaginationServices.unitOfMeasure].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = unitOfMeasureData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.unitOfMeasure, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            unitOfMeasureId: data.id
        }
        setDeleteLoading(true);
        services.deleteUnitOfMeasure(parms)
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
                            setUpdateUnitOfMeasureModalOpen(true);
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
                    columns={[columnAction, ...unitOfMeasureColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Measurement Unit List"
                    toolbar={<TableCreateButton onClick={() => setCreateUnitOfMeasureModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createUnitOfMeasureModalOpen && (
                <CreateUnitOfMeasureModal
                    closeModal={() => setCreateUnitOfMeasureModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateUnitOfMeasureModalOpen && (
                <UpdateUnitOfMeasureModal
                    closeModal={() => setUpdateUnitOfMeasureModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}