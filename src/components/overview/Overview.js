import React from 'react';
import { Container, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfoPanel from './InfoPanel.js';
import StatusPanel from './StatusPanel.js';

const useStyles = makeStyles({
  container: {
    margin: 50,
    padding: 20,
    background: 'lightgray'
  },
});

const Overview = ({ data }) => {
  const classes = useStyles();

  return (
    <Container>
      <Grid item component={Paper} className={classes.container}>
        <InfoPanel data={data}/>
      </Grid>
      <Grid item component={Paper} className={classes.container}>
        <StatusPanel data={data}/>
      </Grid>
    </Container>
  )
};

export default Overview;