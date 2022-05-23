import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

import { TableCreateButton, TableEditButton, TableButtonGroup, TableDischargeButton } from 'components/button';
import CustomTable from 'components/table';
import { tableInitialState, masterPaginationServices, admittedPatientColumns } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { getMasterPaginationData } from 'redux/actions';
import { getTableParams } from 'utils/global';
import { filterTypes } from 'utils/constants/default';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { CustomDialog } from 'components/CustomDialog';

const AdmittedPatients = () => {
    const { formatMessage } = useIntl();
    const { toastMessage } = useToastMessage();
    const history = useHistory();
    const dispatch = useDispatch();
    const [tableState, setTableState] = useState(tableInitialState);
    const [dischargeLoading, setDischargeLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>({});

    const { patientData, loading, medicalStaffData, bedData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            patientData: masterPaginationReducer[masterPaginationServices.admittedPatients].data,
            loading: masterPaginationReducer[masterPaginationServices.admittedPatients].loading,
            medicalStaffData: masterPaginationReducer[masterPaginationServices.medicalStaff].data,
            bedData: masterPaginationReducer[masterPaginationServices.bed].data
        }),
        shallowEqual
    );

    const { modelItems, totalRecord } = patientData;

    let medicalStaffOptions = medicalStaffData.modelItems?.map((option: any) => ({ label: option.userDisplayName, value: String(option.id) }));
    let bedOptions = bedData.modelItems?.map((option: any) => ({ label: option.name, value: String(option.id) }));

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.medicalStaff, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.bed, {}));
    }, []);

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        const params = getTableParams(withState ? tableState : {});
        dispatch(getMasterPaginationData(masterPaginationServices.admittedPatients, params));
    }

    function handleRowClick(rowData: any) {
        history.push(`patient/admission`, { ...rowData });
    }

    function handleDischargeClick(rowData: any) {
        setSelectedRow(rowData);
        setShowConfirmation(true);
        setOpen(true);
    }

    function handleCreateAdmissionClick() {
        history.push(`patient/admission`, {});
    }

    const columns = [
        ...admittedPatientColumns(formatMessage),
        {
            name: 'requestRaisedDate', label: formatMessage({ id: "admit-date-time" }),
            primaryColumnName: 'requestRaisedDate',
            hideGlobalSearchFilter: true,
            options: {
                customBodyRender: (value: string) => {
                    return <span>{value ? dayjs(value).format('DD-MM-YYYY hh:mm A') : "-"}</span>
                }
            },
        },
        {
            name: 'dischargeDateTime', label: formatMessage({ id: "discharge-date-time" }),
            primaryColumnName: 'dischargeDateTime',
            hideGlobalSearchFilter: true,
            options: {
                customBodyRender: (value: string) => {
                    return <span>{value ? dayjs(value).format('DD-MM-YYYY hh:mm A') : "-"}</span>
                }
            },
        },
        {
            name: 'bedName', label: formatMessage({ id: "bed-name" }),
            type: filterTypes.select,
            selectOptions: bedOptions ?? {},
            hideGlobalSearchFilter: true,
            primaryColumnName: "Bed.Name",
            secondaryColumnName: "bedId"
        },
        {
            name: 'admittingDoctorUserDisplayName', label: formatMessage({ id: "admitting-doctor" }),
            selectOptions: medicalStaffOptions ?? {},
            type: filterTypes.select,
            hideGlobalSearchFilter: true,
            primaryColumnName: 'AdmittingDoctor.User.DisplayName',
            secondaryColumnName: 'admittingDoctorId'
        }
    ]

    const tableRows = modelItems.map((items: any) => ({
        ...items,
        partnerCHN: items?.coupleId ? items.coupleCHNId : null,
        partnerName: items?.coupleId ? items.patientGenderName?.toLowerCase() === "female" ? items.coupleHusbandFullName : items.coupleWifeFullName : null,
        partnerUHID: items?.coupleId ? items.patientGenderName?.toLowerCase() === "female" ? items.coupleHusbandPatientUHID : items.coupleWifePatientUHID : null,
        partnerAge: items?.coupleId ? items.patientGenderName?.toLowerCase() === "female" ? items.coupleHusbandPatientAgeInYear : items.coupleWifePatientAgeInYear : null,
        partnerDOB: items?.coupleId ? items.patientGenderName?.toLowerCase() === "female" ? items.coupleHusbandPatientBirthDate : items.coupleWifePatientBirthDate : null,
        partnerGender: items?.coupleId ? items.patientGenderName?.toLowerCase() === "female" ? items.coupleHusbandPatientGenderName : items.coupleWifePatientGenderName : null,
        partnerPhone: items?.coupleId ? items.patientGenderName?.toLowerCase() === "female" ? items.coupleHusbandPatientTelephone : items.coupleWifePatientTelephone : null,
    }));

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableEditButton
                            tooltipLabel="Edit Admission"
                            onClick={() => handleRowClick(tableRows[tableMeta.rowIndex])}
                            disabled={tableRows[tableMeta.rowIndex]?.isDischarged ? true : false}
                            className={tableRows[tableMeta.rowIndex]?.isDischarged ? "disable-image" : ""}
                        />

                        <TableDischargeButton
                            tooltipLabel="Discharge"
                            onClick={() => handleDischargeClick(tableRows[tableMeta.rowIndex])}
                            disabled={tableRows[tableMeta.rowIndex]?.isDischarged ? true : false}
                            className={tableRows[tableMeta.rowIndex]?.isDischarged ? "disable-image" : ""} />
                    </TableButtonGroup>
                )
            }
        }
    }

    function handleClose() {
        setShowConfirmation(false);
        setOpen(false);
        setSelectedRow({});
    }

    function onAgree() {
        const parms = {
            admissionId: selectedRow?.id
        }
        setDischargeLoading(true);
        services.dischargeAdmittedPatient(parms)
            .then((res) => {
                setDischargeLoading(false);
                if (res.data?.succeeded) {
                    onApiCall();
                    toastMessage(formatMessage({ id: "discharge-message" }));
                    setShowConfirmation(false);
                    setOpen(false);
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setDischargeLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    return (
        <>
            <Box className="table-container">
                <CustomTable
                    columns={tableRows?.length ? [columnAction, ...columns] : [...columns]}
                    tableData={tableRows}
                    tableState={tableState}
                    rowsCount={totalRecord}
                    setTableState={setTableState}
                    title="Admitted Patients"
                    toolbar={<TableCreateButton label={formatMessage({ id: "create-admission" })} onClick={handleCreateAdmissionClick} />}
                    loading={loading}
                />
            </Box>
            {showConfirmation && (
                <CustomDialog
                    open={open}
                    onDisagree={handleClose}
                    onAgree={onAgree}
                    title={formatMessage({ id: "patient-discharge-title" })}
                    subTitle={formatMessage({ id: "patient-discharge-confirmation" })}
                />
            )}
        </>
    )
}

export default AdmittedPatients;