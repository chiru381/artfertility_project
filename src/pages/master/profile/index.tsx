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
import CreateProfileModal from "./CreateProfileModal";
import UpdateProfileModal from "./UpdateProfileModal";

export default function Profile() {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();

    const [tableState, setTableState] = useState(tableInitialState);
    const [createProfileModalOpen, setCreateProfileModalOpen] = useState(false);
    const [updateProfileModalOpen, setUpdateProfileModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const [deleteLoading, setDeleteLoading] = useState(false);

    const { testData, profileData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            testData: masterPaginationReducer[masterPaginationServices.test].data,
            profileData: masterPaginationReducer[masterPaginationServices.profile].data,
            loading: masterPaginationReducer[masterPaginationServices.profile].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.test, {}));
    }, []);

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.profile, params));
    }

    const { modelItems, totalRecord } = profileData;
    let testOptions = testData.modelItems?.map((option: any) => ({ label: option.name, value: option.id }));

    const profileColumns = (formatMessage: any) => {
        return [
            {
                name: 'profileName',
                label: formatMessage({ id: "profile-name" }),
                type: filterTypes.text
            },
            {
                name: 'testName', label: formatMessage({ id: "test" }),
                type: filterTypes.select,
                selectOptions: testOptions ?? [],
                hideGlobalSearchFilter: true,
                primaryColumnName: "Test.Name",
            },
            {
                name: 'sequence',
                label: formatMessage({ id: "sequence-number" }),
                type: filterTypes.text
            },
        ]
    }

    function onDeleteData(data: any) {
        const parms = {
            profileId: data.id
        }
        setDeleteLoading(true);
        services.deleteProfile(parms)
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
                            setUpdateProfileModalOpen(true);
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
                    columns={[columnAction, ...profileColumns(formatMessage)]}
                    tableData={modelItems}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Profile / Panel List"
                    toolbar={<TableCreateButton onClick={() => setCreateProfileModalOpen(true)} />}
                    loading={loading || deleteLoading}
                />
            </Box>

            {createProfileModalOpen && (
                <CreateProfileModal
                    closeModal={() => setCreateProfileModalOpen(false)}
                    onApiCall={onApiCall}
                />
            )}

            {updateProfileModalOpen && (
                <UpdateProfileModal
                    closeModal={() => setUpdateProfileModalOpen(false)}
                    selectedData={selectedRow}
                    onApiCall={onApiCall}
                />
            )}
        </>
    )
}