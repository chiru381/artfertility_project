import { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import { useIntl } from "react-intl";
import Paper from '@material-ui/core/Paper';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { RootReducerState } from 'utils/types';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices, bedStatus } from 'utils/constants';
import {
    BlockForMaintenanceModal, DrugConsumptionModal, ConsumableIssueModal, PatientTransferToOTModal, 
    PatientTransferOutToOTModal, DischargeModal
} from './form/index';
import { BedCard } from './BedCard';
import { HoverLoader } from 'components';

export default function BedDashboard() {
    const [selectedBed, setSelectedBed] = useState({});
    const [blockForMaintenanceModalOpen, setBlockForMaintenanceModalOpen] = useState(false);
    const [unBlockFromMaintenanceModalOpen, setUnBlockFromMaintenanceModalOpen] = useState(false);
    const [drugConsumptionModalOpen, setDrugConsumptionModalOpen] = useState(false);
    const [consumableIssueModal, setConsumableIssueModal] = useState(false);
    const [patientTransferToOTModal, setPatientTransferToOTModal] = useState(false);
    const [patientTransferOutToOTModal, setPatientTransferOutToOTModal] = useState(false);
    const [dischargeModal, setDischargeModal] = useState(false);

    const dispatch = useDispatch();
    const { formatMessage } = useIntl();

    const { bedData, loading, bedStatusData } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            bedData: masterPaginationReducer[masterPaginationServices.bedWithAdmission].data,
            loading: masterPaginationReducer[masterPaginationServices.bedWithAdmission].loading,
            bedStatusData: masterPaginationReducer[masterPaginationServices.bedStatus].data,
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, []);

    function onApiCall() {
        dispatch(getMasterPaginationData(masterPaginationServices.bedWithAdmission, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.bedStatus, {}));
    }

    let { modelItems } = bedData;
    const bedRows = modelItems.map((items: any) => ({
        ...items,
        patientName: items?.admissions?.[0]?.patientFullName ?? '-',
        patientUHID: items?.admissions?.[0]?.patientUHID ?? '-',
        partnerCHN: items?.admissions?.[0]?.chnId ?? '-',
        treatingDoctorName: items?.admissions?.[0]?.inPatientPackageAllocationTreatingDoctorUserDisplayName ?? '-',
        procedureName: items?.admissions?.[0]?.inPatientPackageAllocationPackageName ?? '-',
        admissionId: items?.admissions?.[0]?.id ?? 0,
        colorCode: bedStatusData?.modelItems?.find((status: any) => status.id === items?.bedStatusId)?.colorCode ?? ''
    }));

    return (
        <>
            <Box py={4} className="container rel" >
                <Grid item xs={12} className="adt_legend_area">
                    <Paper>
                        <Grid container spacing={1}>
                            <Grid item xs={12} lg={4} md={4} sm={12}>
                                <h1>Bed Dashboard</h1>
                            </Grid>
                            <Grid item xs={12} lg={8} md={8} sm={12}>
                                <ul className="adt_legend">
                                    {bedStatusData?.modelItems?.map((status: any) => (
                                        <li key={status.id} ><span style={{ backgroundColor: `${status.colorCode}` }}></span>{status.name}</li>
                                    ))}
                                </ul>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid container spacing={2}>
                    {bedRows?.map((bed: any) => (
                        <Grid key={bed.id} item xs={12} lg={3} md={4} sm={6}>
                            <Paper className="bed_das_bock">

                                <BedCard bedDetail={bed} />

                                <ul className="bed_menu">
                                    {bed.bedStatusId === bedStatus.Vacant &&
                                        <li><Link className="cursorPointer" onClick={() => {
                                            setBlockForMaintenanceModalOpen(true)
                                            setSelectedBed(bed)
                                        }}>{formatMessage({ id: "block-for-maintenance" })}</Link></li>
                                    }

                                    {bed.bedStatusId === bedStatus.BlockedforMaintenance &&
                                        <li><Link className="cursorPointer" onClick={() => {
                                            setUnBlockFromMaintenanceModalOpen(true)
                                            setSelectedBed(bed)
                                        }}>{formatMessage({ id: "unblock-for-maintenance" })}</Link></li>
                                    }
                                    {(bed.bedStatusId === bedStatus.PreOperativeArea
                                        || bed.bedStatusId === bedStatus.InOT
                                        || bed.bedStatusId === bedStatus.PostOT) && <>
                                            <li><Link className="cursorPointer" onClick={() => {
                                                setDrugConsumptionModalOpen(true)
                                                setSelectedBed(bed)
                                            }}>{formatMessage({ id: "medication-consumption" })}</Link></li>
                                            <li><Link className="cursorPointer" onClick={() => {
                                                setConsumableIssueModal(true)
                                                setSelectedBed(bed)
                                            }} >{formatMessage({ id: "consumable-consumption" })}</Link></li>
                                            <li><Link className="cursorPointer" >{formatMessage({ id: "emr" })}</Link></li>
                                        </>
                                    }

                                    {bed.bedStatusId === bedStatus.PreOperativeArea && <>
                                        <li><Link className="cursorPointer" onClick={() => {
                                            setPatientTransferToOTModal(true)
                                            setSelectedBed(bed)
                                        }}>{formatMessage({ id: "patient-transfer-to-ot" })}</Link></li>
                                        <li><Link className="cursorPointer" onClick={() => {
                                            setDischargeModal(true)
                                            setSelectedBed(bed)
                                        }}>{formatMessage({ id: "discharge" })}</Link></li>
                                    </>
                                    }

                                    {bed.bedStatusId === bedStatus.InOT && <>
                                        <li><Link className="cursorPointer" onClick={() => {
                                            setPatientTransferOutToOTModal(true)
                                            setSelectedBed(bed)
                                        }}>{formatMessage({ id: "patient-transfer-out-to-post-ot" })}</Link></li>
                                    </>
                                    }

                                    {bed.bedStatusId === bedStatus.PostOT && <>
                                        <li><Link className="cursorPointer" onClick={() => {
                                            setDischargeModal(true)
                                            setSelectedBed(bed)
                                        }}>{formatMessage({ id: "discharge" })}</Link></li>
                                    </>
                                    }
                                </ul>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <>
                {blockForMaintenanceModalOpen && (
                    <BlockForMaintenanceModal
                        closeModal={() => setBlockForMaintenanceModalOpen(false)}
                        isBlock={true}
                        selectedData={selectedBed}
                        onApiCall={onApiCall}
                    />
                )}
                {unBlockFromMaintenanceModalOpen && (
                    <BlockForMaintenanceModal
                        closeModal={() => setUnBlockFromMaintenanceModalOpen(false)}
                        isBlock={false}
                        selectedData={selectedBed}
                        onApiCall={onApiCall}
                    />
                )}

                {drugConsumptionModalOpen && (
                    <DrugConsumptionModal
                        closeModal={() => setDrugConsumptionModalOpen(false)}
                        selectedData={selectedBed}
                    />
                )}

                {consumableIssueModal && (
                    <ConsumableIssueModal
                        closeModal={() => setConsumableIssueModal(false)}
                        selectedData={selectedBed}
                    />
                )}
                {patientTransferToOTModal && (
                    <PatientTransferToOTModal
                        closeModal={() => setPatientTransferToOTModal(false)}
                        selectedData={selectedBed}
                        onApiCall={onApiCall}
                    />
                )}
                {patientTransferOutToOTModal && (
                    <PatientTransferOutToOTModal
                        closeModal={() => setPatientTransferOutToOTModal(false)}
                        selectedData={selectedBed}
                        onApiCall={onApiCall}
                    />
                )}
                {dischargeModal && (
                    <DischargeModal
                        closeModal={() => setDischargeModal(false)}
                        selectedData={selectedBed}
                        onApiCall={onApiCall}
                    />
                )}
            </>
            {loading && <HoverLoader />}
        </>
    )
}
