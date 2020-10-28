import React, { useState } from 'react';
import { Grid, Paper, Tab, Tabs } from '@material-ui/core';
import TimeControlGroup from './TimeControlGroup.js';
import { makeStyles } from '@material-ui/core/styles';
import LineGraph from './LineGraph.js';

const useStyles = makeStyles({
  container: {
    margin: 50,
    padding: 30,
  },
  tabs: {
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    background: 'gray',
  }
});

const variables = [
  {
    title: 'Head Distribution Circuits',
    columns: [
      { label: 'Heat Distribution Circuit 1', id: 'heatDistCircuitTemp1' },
      { label: 'Heat Distribution Circuit 2', id: 'heatDistCircuitTemp2' },
      { label: 'Heat Distribution Circuit 3', id: 'heatDistCircuitTemp3' },
    ],
  },
  {
    title: 'General Temperatures',
    columns: [
      { label: 'Inside °C', id: 'insideTemp' },
      { label: 'Outside °C', id: 'outsideTemp' },
    ],
  },
];


const Graphs = ({ data }) => {
  // Dynamic time range that changes when zooming the chart
  const [currentTimeRange, setTimeRange] = useState(null);
  const [activeGraph, setActiveGraph] = useState(0);

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setActiveGraph(newValue)
  };

  const tabContent = (
    variables.map((graph, index) =>
      <LineGraph
        key={index}
        hidden={activeGraph !== index}
        data={data}
        columns={graph.columns}
        graphId={graph.title}
        graphTitle={graph.title}
        currentTimeRange={currentTimeRange}
        setCurrentTimeRange={setTimeRange}
      />
    )
  );

  const tabTitles = (
    <Tabs
      value={activeGraph}
      onChange={handleChange}
      centered
      className={classes.tabs}
      variant='fullWidth'
    >
      {variables.map((graph) => {
        return (
          <Tab key={graph.title} label={graph.title}/>
        )
      })}
    </Tabs>
  );

  return (
    <Grid item component={Paper} className={classes.container}>
      <Grid item className={classes.tabs}>
        {tabTitles}
      </Grid>
      <Grid item>
        {tabContent}
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