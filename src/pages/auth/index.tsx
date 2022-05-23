import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';

import { CustomTextBox } from "components/forms";
import { images } from 'utils/constants';
import { login, authReset } from "redux/actions";
import { RootReducerState } from 'utils/types';
import { ForgotPassword } from './ForgotPassword';
import { useIntl } from 'react-intl';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { PrimaryButton } from 'components/button';
import { AuthActiveSessionDialog } from 'components';


const useStyles = makeStyles((theme) => ({
  root: {
    height: '83vh',
  },
}));


const Login = (props: any) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loadingForgotPassword, setLoadingForgotPassword] = useState(false);
  const [activeSessionPopupOpen, setActiveSessionPopupOpen] = useState(false);
  const [inputType, setInputType] = useState("password");
  const [formData, setFormData] = useState({});
  const [isAuthStatusCached, setIsAuthStatusCached] = useState<null | boolean>(null);

  const { loading, authData, authStatus } = useSelector(
    ({ auth }: RootReducerState) => ({
      loading: auth.loading,
      authData: auth.data,
      authStatus: auth.status
    }),
    shallowEqual
  );

  useEffect(() => {
    setIsAuthStatusCached(authStatus === 470);
  }, []);

  useEffect(() => {
    if (authStatus === 470 && isAuthStatusCached === false) {
      setActiveSessionPopupOpen(true);
    }
  }, [authStatus]);

  useEffect(() => {
    if (authData?.access_token) {
      history.replace('/');
    } else if (loading) {
      dispatch(authReset());
    }
  }, [history])

  async function onSubmit(data: any) {
    let requestBody = { ...data, closeActiveToken: false };
    setFormData(requestBody);
    setIsAuthStatusCached(false);
    dispatch(login(requestBody, toastMessage));
  }

  function handleForgotPassword(username: any) {
    const bodyData = {
      username: username
    }
    setLoadingForgotPassword(true);
    services.forgotPassword(bodyData)
      .then((res) => {
        setLoadingForgotPassword(false);
        if (res.data?.succeeded) {
          toastMessage(formatMessage({ id: "email-send-message" }));
          handleClose();
        } else {
          toastMessage(res.data?.message, 'error');
        }
      })
      .catch((err) => {
        setLoadingForgotPassword(false);
        toastMessage(err.message, 'error');
      })
  }

  function handleClose() {
    setShowForgotPassword(false);
  }

  function onDisAgreeActiveSession() {
    setActiveSessionPopupOpen(false);
    setFormData({});
    toastMessage("User can only have one active session.", 'error');
  }

  function onAgreeActiveSession() {
    setActiveSessionPopupOpen(false);
    let requestBody = { ...formData, closeActiveToken: true };
    dispatch(login(requestBody, toastMessage));
  }


  return (
    <>
      <div className={classes.root} id="main_login_area">
        <Grid container component="main" spacing={3} item xs={false} md={12} sm={12} >
          <Grid item xs={12} md={5} sm={12} className="main_login_form">

            <Box display="flex" flexDirection="column" p={6}>
              <img className="logo_art" src={images.artFertilityLogo} />
              <h1>{formatMessage({ id: "welcome-message" })}</h1>
              <CustomTextBox
                label="User Name"
                error={errors.username}
                name="username"
                rules={{ required: true }}
                control={control}
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" >
                      <span className="inpt_back"><img src={images.userIcon} /></span>
                    </InputAdornment>
                  )
                }}
              />

              <CustomTextBox
                label="Password"
                type={inputType}
                error={errors.password}
                name="password"
                rules={{ required: true }}
                control={control}
                margin="normal"
                onKeyPress={e => {
                  if (e.key === "Enter") {
                    handleSubmit(onSubmit)();
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Link className="cursorPointer inpt_back" onClick={() => {
                        setInputType(inputType === "password" ? "text" : "password")
                      }}>
                        <img src={images.passwordIcon} />
                      </Link>
                    </InputAdornment>
                  )
                }}
              />

              <Box my={2}>
                <PrimaryButton
                  onClick={handleSubmit(onSubmit)}
                  disabled={loading}
                  label={loading ? "Please Wait..." : "Login"}
                  fullWidth
                />
              </Box>
              <Link component="button" variant="body1" onClick={() => { setShowForgotPassword(true) }}>
                Forgot password?
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={7} sm={12} className="main_login_image">
            <div className="big_circle_area transition">
              <div className="big_circle transition">
                <img className="main_image_login transition" alt="Login Banner" src={images.loginBanner} />
                <div className="small_blue_circle transition"></div>
                <div className="small_circle transition"></div>
              </div>
            </div>
          </Grid>
        </Grid>
        <p className="copyright">{formatMessage({ id: "copyright-message" })}</p>
      </div>

      {showForgotPassword &&
        <ForgotPassword
          open={showForgotPassword}
          onClose={handleClose}
          handleForgotPassword={handleForgotPassword}
          loading={loadingForgotPassword}
        />
      }

      <AuthActiveSessionDialog
        open={activeSessionPopupOpen}
        onDisagree={onDisAgreeActiveSession}
        onAgree={onAgreeActiveSession}
      />

    </>
  );
}


export default Login;