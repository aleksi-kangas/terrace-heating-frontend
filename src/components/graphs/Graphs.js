import React, { useState } from 'react';
import { Grid, Paper } from '@material-ui/core';
import TimeControlGroup from './TimeControlGroup.js';
import { makeStyles } from '@material-ui/core/styles';
import GraphSelector from './GraphSelector.js';

const useStyles = makeStyles({
  container: {
    margin: 50,
    padding: 30,
  },
});


const Graphs = ({ data }) => {
  // Dynamic time range that changes when zooming the chart
  const [currentTimeRange, setTimeRange] = useState(null);

  const classes = useStyles();

  return (
    <Grid container direction='column' component={Paper} className={classes.container}>
      <Grid item>
        <GraphSelector data={data} currentTimeRange={currentTimeRange} setTimeRange={setTimeRange}/>
      </Grid>
      {
        /*
        <Grid item>
        <TimeControlGroup data={data} currentTimeRange={currentTimeRange} setTimeRange={setTimeRange}/>
        </Grid>
         */
      }
    </Grid>
  )

};

export default Graphs;