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
import CreateQualificationModal from "./CreateQualificationModal";
import UpdateQualificationModal from "./UpdateQualificationModal";

export default function Occupation() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createQualificationModalOpen, setCreateQualificationModalOpen] = useState(false);
    const [updateQualificationModalOpen, setUpdateQualificationModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { toastMessage } = useContext<any>(RootContext);
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const [deleteLoading, setDeleteLoading] = useState(false);

    const qualificationColumns = (formatMessage: any) => {
        return [
            { name: 'name', label: formatMessage({ id: "qualification" }), type: filterTypes.text }
        ]
    }

    const { qualificationData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            qualificationData: masterPaginationReducer[masterPaginationServices.qualification].data,
            loading: masterPaginationReducer[masterPaginationServices.qualification].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = qualificationData;

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.qualification, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            qualificationId: data.id
        }
        setDeleteLoading(true);
        services.deleteQualification(parms)
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
                            setUpdateQualificationModalOpen(true);
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
                    columns={[columnAction, ...qualificationColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Qualification"
                    toolbar={<TableCreateButton onClick={() => setCreateQualificationModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createQualificationModalOpen && (
                <CreateQualificationModal
                    closeModal={() => setCreateQualificationModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateQualificationModalOpen && (
                <UpdateQualificationModal
                    closeModal={() => setUpdateQualificationModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}