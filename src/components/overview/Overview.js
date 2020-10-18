import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfoPanel from './InfoPanel.js';
import Alerts from './Alerts.js';

const useStyles = makeStyles({
  container: {
    margin: 50,
  },
  panel: {
    margin: 50,
  }

});

const Overview = ({ data }) => {
  const classes = useStyles();

  return (
    <Grid container direction='column' className={classes.container}>
      <Grid container className={classes.panel}>
        <Grid item component={Paper}>
          <InfoPanel data={data}/>
        </Grid>
      </Grid>
      <Grid container className={classes.panel}>
        <Grid item component={Paper}>

        </Grid>
      </Grid>
    </Grid>
  )
};

export default Overview;