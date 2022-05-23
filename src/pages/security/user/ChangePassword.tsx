
import { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useForm } from 'react-hook-form';
import InputAdornment from '@material-ui/core/InputAdornment';
import { FormattedMessage, useIntl } from "react-intl";

import { images } from 'utils/constants';
import { CustomTextBox } from 'components/forms';
import { HoverLoader } from 'components';
import { getFormBody, validationRule } from 'utils/global';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';

export default function ChangePassword() {
  const { handleSubmit, formState: { errors }, control, reset, watch } = useForm({ mode: 'all' });
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const [loading, setLoading] = useState(false);
  const [inputOldPasswordType, setInputOldPasswordType] = useState("password");
  const [inputNewPasswordType, setInputNewPasswordType] = useState("password");
  const [inputConfirmPasswordType, setInputConfirmPasswordType] = useState("password");

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    bodyData = {
      ...bodyData
    }
    setLoading(true);
    services.changePassword(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          toastMessage(formatMessage({ id: "change-password-message" }));
          reset()
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
      <Box my={4} className="container">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper elevation={2}>
              <Box p={1}>
                <h3 className="formHeading">
                  <FormattedMessage id="change-password" />
                </h3>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={4} md={6} sm={12}>
            <Paper elevation={1}>
              <Box p={4}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <CustomTextBox
                      label={formatMessage({ id: "user-name" })}
                      name="userName"
                      control={control}
                      error={errors.userName}
                      rules={validationRule.textbox({ required: true })}
                      autoComplete="off"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end" >
                            <span className="inpt_back"><img src={images.userIcon} /></span>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextBox
                      label={formatMessage({ id: "current-password" })}
                      name="oldPassword"
                      control={control}
                      error={errors.oldPassword}
                      rules={{
                        ...validationRule.textbox({ required: true, type: 'passwordPolicy' })
                      }}
                      type={inputOldPasswordType}
                      autoComplete="off"

                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Link className="cursorPointer inpt_back" onClick={() => {
                              setInputOldPasswordType(inputOldPasswordType === "password" ? "text" : "password")
                            }}>
                              <img src={images.passwordIcon} />
                            </Link>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextBox
                      label={formatMessage({ id: "new-password" })}
                      name="newPassword"
                      control={control}
                      error={errors.newPassword}
                      type={inputNewPasswordType}
                      rules={{
                        ...validationRule.textbox({ required: true, type: 'passwordPolicy' }),
                        validate: (value: any) => (watch('confirmPassword') ? (watch('confirmPassword') === value) : true) || formatMessage({ id: "password-confirm-validation-message" })
                      }}
                      autoComplete="off"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Link className="cursorPointer inpt_back" onClick={() => {
                              setInputNewPasswordType(inputNewPasswordType === "password" ? "text" : "password")
                            }}>
                              <img src={images.passwordIcon} />
                            </Link>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <CustomTextBox
                      label={formatMessage({ id: "confirm-password" })}
                      name="confirmPassword"
                      control={control}
                      error={errors.confirmPassword}
                      type={inputConfirmPasswordType}
                      rules={{
                        ...validationRule.textbox({ required: true, type: 'passwordPolicy' }),
                        validate: (value: any) => (watch('newPassword') ? (watch('newPassword') === value) : true) || formatMessage({ id: "password-confirm-validation-message" })

                      }}
                      autoComplete="off"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Link className="cursorPointer inpt_back" onClick={() => {
                              setInputConfirmPasswordType(inputConfirmPasswordType === "password" ? "text" : "password")
                            }}>
                              <img src={images.passwordIcon} />
                            </Link>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} className="passwordPolicy">
                    <span>
                      <Typography variant="h6">{formatMessage({ id: "password-policy" })}</Typography>
                      {formatMessage({ id: "password-policy-message" })}
                    </span>
                  </Grid>
                  <Grid item xs={12}>
                    <Box pt={1} style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
                        <FormattedMessage id="change-password" />
                      </Button >
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      {loading && <HoverLoader />}
    </>
  )
}
