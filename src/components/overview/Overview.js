import React from 'react';
import { Container, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TemperaturePanel from './TemperaturePanel.js';
import StatusPanel from './StatusPanel.js';
import UsagePanel from './UsagePanel.js';

const useStyles = makeStyles({
  container: {
    margin: 20,
    padding: 10,
    height: '300px'
  },
});

const Overview = () => {
  const classes = useStyles();

  return (
    <Container>
      <Grid container justify='center'>
        <Grid item container component={Paper} className={classes.container}>
          STATUSPANEL
        </Grid>
      </Grid>
      <Grid container justify='center'>
        <UsagePanel/>
      </Grid>
    </Container>
  )
};

export default Overview;
