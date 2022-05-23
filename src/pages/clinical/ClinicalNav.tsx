import { useHistory } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';

import { TextBox } from 'components/forms';
import { images } from 'utils/constants';

interface Props {

}

const ClinicalNav = (props: Props) => {
  let history = useHistory();

  function goToHome() {
    history.push("/");
  }

  return (
    <div className="navbar-container">
      <Grid container spacing={1} justify="space-between">

        <Grid item lg={1} md={2} sm={2} xs={3}>
          <Link style={{ cursor: "pointer" }} onClick={goToHome}>
            <Tooltip title="Go to dashboard">
              <div className="clinical-art-logo"><img src={images.art_logo} /></div>
            </Tooltip>
          </Link>
        </Grid>

        <Grid item lg={11} md={10} sm={10} xs={9}>
          <Grid container spacing={1} justify="flex-end" alignItems="center">
            <Grid item xs={4} lg={3} md={4} sm={5}>
              <TextBox
                id="outlined-helperText"
                placeholder="CHN/UHID SEARCH"
                style={{ borderRadius: '24px' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <div className="searchbox-icon-wrap">
                        <Search htmlColor="#FFFFFF" fontSize="small" />
                      </div>
                    </InputAdornment>
                  ),
                  style: { borderRadius: "24px" }
                }}
                size="small"
              />
            </Grid>
            <Grid item>
              <div style={{ height: "40px", width: "1px", background: "#CFCFCF" }} />
            </Grid>
            <Grid item>
              <IconButton size="small">
                <img src={images.fast_forward_icon} />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton size="small">
                <img src={images.back_btn} />
              </IconButton>
            </Grid>
            <Grid item>
              <div style={{ height: "1px", width: "15px", background: "#CFCFCF" }} />
            </Grid>
            <Grid item>
              <IconButton size="small">
                <img src={images.next_btn} />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton size="small">
                <img src={images.fast_forward_icon1} />
              </IconButton>
            </Grid>
            <Grid item>
              <span className="paging">01-10</span>
            </Grid>
            <Grid item>
              <div style={{ height: "40px", width: "1px", background: "#CFCFCF" }} />
            </Grid>
            <Grid item>
              <IconButton size="small">
                <img src={images.bell} />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </div>
  )
}

export default ClinicalNav;
