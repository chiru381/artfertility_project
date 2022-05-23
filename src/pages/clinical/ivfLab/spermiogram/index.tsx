import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { useForm } from 'react-hook-form';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import IVFLabRequestInfo from './IVFLabRequestInfo';

import { CustomClinicalActionHeaderWithWrap } from '../../CustomClinicalActionHeader';
import { makeStyles, Theme, createStyles, useTheme } from '@material-ui/core/styles';
import SpermiogramTab from './SpermiogramTab';
import SpermTestPreparationTab from './SpermTestPreparationTab';


interface Props {

}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        customTabRoot: {
            color: "#FFFFFF"
        },
        customTabIndicator: {
            backgroundColor: "#89EF3C",
        },
        tabLabel: {
            textTransform: "capitalize",
            border: "1px solid red",
        },
        tabRoot: {
            textTransform: "capitalize",
            minWidth: "unset",
            padding: "0 20px",
        },
    })
);

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
        className: 'text-13 font-regular'
    }
}

const Spermiogram = (props: Props) => {
    const history = useHistory();
    const location = useLocation();
    const theme = useTheme();
    const classes = useStyles();
    const { formatMessage } = useIntl();
    const { handleSubmit, formState: { errors }, control, setValue } = useForm({ mode: 'all' });

    const [activeTab, setActiveTab] = useState(0);

    const handleChange = (_: any, value: number) => {
        setActiveTab(value);
    };

    function goBack() {
        history.goBack();
    }


    return (
        <CustomClinicalActionHeaderWithWrap
            title={formatMessage({ id: "spermiogram" })}
            goBack={goBack}
        >
            <Box padding={2} component={Paper}>
                <Grid container spacing={3}>

                    <IVFLabRequestInfo control={control} />

                    <Grid item xs={12}>
                        <Box style={{ background: '#848484' }}>
                            <Tabs
                                value={activeTab}
                                onChange={handleChange}
                                aria-label="spermiogram tabs"
                                classes={{
                                    root: classes.customTabRoot,
                                    indicator: classes.customTabIndicator,
                                }}
                            >
                                <Tab classes={{ root: classes.tabRoot }} label="Spermiogram" {...a11yProps(0)} />
                                <Tab classes={{ root: classes.tabRoot }} label="Sperm Test Preparation" {...a11yProps(1)} />
                                <Tab classes={{ root: classes.tabRoot }} label="Means" {...a11yProps(2)} />
                            </Tabs>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        {activeTab === 0 && (
                            <SpermiogramTab control={control} />
                        )}
                        {activeTab === 1 && (
                            <SpermTestPreparationTab control={control} />
                        )}
                    </Grid>

                </Grid>
            </Box>


            {/* {labRequestDataLoading && <HoverLoader />} */}
        </CustomClinicalActionHeaderWithWrap>
    )
}

export default Spermiogram;