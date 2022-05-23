import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useLocation, useHistory } from 'react-router-dom';

import { CustomTextBox } from "components/forms";
import { images } from 'utils/constants';
import RootContext from 'utils/context/RootContext';
import { useIntl } from 'react-intl';
import { services } from 'utils/services';
import { getFormBody, validationRule } from 'utils/global';

const ChangePasswordByCode = (props: any) => {
  const { handleSubmit, formState: { errors }, control, watch } = useForm({ mode: 'all' });
  const { formatMessage } = useIntl();
  const { toastMessage } = useContext<any>(RootContext);
  const location = useLocation<any>();
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState("password");
  const [confirmPasswordInputType, setConfirmPasswordInputType] = useState("password");

  let queryData = location.search ?? {};
  const code = new URLSearchParams(queryData).get('code');

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);

    bodyData = {
      ...bodyData,
      code: code
    }
    setLoading(true);
    services.changePasswordByCode(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          toastMessage(formatMessage({ id: "update-message" }));
          history.push('/login');
        } else {
          toastMessage(res.data?.message, 'error');
        }
      })
      .catch((err) => {
        setLoading(false);
        toastMessage(err.message, 'error');
      })
  }

  return (
    <>
      <Grid container style={{ display: "flex", justifyContent: "Center", background: "white", height: "100vh" }}>
        <Grid item xs={12} lg={4} md={4} sm={6}>
          <Box display="flex" flexDirection="column" p={6}>
            <Box mt={1} mb={4} justifyContent="center" display="flex">
              <img style={{ height: '90px' }} alt="app-logo" src={images.appLogo} />
            </Box>
            <Typography variant="h6" style={{ display: "flex", justifyContent: "Center" }}>{formatMessage({ id: "forgot-password" })}</Typography>
            <CustomTextBox
              label={formatMessage({ id: "user-name" })}
              name="userName"
              control={control}
              error={errors.userName}
              rules={validationRule.textbox({ required: true })}
              autoComplete="off"
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
              label={formatMessage({ id: "new-password" })}
              name="newPassword"
              control={control}
              error={errors.newPassword}
              type={inputType}
              rules={{
                ...validationRule.textbox({ required: true, type: 'passwordPolicy' }),
                validate: (value: any) => (watch('confirmPassword') ? (watch('confirmPassword') === value) : true) || formatMessage({ id: "password-confirm-validation-message" })
              }}
              autoComplete="off"
              margin="normal"
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
            <CustomTextBox
              label={formatMessage({ id: "confirm-password" })}
              name="confirmPassword"
              control={control}
              type={confirmPasswordInputType}
              error={errors.confirmPassword}
              rules={{
                ...validationRule.textbox({ required: true, type: 'passwordPolicy' }),
                validate: (value: any) => (watch('newPassword') ? (watch('newPassword') === value) : true) || formatMessage({ id: "password-confirm-validation-message" })
              }}
              autoComplete="off"
              onKeyPress={e => {
                if (e.key === "Enter") {
                  handleSubmit(onSubmit)();
                }
              }}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Link className="cursorPointer inpt_back" onClick={() => {
                      setConfirmPasswordInputType(confirmPasswordInputType === "password" ? "text" : "password")
                    }}>
                      <img src={images.passwordIcon} />
                    </Link>
                  </InputAdornment>
                )
              }}
            />
            <span className="passwordPolicy">
              <Typography variant="h6">{formatMessage({ id: "password-policy" })}</Typography>
              {formatMessage({ id: "password-policy-message" })}
            </span>
            <Box my={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
                fullWidth
                disabled={loading}
              >
                {loading ? "Please Wait..." : "Submit"}
              </Button >
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default ChangePasswordByCode;