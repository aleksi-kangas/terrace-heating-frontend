import React from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import {
  Card, CardActions, CardContent, CircularProgress, Grid, Switch, Typography,
} from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import SchedulingPanel from './SchedulingPanel';
import { removeNotification, setNotification } from '../../reducers/notificationReducer';
import HeatPumpService from '../../services/heatPump';
import { updateScheduling } from '../../reducers/scheduleReducer';

/**
 * Custom styling.
 */
const useStyles = makeStyles({
  container: {
    padding: 50,
  },
  card: {
    margin: 20,
  },
  shadow: {
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
});

/**
 * Represents the control page as a whole.
 * Responsible for rendering schedule panels for variables 'lowerTank' and 'heatDistCircuit3'.
 */
const Schedules = ({
  setNotification, removeNotification, schedule, updateScheduling,
}) => {
  const classes = useStyles();

  /**
   * Handler for enabling and disabling schedules.
   * Sends the state to the server.
   */
  const handleScheduleToggle = async () => {
    await HeatPumpService.setScheduling(!schedule.scheduling);
    updateScheduling(!schedule.scheduling);
    const message = schedule.scheduling ? 'Scheduling disabled' : 'Scheduling enabled';
    const type = schedule.scheduling ? 'info' : 'success';
    setNotification(message, type);
    setTimeout(() => {
      removeNotification();
    }, 5000);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Card className={clsx(classes.card, classes.shadow)}>
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
                    className={classes.switchButton}
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
      <Grid container justify="center">
        <Grid container item lg={4} justify="center">
          <SchedulingPanel variable="lowerTank" title="Lower Tank" />
        </Grid>
        <Grid container item lg={4} justify="center">
          <SchedulingPanel variable="heatDistCircuit3" title="Circuit 3" />
        </Grid>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  schedule: state.schedule,
});

export default connect(mapStateToProps,
  { setNotification, removeNotification, updateScheduling })(Schedules);
