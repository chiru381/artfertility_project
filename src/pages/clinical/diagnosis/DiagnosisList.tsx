import { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";

import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from "@material-ui/core/Grid";

import { diagnosisMenuList } from 'utils/constants/menu';
import { HoverLoader, SimpleTable } from 'components';
import { masterPaginationServices, diagnosisProcessColumns } from 'utils/constants';
import { useGetPatientId } from 'utils/hooks';
import { getMasterPaginationData } from "redux/actions";
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { SecondaryButton } from "components/button";
import { RootReducerState } from 'utils/types';
import { TableButtonGroup, TableEditButton, TableDeleteButton } from 'components/button';

interface Props {

}
const DiagnosisList = (props: Props) => {
    const location = useLocation<any>();
    const { formatMessage } = useIntl();
    const history = useHistory();
    const dispatch = useDispatch();
    const [value, setValue] = useState(0);
    const [patientTabSelected, setPatientTabSelected] = useState(true);


    let patientId = useGetPatientId();

    const { diagnosisSummaryData, loading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => {
            return ({
                diagnosisSummaryData: masterPaginationReducer[masterPaginationServices.diagnosisProcess].data,
                loading: masterPaginationReducer[masterPaginationServices.diagnosisProcess].loading
            })
        },
        shallowEqual
    );

    const { modelItems } = diagnosisSummaryData;

    useEffect(() => {
        let params = { patientId };
        dispatch(getMasterPaginationData(masterPaginationServices.diagnosisProcess, params));
    }, []);

    function handleRowClick(rowData: any) {
        history.push(`general`, { ...rowData });
    }

    function onDelete(data: any) {
    }

    let tableRows = modelItems.map((item: any) => {
        return ({
            ...item,
            action: <TableButtonGroup>
                <TableEditButton
                    tooltipLabel="Edit"
                    onClick={() => handleRowClick(item)}
                />
                <TableDeleteButton
                    tooltipLabel="Delete"
                    onClick={() => onDelete(item)}
                />
            </TableButtonGroup>
        })
    }
    )

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };


    function onPatientTab() {
        setPatientTabSelected(true);
    }

    function onPartnerTab() {
        setPatientTabSelected(false);
    }

    function onAddNew() {
        if (patientTabSelected) {
            history.push(`new-diagnosis/patient`);
        }
        else {
            history.push(`new-diagnosis/partner`);
        }
    }

    function onEdit(rowData: any) {
        if (patientTabSelected) {
            history.push(`patient`, { ...rowData });
        }
        else {
            history.push(`partner`, { ...rowData });
        }
    }


    return (
        <CustomClinicalActionHeaderWithWrap
            title="Diagnosis List"
            menuList={diagnosisMenuList}
        >
            <Box padding={2} component={Paper}>
                <Grid container spacing={3}>
                    <Grid item xs={10} lg={10} md={8} sm={6}>
                        <Box>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                            >
                                <Tab onClick={onPatientTab} label={formatMessage({ id: "patient" })} />
                                <Tab onClick={onPartnerTab} label={formatMessage({ id: "partner" })} />
                            </Tabs>
                        </Box>
                    </Grid>
                    <SecondaryButton
                        label="Add New"
                        onClick={onAddNew}
                        style={{ margin: "18px 10px" }}
                    />
                    <Grid item xs={12}>
                        <SimpleTable
                            columns={diagnosisProcessColumns}
                            tableData={tableRows}
                        />
                    </Grid>
                </Grid>
            </Box>
            {loading && <HoverLoader />}
        </CustomClinicalActionHeaderWithWrap>
    )
}

export default DiagnosisList;