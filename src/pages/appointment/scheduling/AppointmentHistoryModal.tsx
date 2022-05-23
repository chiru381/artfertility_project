import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Modal from '@material-ui/core/Modal';
import { FormPrimaryHeading } from 'components/forms';

import { getMasterPaginationData } from 'redux/actions';
import CustomTable from 'components/table';
import { tableInitialState, masterPaginationServices, filterOperators, appointmentColumns, clinicalInitialRoutePath } from 'utils/constants';
import { RootReducerState } from 'utils/types';
import { getTableParams } from 'utils/global';
import { ButtonGroup, PrimaryButton, SecondaryButton } from 'components/button';

interface Props {
    closeModal: () => void;
    patientId: number | null;
}

const AppointmentHistoryModal = ({ closeModal, patientId }: Props) => {
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    const history = useHistory();

    const [tableState, setTableState] = useState(tableInitialState);

    const { appointmentData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => ({
            appointmentData: masterPaginationReducer[masterPaginationServices.appointment].data,
            loading: masterPaginationReducer[masterPaginationServices.appointment].loading
        }),
        shallowEqual
    );

    useEffect(() => {
        onApiCall();
    }, [tableState]);

    const { modelItems, totalRecord } = appointmentData;


    function onApiCall() {
        const tableParams = getTableParams(tableState);

        let params = {
            ...tableParams,
            customFilters: [
                ...tableParams?.customFilters ?? [],
                {
                    member: "appointmentCallTypeId",
                    value: "2",
                    operator: filterOperators.isEqualTo
                },
                {
                    member: "patientId",
                    value: String(patientId),
                    operator: filterOperators.isEqualTo
                }
            ]
        };

        dispatch(getMasterPaginationData(masterPaginationServices.appointment, params));
    }

    function goToEmr() {
        history.push(`/${clinicalInitialRoutePath}/${patientId}`);
        closeModal();
    }

    return (
        <Modal open={true}>
            <>
                <div className="full-modal-container patient-view-container">
                    <Box className="full-modal-scroll-container">
                        <div className="full-modal-head-container">
                            <FormPrimaryHeading label={formatMessage({ id: "appointment-history" })} />

                            <ButtonGroup>
                                <PrimaryButton
                                    label="Go to EMR"
                                    onClick={goToEmr}
                                />
                                <SecondaryButton
                                    label="Cancel"
                                    onClick={closeModal}
                                />
                            </ButtonGroup>
                        </div>

                        <div className="full-modal-body-container" style={{ padding: "0px", background: "#ECECEC" }}>
                            <Box className="table-container">
                                <CustomTable
                                    columns={appointmentColumns(formatMessage)}
                                    tableData={modelItems}
                                    tableState={tableState}
                                    rowsCount={totalRecord}
                                    setTableState={setTableState}
                                    loading={loading}
                                />
                            </Box>

                        </div>

                    </Box>
                </div>

            </>
        </Modal>
    )
}

export default AppointmentHistoryModal;