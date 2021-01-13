import React, { useState } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import {
  Card, CardActions, CardContent, Grid, Switch, Typography,
} from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import SchedulingPanel from './SchedulingPanel';
import { removeNotification, setNotification } from '../../reducers/notificationReducer';

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
const Control = ({ setNotification, removeNotification }) => {
  const [scheduleActive, setScheduleActive] = useState(false);
  const classes = useStyles();

  /**
   * Handler for enabling and disabling schedules.
   * Sends the state to the server.
   */
  const handleScheduleToggle = () => {
    // TODO
    setScheduleActive(!scheduleActive);
    const message = scheduleActive ? 'Scheduling disabled' : 'Scheduling enabled';
    const type = scheduleActive ? 'info' : 'success';
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
            <Switch
              className={classes.switchButton}
              color="primary"
              checked={scheduleActive}
              onChange={handleScheduleToggle}
              name="scheduleActiveToggle"
            />
            {scheduleActive ? <CheckCircleOutlineIcon color="primary" /> : <CloseIcon />}
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

export default connect(null, { setNotification, removeNotification })(Control);
