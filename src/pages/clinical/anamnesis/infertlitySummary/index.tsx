import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

import { HoverLoader } from 'components';
import { useToastMessage } from 'utils/hooks';
import { CustomClinicalActionHeaderWithWrap } from 'pages/clinical/CustomClinicalActionHeader';
import { anamnesisMenuList } from "utils/constants/menu";

const InfertilitySummary = () => {

  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const [loading, setLoading] = useState(false);

  return (
    <CustomClinicalActionHeaderWithWrap
      title={formatMessage({ id: "infertility-history" })}
      menuList={anamnesisMenuList}
    >
      <Box padding={2} component={Paper}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <Grid item xs={12}>
              <Box>
                <h3 className="formHeading">
                  <FormattedMessage id="general-diagnosis" />
                </h3>
              </Box>
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12}>testing content</Grid>
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <Grid item xs={12}>
              <Box>
                <h3 className="formHeading">
                  <FormattedMessage id="relevant-notes" />
                </h3>
              </Box>
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12}>testing content</Grid>
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>
            <Grid item xs={12}>
              <Box>
                <h3 className="formHeading">
                  <FormattedMessage id="treatment-plan" />
                </h3>
              </Box>
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12}>testing content</Grid>
          </Grid>
          <Grid item xs={12} lg={3} md={4} sm={6}>G P A E</Grid>

          <Grid item xs={12} lg={4} md={12} sm={12}>
            <Grid item xs={12}>
              <Box>
                <h3 className="formHeading">
                  <FormattedMessage id="clinical-history" />
                </h3>
              </Box>
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12}>testing content</Grid>
          </Grid>
          <Grid item xs={12} lg={4} md={12} sm={12}>
            <Grid item xs={12}>
              <Box>
                <h3 className="formHeading">
                  <FormattedMessage id="previous-examination" />
                </h3>
              </Box>
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12}>testing content</Grid>
          </Grid>
          <Grid item xs={12} lg={4} md={12} sm={12}>
            <Grid item xs={12}>
              <Box>
                <h3 className="formHeading">
                  <FormattedMessage id="exploration" />
                </h3>
              </Box>
            </Grid>
            <Grid item xs={12} lg={12} md={12} sm={12}>testing content</Grid>
          </Grid>

        </Grid>
      </Box>
      {loading && <HoverLoader />}
    </CustomClinicalActionHeaderWithWrap>
  )
}

export default InfertilitySummary
