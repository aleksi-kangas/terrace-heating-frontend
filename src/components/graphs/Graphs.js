import React, { useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import LineChart from './LineChart.js';
import { Container, Grid, Paper, Tab, Tabs } from '@material-ui/core';
import { Link, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  tabs: {
    borderRadius: 10,
    marginBottom: 10,
    marginTop: 10,
    background: '#5390fe',
    color: 'white',
  },
  container: {
    marginTop: 20,
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0'
  }
});

const graphVariables = [
  {
    title: 'Heat Distribution Circuits',
    variables: [
      { label: 'Heat Distribution Circuit 1', id: 'heatDistCircuitTemp1' },
      { label: 'Heat Distribution Circuit 2', id: 'heatDistCircuitTemp2' },
      { label: 'Heat Distribution Circuit 3', id: 'heatDistCircuitTemp3' },
    ]
  },
  {
    title: 'General Temperatures',
    variables: [
      { label: 'Inside', id: 'insideTemp' },
      { label: 'Outside', id: 'outsideTemp' },
      { label: 'Hot Gas', id: 'hotGasTemp' },
      { label: 'Compressor Usage', id: 'compressorUsage' },
    ]
  },
  {
    title: 'Ground-loop and Tanks',
    variables: [
      { label: 'Ground-loop Input', id: 'groundLoopTempInput'},
      { label: 'Ground-loop Output', id: 'groundLoopTempOutput'},
      { label: 'Lower Tank', id: 'lowerTankTemp'},
      { label: 'Upper Tank', id: 'upperTankTemp'},
    ]
  }
];

const Graphs = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);

  const classes = useStyles();

  if (!data) return null;

  const handleChange = (event, newValue) => {
    setActiveTab(newValue)
  };

  const tabCreator = () => {
    return graphVariables.map((graph, index) =>
      <Tab key={graph.title} label={graph.title} component={Link} to={`/graphs/${index + 1}`}/>
    )
  };

  const graphCreator = () => {
    const xAxis = data.map(entry => moment(entry.time));
    const graphs = graphVariables.map((graph, index) =>
      <LineChart key={index + 1} variables={graph.variables} xAxis={xAxis}/>
    );

    return (
      graphs.map((graph) =>
        <Route key={graph.key} path={`/graphs/${graph.key}`} render={() => graph}/>
      )
    )
  };

  return (
    <Container component={Paper} className={classes.container}>
      <Grid container direction='column'>
        <Grid item>
          <Tabs
            value={activeTab}
            onChange={handleChange}
            centered
            variant='fullWidth'
            className={classes.tabs}
          >
            {tabCreator()}
          </Tabs>
        </Grid>
        <Grid item>
          {graphCreator()}
        </Grid>
      </Grid>
    </Container>
  )
};

const mapStateToProps = (state) => {
  return {
    data: state.data.data
  }
};

export default connect(mapStateToProps)(Graphs);
