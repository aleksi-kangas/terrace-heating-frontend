import React from 'react';
import { connect } from 'react-redux';
import {
  Card, CardActions, CardContent, CircularProgress, Fade, Grid, Switch, Typography,
} from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import SchedulingPanel from './SchedulingPanel';
import { setHeatingStatusAction, setSchedulingEnabledAction } from '../../reducers/heatPumpReducer';
import { removeNotificationAction, setNotificationAction } from '../../reducers/notificationReducer';
import HeatPumpService from '../../services/heatPump';
import { HeatingStatus, NotificationType, ScheduleVariable } from '../../types';
import { State } from '../../store';

/**
 * Custom styling.
 */
const useStyles = makeStyles({
  container: {
    margin: 20,
  },
  scheduleToggleCard: {
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
});

type SchedulesProps = {
  schedulingEnabled: boolean,
  setHeatingStatus: (heatingStatus: HeatingStatus) => void,
  setSchedulingEnabled: (schedulingEnabled: boolean) => void,
  setNotification: (message: string, type: NotificationType) => void,
  removeNotification: () => void,
}

/**
 * Represents the control page as a whole.
 * Responsible for rendering schedule panels for variables 'lowerTank' and 'heatDistCircuit3'.
 */
const Schedules = ({
  schedulingEnabled, setHeatingStatus, setSchedulingEnabled, setNotification, removeNotification,
}: SchedulesProps) => {
  const classes = useStyles();

  /**
   * Handler for enabling and disabling schedules.
   * Sends the state to the server and updates the toggle switch accordingly.
   */
  const handleScheduleToggle = async () => {
    const newStatus = await HeatPumpService.setSchedulingEnabled(!schedulingEnabled);
    if (newStatus) {
      setSchedulingEnabled(!schedulingEnabled);
      setHeatingStatus(newStatus);
      const message = schedulingEnabled ? 'Scheduling disabled' : 'Scheduling enabled';
      const type = schedulingEnabled ? NotificationType.Info : NotificationType.Success;
      setNotification(message, type);
      setTimeout(() => {
        removeNotification();
      }, 5000);
    }
  };

  return (
    <Fade in timeout={800}>
      <Grid container direction="column" alignItems="center" justify="center">
        <Card className={classes.scheduleToggleCard}>
          <CardContent>
            <Typography variant="h5">
              Scheduling
            </Typography>
          </CardContent>
          <CardActions>
            <Grid container item justify="center" alignItems="center">
              {schedulingEnabled != null
                ? (
                  <Grid container item justify="center" alignItems="center">
                    <Switch
                      color="primary"
                      checked={schedulingEnabled}
                      onChange={handleScheduleToggle}
                      name="scheduleActiveToggle"
                    />
                    {schedulingEnabled
                      ? <CheckCircleOutlineIcon color="primary" />
                      : <CloseIcon />}
                  </Grid>
                )
                : <CircularProgress />}
            </Grid>
          </CardActions>
        </Card>
        <Grid container justify="space-around">
          <Grid item md={12} lg={5}>
            <SchedulingPanel variable={ScheduleVariable.LowerTank} title="Lower Tank" />
          </Grid>
          <Grid item md={12} lg={5}>
            <SchedulingPanel variable={ScheduleVariable.HeatDistCircuit3} title="Circuit 3" />
          </Grid>
        </Grid>
      </Grid>
    </Fade>
  );
};

const mapStateToProps = (state: State) => ({
  schedulingEnabled: state.heatPump.schedulingEnabled,
});

export default connect(mapStateToProps,
  {
    setHeatingStatus: setHeatingStatusAction,
    setSchedulingEnabled: setSchedulingEnabledAction,
    setNotification: setNotificationAction,
    removeNotification: removeNotificationAction,
  })(Schedules);
