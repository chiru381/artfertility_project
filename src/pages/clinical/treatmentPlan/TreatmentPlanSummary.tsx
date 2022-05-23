import { useHistory } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import { useTheme } from '@material-ui/core/styles';
import { useIntl } from 'react-intl';

import Link from '@material-ui/icons/Link';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import { SecondaryButton, TableButtonGroup, CustomTableButton } from 'components/button';
import { HoverLoader, SimpleTable } from 'components';
import { masterPaginationServices, treatmentProcessColumns } from 'utils/constants';
import { CustomClinicalActionHeaderWithWrap } from '../CustomClinicalActionHeader';
import { treatmentPlanMenuList } from 'utils/constants/menu';
import { RootReducerState } from 'utils/types';
import { TextBox } from 'components/forms';
import { useGetOngoingTreatmentProcessId } from 'utils/hooks';

interface Props {

}


const TreatmentPlanSummary = (props: Props) => {
    const history = useHistory();
    const theme = useTheme();
    const { formatMessage } = useIntl();
    const plannedProcessId = useGetOngoingTreatmentProcessId();

    const { treatmentProcessData, treatmentProcessDataLoading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => {
            return ({
                treatmentProcessData: masterPaginationReducer[masterPaginationServices.treatmentProcess].data,
                treatmentProcessDataLoading: masterPaginationReducer[masterPaginationServices.treatmentProcess].loading
            })
        },
        shallowEqual
    );
    const { modelItems } = treatmentProcessData;

    let tableRows = modelItems.map((item: any) => {
        // let chipColor = item.cycleStatus === "1" ? theme.palette.primary.main : item.cycleStatus === "2" ? "#42ba96" : "#E52727";
        // let chipLabel = item.cycleStatus === "1" ? "Ongoing" : item.cycleStatus === "2" ? "Finalized/Completed" : "Cancelled";
        return ({
            ...item,
            // cycleStatus: <Chip size="small" variant="outlined" style={{ color: chipColor, borderColor: chipColor }} label={chipLabel} />,
            action: <TableButtonGroup>
                <CustomTableButton tooltipLabel="Go to stimulation cycle">
                    <Link />
                </CustomTableButton>

                <CustomTableButton tooltipLabel="Go to aspiration sheet">
                    <Link />
                </CustomTableButton>
            </TableButtonGroup>
        })
    }
    )
    return (
        <CustomClinicalActionHeaderWithWrap
            title="summary"
            menuList={treatmentPlanMenuList}
        >
            <Box padding={2} component={Paper}>
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <Grid container spacing={3} alignItems="flex-end" justify="space-between">
                            <Grid item lg={9} sm={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} lg={3} md={4} sm={6}>
                                        <TextBox
                                            formLabel={"#" + formatMessage({ id: "available-oocytes" })}
                                        />
                                    </Grid>
                                    <Grid item xs={6} lg={3} md={4} sm={6}>
                                        <TextBox
                                            formLabel={formatMessage({ id: "frozen-embryos-total" })}
                                        />
                                    </Grid>
                                    <Grid item xs={6} lg={3} md={4} sm={6}>
                                        <TextBox
                                            formLabel={formatMessage({ id: "frozen-semen-remaning" })}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item lg={3} sm={12}>
                                <SecondaryButton
                                    disabled={plannedProcessId ? true : false}
                                    label="Create New Treatment"
                                    onClick={() => history.push('create-treatment')}
                                    style={{ display: "flex", float: "right" }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <SimpleTable
                            columns={treatmentProcessColumns}
                            // colSpans={[80, 10, 10]}
                            tableData={tableRows}
                        />
                    </Grid>
                </Grid>
            </Box>


            {treatmentProcessDataLoading && <HoverLoader />}
        </CustomClinicalActionHeaderWithWrap>
    )
}

export default TreatmentPlanSummary;