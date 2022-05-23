import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { getMasterPaginationData } from 'redux/actions';
import { useToastMessage } from 'utils/hooks';

import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, masterPaginationServices } from 'utils/constants';
import CreateDressCodeModal from "./CreateDressCodeModal";
import UpdateDressCodeModal from "./UpdateDressCodeModal";
import { RootReducerState } from 'utils/types';
import { getTableParams } from 'utils/global';
import { services } from 'utils/services';


export default function DressCode() {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();

    const [tableState, setTableState] = useState(tableInitialState);
    const [createDressCodeModalOpen, setCreateDressCodeModalOpen] = useState(false);
    const [updateDressCodeModalOpen, setUpdateDressCodeModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { toastMessage } = useToastMessage();

    const { dressCodeData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            dressCodeData: masterPaginationReducer[masterPaginationServices.dressCode].data,
            loading: masterPaginationReducer[masterPaginationServices.dressCode].loading
        }),
        shallowEqual
    );
    let tableData = dressCodeData.modelItems;

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.dressCode, params));
    }

    function onDeleteData(data: any) {
        const parms = {
            dressCodeId: data.id
        }
        setDeleteLoading(true);
        services.deleteDressCode(parms)
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

    let columns = [
        {
            label: "",
            name: "",
            options: {
                customBodyRender: (_: any, tableMeta: any) => {
                    return (
                        <TableButtonGroup>
                            <TableEditButton
                                onClick={() => {
                                    setSelectedRow(tableData[tableMeta.rowIndex]);
                                    setUpdateDressCodeModalOpen(true);
                                }}
                            />

                            <DeleteButton
                                onDelete={() => onDeleteData(tableData[tableMeta.rowIndex])}
                            />
                        </TableButtonGroup>
                    )
                }
            }
        },
        { name: 'code', label: formatMessage({ id: "dresscode-name" }) },
    ]


    return (
        <>
            <Box className="table-container">
                <CustomTable
                    columns={columns}
                    tableData={tableData}
                    tableState={tableState}
                    setTableState={setTableState}
                    title="Dress Code List"
                    toolbar={<TableCreateButton onClick={() => setCreateDressCodeModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createDressCodeModalOpen && (
                <CreateDressCodeModal
                    closeModal={() => setCreateDressCodeModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateDressCodeModalOpen && (
                <UpdateDressCodeModal
                    closeModal={() => setUpdateDressCodeModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}