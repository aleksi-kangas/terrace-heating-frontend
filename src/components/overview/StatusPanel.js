import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Card, CardContent, CircularProgress, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { useSocket } from 'use-socketio';
import heatPumpService from '../../services/heatPump.js';

const useStyles = makeStyles({
  card: {
    margin: 20,
    width: 200,
  },
  loading: {
    borderBottom: '10px solid rgba(100, 100, 100, 0.5)'
  },
  active: {
    borderBottom: '10px solid rgba(0, 150, 0, 0.5)',
  },
  stopped: {
    borderBottom: '10px solid rgba(150, 0, 0, 0.5)',
  },
  header: {
    margin: 10,
  }
});

const StatusPanel = ({ data }) => {
  const [latestUpdate, setLatestUpdate] = useState(null);
  const [activeCircuits, setActiveCircuits] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    if (data) {
      setLatestUpdate(moment(data[data.length - 1].time).format('HH:mm'));
    }
  }, [data]);

  // Fetching active circuits
  useEffect(() => {
    heatPumpService
      .getActiveCircuits()
      .then(res => setActiveCircuits(res));
  }, []);

  useSocket('activeCircuits', activeCircuitsData => {
    setActiveCircuits(activeCircuitsData);
  });

  const statusColor = (circuitNumber) => {
    if (!activeCircuits) return classes.loading;

    if (circuitNumber === 3 && activeCircuits < 3) {
      return classes.stopped;
    } else {
      return classes.active;
    }
  };

  return (
    <Grid container direction='column'>
      <Typography variant='h4' align='center' className={classes.header}>Heat Distribution Status</Typography>
      <Grid item container justify='center'>
        <Grid item component={Card} className={clsx(classes.card, statusColor(1))}>
          <CardContent>
            <Typography variant='h5' align='center'>Circuit 1</Typography>
            <Typography color='textSecondary' align='center'>
              { activeCircuits ? 'Active' : <CircularProgress/> }
            </Typography>
          </CardContent>
        </Grid>
        <Grid item component={Card} className={clsx(classes.card, statusColor(2))}>
          <CardContent>
            <Typography variant='h5' align='center'>Circuit 2</Typography>
            <Typography color='textSecondary' align='center'>
              { activeCircuits ? 'Active' : <CircularProgress/> }
            </Typography>
          </CardContent>
        </Grid>
        <Grid item component={Card} className={clsx(classes.card, statusColor(3))}>
          <CardContent>
            <Typography variant='h5' align='center'>Circuit 3</Typography>
            <Typography color='textSecondary' align='center'>
              { activeCircuits ? (activeCircuits === 3 ? 'Active' : 'In-Active') : <CircularProgress/> }
            </Typography>
          </CardContent>
        </Grid>
        <Grid item component={Card} className={clsx(classes.card, statusColor(0))}>
          <CardContent>
            <Typography variant='h5' align='center'>Latest update</Typography>
            <Typography color='textSecondary' align='center'>
              {latestUpdate ? latestUpdate : <CircularProgress/>}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Grid>
  )
};

export default StatusPanel;