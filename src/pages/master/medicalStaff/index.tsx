import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import CustomTable from 'components/table';
import { TableCreateButton, TableEditButton, TableButtonGroup, DeleteButton } from 'components/button';
import { tableInitialState, medicalstaffColumns } from 'utils/constants';
import countryList from 'utils/json/countryList.json';
import CreateMedicalStaffModal from "./CreateMedicalStaffModal";
import UpdateMedicalStaffModal from "./UpdateMedicalStaffModal";

let columnOptions = {
    filter: true,
    sortThirdClickReset: true,
}

const stateList = [
    { id: 1, name: 'State1' },
    { id: 2, name: 'State2' },
]

const medicalStaffData =
{
    MedicalStaff: "New Delhi",
    state: "New Delhi",
    country: 'India'
}

export default function MedicalStaff() {
    const [tableState, setTableState] = useState(tableInitialState);
    const [createMedicalStaffModalOpen, setCreateMedicalStaffModalOpen] = useState(false);
    const [updateMedicalStaffModalOpen, setUpdateMedicalStaffModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState({});
    const { formatMessage } = useIntl();

    useEffect(() => {
        // api call
    }, [tableState]);

    let tableData = [...new Array(8).fill(medicalStaffData)];

    function onDeleteData(data: any) {
    }

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton onClick={() => {
                            setSelectedRow(tableData[tableMeta.rowIndex]);
                            setUpdateMedicalStaffModalOpen(true);
                        }}
                        />

                        <DeleteButton
                            onDelete={() => onDeleteData(tableData[tableMeta.rowIndex])}
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
                    columns={[columnAction, ...medicalstaffColumns(formatMessage)]}
                    tableData={tableData}
                    tableState={tableState}
                    setTableState={setTableState}
                    title="Medical Staff List"
                    toolbar={<TableCreateButton onClick={() => setCreateMedicalStaffModalOpen(true)} />}
                />
            </Box>

            {createMedicalStaffModalOpen && (
                <CreateMedicalStaffModal
                    closeModal={() => setCreateMedicalStaffModalOpen(false)}
                />
            )}

            {updateMedicalStaffModalOpen && (
                <UpdateMedicalStaffModal
                    closeModal={() => setUpdateMedicalStaffModalOpen(false)}
                    selectedData={selectedRow}
                />
            )}
        </>
    )
}