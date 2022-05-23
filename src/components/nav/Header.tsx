import React, { useState, useEffect, useContext } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTheme } from '@material-ui/core/styles';
import { FormattedMessage, useIntl } from 'react-intl';

import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import Notifications from '@material-ui/icons/Notifications';

import { PopupTooltip } from '../PopupTooltip'
import { authReset, getMasterPaginationData, resetMasterPaginationData } from 'redux/actions';
import { setAuthHeader } from 'utils/global';

import HospitalIcon from '@material-ui/icons/LocalHospital';
import { RootReducerState } from 'utils/types';
import ClinicSelectionDialog from './ClinicSelectionDialog';
import { CustomIconButton } from 'components/button';
import { masterPaginationServices } from 'utils/constants';
import { services } from 'utils/services';
import { useToastMessage } from 'utils/hooks';
import { HoverLoader } from 'components';
import RootContext from 'utils/context/RootContext';

interface Props {
  toggleSideMenuOpen: () => void;
}

export function Header({ toggleSideMenuOpen }: Props) {
  const dispatch = useDispatch();

  const [logoutTooltipOpen, setLogoutTooltipOpen] = useState(false);
  const [notificationTooltipOpen, setNotificationTooltipOpen] = useState(false);
  const [clinicDialogOpen, setClinicDialogOpen] = useState(false);

  const { authData, selectedClinic, userTaskData } = useSelector(
    ({ utilityReducer, auth, masterPaginationReducer }: RootReducerState) => ({
      selectedClinic: utilityReducer.selectedClinic,
      userTaskData: masterPaginationReducer[masterPaginationServices.userAssignedTask].data,
      authData: auth.data
    }),
    shallowEqual
  );
  let taskCount = userTaskData.modelItems.filter((task: any) => !task.isCompleted).length;

  useEffect(() => {
    dispatch(getMasterPaginationData(masterPaginationServices.userAssignedTask, {}));
  }, [])

  const handleClickOpen = () => {
    setClinicDialogOpen(true);
  };

  const handleClose = () => {
    setClinicDialogOpen(false);
  };

  let selectedClinicData = authData?.clinics?.find((clinic: any) => +clinic.clinicId === +selectedClinic)?.clinicName ?? "";

  return (
    <Toolbar>
      <Grid
        justify="space-between"
        alignItems="center"
        container
      >
        <Grid item>
          <IconButton onClick={toggleSideMenuOpen} edge="start" color="inherit" aria-label="menu">
            <MenuIcon color="primary" />
          </IconButton>

          <Button
            endIcon={<HospitalIcon color="primary" />}
            style={{ marginLeft: "15px" }}
            variant="outlined"
            color="primary"
            onClick={handleClickOpen}
          >
            {selectedClinicData}
          </Button>
        </Grid>

        <Grid item>
          <Grid container spacing={2}>
            <Grid item>
              <Badge badgeContent={taskCount} color="secondary">
                <PopupTooltip
                  content={<NotificationPopup />}
                  open={notificationTooltipOpen}
                  placement="bottom-end"
                  onClose={() => setNotificationTooltipOpen(false)}
                  style={{ marginTop: "10px" }}
                >
                  <CustomIconButton onClick={() => setNotificationTooltipOpen(!logoutTooltipOpen)}>
                    <Notifications color="primary" />
                  </CustomIconButton>
                </PopupTooltip>
              </Badge>
            </Grid>


            <Grid item>
              <PopupTooltip
                content={<Actionpopup />}
                open={logoutTooltipOpen}
                placement="bottom-end"
                onClose={() => setLogoutTooltipOpen(false)}
                style={{ marginTop: "10px" }}
              >
                <CustomIconButton onClick={() => setLogoutTooltipOpen(!logoutTooltipOpen)}>
                  <AccountCircle color="primary" />
                </CustomIconButton>
              </PopupTooltip>
            </Grid>
          </Grid>
        </Grid>

      </Grid>

      <ClinicSelectionDialog
        open={clinicDialogOpen}
        onClose={handleClose}
      />
    </Toolbar>
  );
}


const Actionpopup = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { toastMessage } = useContext<any>(RootContext);

  const { authData } = useSelector(
    ({ auth }: RootReducerState) => ({
      authData: auth.data
    }),
    shallowEqual
  );

  async function onLogout() {
    const parms = { refreshToken: authData?.refresh_token };
    services.logoutUser(parms)
      .then((res) => {
        if (res?.data) {
          setAuthHeader();
          dispatch(authReset());
          dispatch(resetMasterPaginationData());
        } else {
          toastMessage(res?.data?.message, 'error');
        }
      })
      .catch((err) => {
        toastMessage(err.message, 'error');
      })
  }

  return (
    <div>
      <ListItem button onClick={onLogout}>
        <ListItemIcon>
          <AccountCircle color="primary" />
        </ListItemIcon>
        <ListItemText primary="logout" />
      </ListItem>

      <ListItem button onClick={() => {
        history.push('/security/change-password');
      }}>
        <ListItemText primary="Change Password" />
      </ListItem>
    </div>
  )
}


const NotificationPopup = () => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const { toastMessage } = useToastMessage();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const { userTaskData } = useSelector(
    ({ masterPaginationReducer }: RootReducerState) => ({
      userTaskData: masterPaginationReducer[masterPaginationServices.userAssignedTask].data,
    }),
    shallowEqual
  );
  let taskList = userTaskData.modelItems;

  function onRefreshTask() {
    dispatch(getMasterPaginationData(masterPaginationServices.userAssignedTask, {}));
  }

  function onMarkComplete(taskData: any) {
    let bodyData = { ...taskData, isCompleted: true };
    setLoading(true);
    services.updateTask(bodyData)
      .then((res) => {
        setLoading(false);
        if (res.data?.succeeded) {
          onRefreshTask();
          toastMessage(formatMessage({ id: "task-maked-as-complete" }));
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
    <div style={{ width: "350px", minHeight: "220px", maxHeight: "300px", overflowY: "auto" }}>

      <div style={{ padding: "10px" }}>
        <span className="text-15 font-medium">Tasks:</span>
      </div>

      <div className="line" />

      {taskList.map((task: any) => (
        <React.Fragment key={task.id}>
          <div style={{ padding: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: 1 }}>
                <span className="text-13 font-medium" style={{ color: theme.palette.primary.main }}>{task.taskReasonName}</span>
                <div style={{ wordBreak: "break-word" }}>
                  {task?.taskRemark && <span className="text-12 font-regular" style={{ color: theme.palette.primary.main }}>{task.taskRemark}</span>}
                </div>
              </div>
              {!task.isCompleted && (
                <div onClick={() => onMarkComplete(task)} style={{ cursor: "pointer" }}>
                  <Tooltip title={formatMessage({ id: "mark-as-complete" })}>
                    <CheckCircleOutline fontSize="small" htmlColor={theme.palette.primary.main} />
                  </Tooltip>
                </div>
              )}
            </div>

            <span className="text-12 font-regular">Assigned by: {task?.createdByUserDisplayName}</span>
            <span className="text-12 font-regular">Status: <span style={{ color: theme.palette?.[task.isCompleted ? 'success' : "secondary"].main }}>{task.isCompleted ? "Completed" : "Pending"}</span></span>
            <span className="text-11 font-medium" style={{ color: "#acacac" }}><FormattedMessage id="timeline" />: {dayjs(task.taskCompletionDate).format('ddd MMM D, YYYY')}</span>
          </div>
          <hr style={{ margin: "0px", padding: "0px" }} />
        </React.Fragment>
      ))}

      {taskList.length === 0 && (
        <span className="text-14 font-medium" style={{ margin: "10px", color: "#acacac", textAlign: "center" }}>
          <FormattedMessage id="no-records-found" />
        </span>
      )}

      {loading && <HoverLoader />}
    </div>
  )
}