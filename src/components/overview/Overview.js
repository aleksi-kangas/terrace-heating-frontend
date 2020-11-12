import React from 'react';
import { Container, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TemperaturePanel from './TemperaturePanel.js';
import StatusPanel from './StatusPanel.js';

const useStyles = makeStyles({
  container: {
    margin: 50,
    padding: 20,
    background: 'lightgray'
  },
});

const Overview = () => {
  const classes = useStyles();

  return (
    <Container>
      <Grid item component={Paper} className={classes.container}>
        <TemperaturePanel/>
      </Grid>
      <Grid item component={Paper} className={classes.container}>
        <StatusPanel/>
      </Grid>
    </Container>
  )
};

export default Overview;