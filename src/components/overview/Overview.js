import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import StatusPanel from './StatusPanel.js';
import UsagePanel from './UsagePanel.js';

const useStyles = makeStyles({
  container: {
    padding: 50,
  }
});

const Overview = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Grid container justify='center'>
        <StatusPanel/>
      </Grid>
      <Grid container justify='center'>
        <UsagePanel/>
      </Grid>
    </Grid>
  )
};

export default Overview;
