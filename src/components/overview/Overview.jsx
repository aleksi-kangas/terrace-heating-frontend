import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import OutsideTempPanel from './OutsideTempPanel';
import UsagePanel from './UsagePanel';
import TogglePanel from './TogglePanel';

const useStyles = makeStyles({
  container: {
    padding: 50,
  },
  row: {
    margin: 20,
    height: '250px',
  },
});

const Overview = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.container}>
      <Grid container item className={classes.row} justify="space-between">
        <OutsideTempPanel />
        <TogglePanel />
      </Grid>
      <Grid container item className={classes.row}>
        <UsagePanel />
      </Grid>
    </Grid>
  );
};

export default Overview;
