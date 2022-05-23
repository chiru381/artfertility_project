import { useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import { useForm } from 'react-hook-form';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import { FormattedMessage } from "react-intl";

import { CustomTextBox } from 'components/forms';
import { images } from 'utils/constants/images'
import { getFormBody, validationRule } from 'utils/global';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  }
}));

interface Props {
  onClose: () => void;
  open: boolean;
  handleForgotPassword: (username: string) => void;
  loading: boolean;
}

const ForgotPassword = (props: Props) => {
  const { onClose, open, handleForgotPassword, loading } = props;
  const { handleSubmit, formState: { errors }, control } = useForm({ mode: 'all' });
  const { formatMessage } = useIntl();
  const classes = useStyles();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  function handleCloseDialog() {
    setShowPasswordModal(false);
    onClose();
  }

  function onSubmit(data: any) {
    let bodyData = getFormBody(data);
    handleForgotPassword(bodyData?.username);
  }

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" style={{ display: "flex", justifyContent: "Center" }}>
        {formatMessage({ id: "forgot-password" })}
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description" >
          <Grid container spacing={2} >
            <Box p={2}>
              <Grid item xs={12} style={{ display: "flex", justifyContent: "Center" }}>
                <img src={images.otpImage} />
              </Grid>
              <Grid item xs={12} style={{ display: "flex", justifyContent: "Center", marginBottom: "10px" }}>
                <b>{formatMessage({ id: "forgot-password-message" })}</b>
              </Grid>
              <Grid item xs={12}>
                <CustomTextBox
                  label={formatMessage({ id: "user-name" })}
                  name="username"
                  control={control}
                  error={errors.username}
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
                <Box pt={1} style={{ display: "flex", justifyContent: "Center" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                  >
                    {loading ? "Please Wait..." : "Submit"}
                  </Button >
                </Box>
              </Grid>
            </Box>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}

export { ForgotPassword }
