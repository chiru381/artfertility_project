import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import { HoverLoader, SimpleTable } from 'components';
import { ivfLabAndrologyColumns, masterPaginationServices } from 'utils/constants';
import { CustomClinicalActionHeaderWithWrap } from '../CustomClinicalActionHeader';
import { RootReducerState } from 'utils/types';

interface Props {

}

let labRequestList = [
    { date: "2021-12-01", name: "Patient One", uhid: "UID1000210", testOrderedId: "1", },
    { date: "2021-12-02", name: "Patient Two", uhid: "UID1000310", testOrderedId: "2", }
]

const IVFLabAndrology = (props: Props) => {
    const history = useHistory();
    const location = useLocation();
    const { formatMessage } = useIntl();

    const { labRequestData, labRequestDataLoading } = useSelector(
        ({ masterPaginationReducer }: RootReducerState) => {
            return ({
                labRequestData: masterPaginationReducer[masterPaginationServices.IVFLabAndrologyLabRequest].data,
                labRequestDataLoading: masterPaginationReducer[masterPaginationServices.IVFLabAndrologyLabRequest].loading
            })
        },
        shallowEqual
    );
    const { modelItems } = labRequestData;

    function onNavigateToTestOrdered(testId: string) {
        history.push(location.pathname + (testId === "1" ? "/spermiogram" : "/testicular-biopsy"));
    }

    let tableRows = useMemo(() => labRequestList.map((item: any) => {
        return ({
            ...item,
            testOrderedId: (
                <Link
                    onClick={() => onNavigateToTestOrdered(item.testOrderedId)}
                    style={{ cursor: "pointer" }}
                    underline='always'
                >
                    {item.testOrderedId === "1" ? "Spermiogram" : "Testicular Biopsy"}
                </Link>
            )
        })
    }), [labRequestList]);

    return (
        <CustomClinicalActionHeaderWithWrap
            title={formatMessage({ id: "andrology-lab" })}
        >
            <Box padding={2} component={Paper}>
                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <SimpleTable
                            columns={ivfLabAndrologyColumns}
                            tableData={tableRows}
                        />
                    </Grid>
                </Grid>
            </Box>


            {labRequestDataLoading && <HoverLoader />}
        </CustomClinicalActionHeaderWithWrap>
    )
}

export default IVFLabAndrology;