import { useMemo, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';

import Grid from "@material-ui/core/Grid";
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import AddCircle from '@material-ui/icons/AddCircle';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import { CustomClinicalActionHeaderWithWrap } from '../CustomClinicalActionHeader';
import { TableDeleteButton } from 'components/button';
import { SimpleTable, SimpleSearchableTable, HoverLoader } from 'components';
import { services } from 'utils/services';
import { useGetPatientId, useToastMessage } from 'utils/hooks';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getMasterPaginationData } from 'redux/actions';
import { masterPaginationServices } from 'utils/constants';
import { RootReducerState } from 'utils/types';

interface Props {

}


let diagnosisColumn = [
    { label: "diagnosis", name: 'name' },
    { label: "primary", name: 'primary' },
    { label: "action", name: 'action' },
];

let indicationColumn = [
    { label: "indication", name: 'name' },
    { label: "action", name: 'action' },
];

const CreateTreatment = (props: Props) => {
    const history = useHistory();
    const { toastMessage } = useToastMessage();
    const { formatMessage } = useIntl();
    const dispatch = useDispatch();
    let patientId = useGetPatientId();

    const [diagnosisList, setDiagnosisList] = useState<{ [key: string]: any }[]>([]);
    const [indicationsList, setIndicationsList] = useState<{ [key: string]: any }[]>([]);
    const [loading, setLoading] = useState(false);

    const { indicationData, indicationDataLoading, diagnosisData, diagnosisDataLoading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => {
            return ({
                indicationData: masterPaginationReducer[masterPaginationServices.treatmentIndication].data,
                indicationDataLoading: masterPaginationReducer[masterPaginationServices.treatmentIndication].loading,
                diagnosisData: masterPaginationReducer[masterPaginationServices.treatmentDiagnosis].data,
                diagnosisDataLoading: masterPaginationReducer[masterPaginationServices.treatmentDiagnosis].loading
            })
        },
        shallowEqual
    );

    useEffect(() => {
        dispatch(getMasterPaginationData(masterPaginationServices.treatmentIndication, {}));
        dispatch(getMasterPaginationData(masterPaginationServices.treatmentDiagnosis, {}));
    }, []);

    useEffect(() => {
        if (diagnosisData.modelItems?.length) {
            setDiagnosisList(diagnosisData.modelItems.map((item: any) => ({ ...item, isSelected: false })))
        }
    }, [diagnosisData.modelItems]);

    useEffect(() => {
        if (indicationData.modelItems?.length) {
            setIndicationsList(indicationData.modelItems.map((item: any) => ({ ...item, isSelected: false })))
        }
    }, [indicationData.modelItems]);

    function onSave() {
        let bodyData = {
            patientId,
            diagnoses: selectedDiagnosisTableRows.map((item: any) => ({
                isPrimary: item.isPrimary,
                treatmentDiagnosisId: item.id,
                treatmentDiagnosisName: item.name
            })),
            indications: selectedIndicationsTableRows.map((item: any) => ({
                treatmentIndicationId: item.id,
                treatmentIndicationName: item.name
            })),
        };

        setLoading(true);
        services.createTreatmentProcess(bodyData)
            .then((res) => {
                setLoading(false);
                if (res.data?.succeeded) {
                    toastMessage(formatMessage({ id: "create-treatment-message" }));
                    history.goBack();
                    let params = { patientId: 1 }
                    dispatch(getMasterPaginationData(masterPaginationServices.treatmentProcess, params));
                } else {
                    toastMessage(res.data?.message, 'error');
                }
            })
            .catch((err) => {
                setLoading(false);
                toastMessage(err.message, 'error');
            })
    }

    function onToggleDiagnosis(diagnosisId: number) {
        setDiagnosisList(prevState => prevState.map((list) => ({
            ...list,
            isSelected: (diagnosisId === list.id) ? !list.isSelected : list.isSelected,
            isPrimary: selectedDiagnosisTableRows.length ? list.isPrimary : (diagnosisId === list.id) ? true : false
        })));
    }

    function onMarkDiagnosisPrimary(diagnosisId: number) {
        setDiagnosisList(diagnosisList.map((list) => ({ ...list, isPrimary: (diagnosisId === list.id) ? true : false })));
    }

    function onToggleIndication(indicationId: number) {
        setIndicationsList(prevState => prevState.map((list) => ({
            ...list,
            isSelected: (indicationId === list.id) ? !list.isSelected : list.isSelected,
        })));
    }

    let diagnosisTableRows = useMemo(() => {
        return diagnosisList.map((item) => ({
            ...item,
            diagnosisCheckBox: (
                <Checkbox
                    checked={item.isSelected}
                    icon={<AddCircle htmlColor="#D6D6D6" />}
                    checkedIcon={<CheckCircle htmlColor="#48A865" />}
                    onChange={() => onToggleDiagnosis(item.id)}
                />
            )
        }))
    }, [diagnosisList]);

    let selectedDiagnosisTableRows = useMemo(() => diagnosisList.filter(item => item.isSelected).map((item) => ({
        ...item,
        primary: <Radio
            onChange={() => onMarkDiagnosisPrimary(item.id)}
            checked={item.isPrimary}
            style={{ color: "black", padding: "5px" }}
            size="small"
        />,
        action: <TableDeleteButton
            imageStyle={{ width: "20px", height: "20px" }}
            onClick={() => onToggleDiagnosis(item.id)}
        />
    })), [diagnosisList]);

    let indicationsTableRows = useMemo(() => {
        return indicationsList.map((item: any) => ({
            ...item,
            indicationCheckBox: (
                <Checkbox
                    checked={item.isSelected}
                    icon={<AddCircle htmlColor="#D6D6D6" />}
                    checkedIcon={<CheckCircle htmlColor="#48A865" />}
                    onChange={() => onToggleIndication(item.id)}
                />
            )
        }))
    }, [indicationsList]);

    let selectedIndicationsTableRows = useMemo(() => indicationsList.filter(item => item.isSelected).map((item) => ({
        ...item,
        action: <TableDeleteButton
            imageStyle={{ width: "20px", height: "20px" }}
            onClick={() => onToggleIndication(item.id)}
        />
    })), [indicationsList]);

    return (
        <CustomClinicalActionHeaderWithWrap
            title="New treatment"
            onSave={onSave}
            saveButtonProps={{
                disabled: !(selectedDiagnosisTableRows.length && selectedIndicationsTableRows.length),
            }}
            goBack={() => history.goBack()}
            backButtonProps={{ label: "Summary" }}
        >
            <Box padding={2} component={Paper}>
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <Grid container spacing={4}>
                            <Grid item md={6} sm={12} style={{ display: 'flex' }}>
                                <SimpleTable
                                    columns={diagnosisColumn}
                                    colSpans={[80, 10, 10]}
                                    tableData={selectedDiagnosisTableRows}
                                />
                            </Grid>

                            <Grid item md={6} sm={12} style={{ display: 'flex' }}>
                                <SimpleSearchableTable
                                    columns={["name", "diagnosisCheckBox"]}
                                    colSpans={[90, 10]}
                                    tableData={diagnosisTableRows}
                                    label="Diagnosis"
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Grid container spacing={4}>
                            <Grid item md={6} sm={12} style={{ display: 'flex' }}>
                                <SimpleTable
                                    columns={indicationColumn}
                                    colSpans={[90, 10]}
                                    tableData={selectedIndicationsTableRows}
                                />
                            </Grid>

                            <Grid item md={6} sm={12} style={{ display: 'flex' }}>
                                <SimpleSearchableTable
                                    columns={["name", "indicationCheckBox"]}
                                    colSpans={[90, 10]}
                                    tableData={indicationsTableRows}
                                    label="Indications"
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Box>

            {(loading || indicationDataLoading || diagnosisDataLoading) && <HoverLoader />}
        </CustomClinicalActionHeaderWithWrap>
    )
}

export default CreateTreatment;