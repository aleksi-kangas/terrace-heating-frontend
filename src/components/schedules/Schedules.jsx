import React from 'react';
import { connect } from 'react-redux';
import {
  Card, CardActions, CardContent, CircularProgress, Fade, Grid, Switch, Typography,
} from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import SchedulingPanel from './SchedulingPanel';
import { removeNotification, setNotification } from '../../reducers/notificationReducer';
import HeatPumpService from '../../services/heatPump';
import { updateScheduling } from '../../reducers/scheduleReducer';
import { setStatus } from '../../reducers/statusReducer';

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

/**
 * Represents the control page as a whole.
 * Responsible for rendering schedule panels for variables 'lowerTank' and 'heatDistCircuit3'.
 */
const Schedules = ({
  setNotification, removeNotification, schedule, updateScheduling, setStatus,
}) => {
  const classes = useStyles();

  /**
   * Handler for enabling and disabling schedules.
   * Sends the state to the server and updates the toggle switch accordingly.
   */
  const handleScheduleToggle = async () => {
    const newStatus = await HeatPumpService.setScheduling(!schedule.scheduling);
    if (newStatus) {
      updateScheduling(!schedule.scheduling);
      setStatus(newStatus);
      const message = schedule.scheduling ? 'Scheduling disabled' : 'Scheduling enabled';
      const type = schedule.scheduling ? 'info' : 'success';
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
              {schedule
                ? (
                  <Grid container item justify="center" alignItems="center">
                    <Switch
                      color="primary"
                      checked={schedule.scheduling}
                      onChange={handleScheduleToggle}
                      name="scheduleActiveToggle"
                    />
                    {schedule.scheduling
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
            <SchedulingPanel variable="lowerTank" title="Lower Tank" />
          </Grid>
          <Grid item md={12} lg={5}>
            <SchedulingPanel variable="heatDistCircuit3" title="Circuit 3" />
          </Grid>
        </Grid>
      </Grid>
    </Fade>
  );
};

const mapStateToProps = (state) => ({
  schedule: state.schedule,
});

export default connect(mapStateToProps,
  {
    setNotification, removeNotification, updateScheduling, setStatus,
  })(Schedules);
