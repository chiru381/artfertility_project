import { useEffect, useState } from 'react';
import { useIntl } from "react-intl";
import { useHistory } from 'react-router';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/icons/Link';

import CustomTable from 'components/table';
import { TableCreateButton, TableViewButton, TableEditButton, TablePersonAddButton, TablePersonEditButton, TableButtonGroup, CustomTableButton } from 'components/button';
import { RootReducerState } from 'utils/types';
import { tableInitialState, patientColumns, masterPaginationServices, clinicalInitialRoutePath } from 'utils/constants';
import { getMasterPaginationData, getPatientLookup } from 'redux/actions';
import { getTableParams } from 'utils/global';
import CreatePatient from './CreatePatient';
import ViewPatient from './ViewPatient';
import DelinkCouple from './DelinkCouple';
import CreatePartner from './CreatePartner';
import { CustomDialog } from 'components';

interface Props {

}


const Index = (props: Props) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();

    const [tableState, setTableState] = useState(tableInitialState);
    const [viewPatientModalOpen, setViewPatientModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>({});

    const [selectedPartnerId, setSelectedPartnerId] = useState<any>(null);
    const [selectedPartnerChnId, setSelectedPartnerChnId] = useState<any>(null);
    const [selectedPatientId, setSelectedPatientId] = useState<any>(null);
    const [partnerRegistrationModalOpen, setPartnerRegistrationModalOpen] = useState(false);

    const [patientRegistrationModalOpen, setPatientRegistrationModalOpen] = useState(false);
    const [demographicData, setDemographicData] = useState<any>(null);
    const [demographicCopyDialog, setDemographicCopyDialog] = useState(false);


    const { patientData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            patientData: masterPaginationReducer[masterPaginationServices.wifeWithPartner].data,
            loading: masterPaginationReducer[masterPaginationServices.wifeWithPartner].loading
        }),
        shallowEqual
    );

    const { modelItems, totalRecord } = patientData;
    const tableRows = modelItems;

    useEffect(() => {
        dispatch(getPatientLookup());
        dispatch(getMasterPaginationData(masterPaginationServices.leadSource, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.insuranceCompany, {}));
    }, []);

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    function onApiCall(withState: boolean = true) {
        // if (withState) {
        const params = getTableParams(tableState);
        dispatch(getMasterPaginationData(masterPaginationServices.wifeWithPartner, params));
        // } else {
        //     setTableState(tableInitialState);
        // }
    }

    function onCreate() {
        setPatientRegistrationModalOpen(true);
    }

    function onView(rowData: any) {
        setSelectedRow(rowData);
        setViewPatientModalOpen(true);
    }

    function onAgree() {
        setDemographicCopyDialog(false);
        setPartnerRegistrationModalOpen(true);
    }

    function onDisagree() {
        setDemographicData(null);
        setDemographicCopyDialog(false);
        setPartnerRegistrationModalOpen(true);
    }

    function gotoClinicalPage(patientId: number) {
        history.push(`/${clinicalInitialRoutePath}/${patientId}`);
    }

    function onCreatePartner(data: any) {
        setDemographicCopyDialog(true);
        let { maritalStatusId, marriedSince, zipCode, address, id,
            occupationId, occupationName, nationalityId, nationalityName, birthCountryId } = data;

        setDemographicData({
            maritalStatusId, marriedSince, zipCode, address,
            occupationId: occupationId ? { label: occupationName, value: occupationId } : null,
            nationalityId: nationalityId ? { label: nationalityName, value: nationalityId } : null,
            birthCountryId
        });
        setSelectedPatientId(id);
    }

    let columnAction = {
        label: "",
        name: "",
        options: {
            customBodyRender: (_: any, tableMeta: any) => {
                return (
                    <TableButtonGroup>
                        <TableViewButton
                            onClick={() => {
                                onView(modelItems[tableMeta.rowIndex]);
                            }}
                            tooltipLabel="View Detail"
                        />

                        <TableEditButton
                            tooltipLabel="Edit Patient"
                            onClick={() => {
                                setPatientRegistrationModalOpen(true);
                                setSelectedPatientId(modelItems[tableMeta.rowIndex]?.id);
                                setSelectedPartnerChnId(modelItems[tableMeta.rowIndex]?.wifeCouples?.[0]?.chnId ?? null);
                            }}
                        />

                        {modelItems[tableMeta.rowIndex]?.wifeCouples?.length !== 0 && (
                            <DelinkCouple
                                coupleId={modelItems[tableMeta.rowIndex].wifeCouples[0].id}
                                onApiCall={onApiCall}
                            />
                        )}

                        {modelItems[tableMeta.rowIndex]?.wifeCouples?.length !== 0 && (
                            <TablePersonEditButton
                                tooltipLabel="Edit Partner"
                                onClick={() => {
                                    setPartnerRegistrationModalOpen(true);
                                    setSelectedPartnerId(modelItems[tableMeta.rowIndex]?.wifeCouples[0].husbandPatientId);
                                    setSelectedPartnerChnId(modelItems[tableMeta.rowIndex]?.wifeCouples[0].chnId);
                                }}
                            />
                        )}

                        {modelItems[tableMeta.rowIndex]?.wifeCouples?.length === 0 && (
                            <TablePersonAddButton
                                tooltipLabel="Add Partner"
                                onClick={() => {
                                    onCreatePartner(modelItems[tableMeta.rowIndex]);
                                }}
                            />
                        )}

                        <CustomTableButton
                            onClick={() => gotoClinicalPage(modelItems[tableMeta.rowIndex].id)}
                            tooltipLabel="Go to Patient EMR"
                        >
                            <Link />
                        </CustomTableButton>
                    </TableButtonGroup>
                )
            }
        }
    }

    return (
        <>
            <Box className="table-container">
                <CustomTable
                    columns={[columnAction, ...patientColumns(formatMessage)]}
                    tableData={tableRows}
                    tableState={tableState}
                    setTableState={setTableState}
                    title="Patient List"
                    rowsCount={totalRecord}
                    toolbar={<TableCreateButton onClick={onCreate} />}
                    loading={loading}
                />
            </Box>

            {viewPatientModalOpen && <ViewPatient
                closeModal={() => setViewPatientModalOpen(false)}
                patientId={selectedRow.id}
            />}

            {/* Create and update registration screen is handled by single modal component */}
            {patientRegistrationModalOpen && (
                <CreatePatient
                    closeModal={() => {
                        setPatientRegistrationModalOpen(false);
                        setSelectedPatientId(null);
                        setSelectedPartnerChnId(null);
                    }}
                    onApiCall={onApiCall}
                    patientId={selectedPatientId}
                    chnId={selectedPartnerChnId}
                />
            )}

            {/* Create and update registration screen is handled by single modal component */}
            {partnerRegistrationModalOpen && (
                <CreatePartner
                    closeModal={() => {
                        setPartnerRegistrationModalOpen(false);
                        setSelectedPatientId(null);
                        setSelectedPartnerId(null);
                        setSelectedPartnerChnId(null);
                        setDemographicData(null);
                    }}
                    demographicData={demographicData}
                    onApiCall={onApiCall}
                    patientId={selectedPatientId}
                    partnerId={selectedPartnerId}
                    selectedPartnerChnId={selectedPartnerChnId}
                />
            )}

            <CustomDialog
                open={demographicCopyDialog}
                onDisagree={onDisagree}
                onAgree={onAgree}
                title={formatMessage({ id: "register-partner" }) + "?"}
                subTitle={formatMessage({ id: "copy-demographic-data-message" }) + "?"}
            />

        </>
    )
}

export default Index;