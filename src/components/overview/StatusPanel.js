import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Card, CardContent, CircularProgress, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

const useStyles = makeStyles({
  card: {
    margin: 20,
    width: 200,
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
      setActiveCircuits(data[data.length - 1].activeHeatDistCircuits);
    }
  }, [data]);


  return (
    <Grid container direction='column'>
      <Typography variant='h4' align='center' className={classes.header}>Heat Distribution Status</Typography>
      <Grid item container justify='center'>
        <Grid item component={Card} className={clsx(classes.card, classes.active)}>
          <CardContent>
            <Typography variant='h5' gutterBottom align='center'>Circuit 1</Typography>
            <Typography color='textSecondary' gutterBottom align='center' component={'span'}>
              { activeCircuits ? 'Active' : <CircularProgress/> }
            </Typography>
          </CardContent>
        </Grid>
        <Grid item component={Card} className={clsx(classes.card, classes.active)}>
          <CardContent>
            <Typography variant='h5' gutterBottom align='center'>Circuit 2</Typography>
            <Typography color='textSecondary' gutterBottom align='center' component={'span'}>
              { activeCircuits ? 'Active' : <CircularProgress/> }
            </Typography>
          </CardContent>
        </Grid>
        <Grid item component={Card} className={clsx(classes.card, activeCircuits < 3 ? classes.stopped : classes.active)}>
          <CardContent>
            <Typography variant='h5' gutterBottom align='center'>Circuit 3</Typography>
            <Typography color='textSecondary' gutterBottom align='center' component={'span'}>
              { activeCircuits === 3 ? 'Active' : 'Stopped' }
            </Typography>
          </CardContent>
        </Grid>
        <Grid item component={Card} className={clsx(classes.card, classes.active)}>
          <CardContent>
            <Typography variant='h5' gutterBottom align='center'>Latest update</Typography>
            <Typography color='textSecondary' gutterBottom align='center' component={'span'}>
              {latestUpdate ? latestUpdate : <CircularProgress/>}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </Grid>
  )
};

export default StatusPanel;