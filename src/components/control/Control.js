import React from 'react';
import { Grid } from '@material-ui/core';
import SchedulingPanel from './SchedulingPanel.js';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    padding: 50,
  }
});

const Control = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.container} justify='center'>
      <Grid container item lg={5} justify='center'>
        <SchedulingPanel variable='lowerTank' title='Lower Tank'/>
      </Grid>
      <Grid container item lg={5} justify='center'>
        <SchedulingPanel variable='heatDistCircuit3' title='Circuit 3'/>
      </Grid>
    </Grid>
  )
};

export default Control;
