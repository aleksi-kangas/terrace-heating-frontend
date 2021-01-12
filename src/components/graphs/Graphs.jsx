import React, { useState } from 'react';
import moment from 'moment';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  Grid, Paper, Tab, Tabs,
} from '@material-ui/core';
import { Link, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import LineChart from './LineChart';

const useStyles = makeStyles({
  tabs: {
    marginBottom: 10,
    borderRadius: 10,
    background: '#5796f5',
    color: 'white',
  },
  graph: {
    padding: 10,
  },
  container: {
    padding: 50,
  },
  shadow: {
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
});

const graphVariables = [
  {
    title: 'Heat Distribution Circuits',
    variables: [
      { label: 'Heat Distribution Circuit 1', id: 'heatDistCircuitTemp1' },
      { label: 'Heat Distribution Circuit 2', id: 'heatDistCircuitTemp2' },
      { label: 'Heat Distribution Circuit 3', id: 'heatDistCircuitTemp3' },
    ],
  },
  {
    title: 'General Temperatures',
    variables: [
      { label: 'Inside', id: 'insideTemp' },
      { label: 'Outside', id: 'outsideTemp' },
      { label: 'Hot Gas', id: 'hotGasTemp' },
      { label: 'Compressor Usage', id: 'compressorUsage' },
    ],
  },
  {
    title: 'Ground-loop and Tanks',
    variables: [
      { label: 'Ground-loop Input', id: 'groundLoopTempInput' },
      { label: 'Ground-loop Output', id: 'groundLoopTempOutput' },
      { label: 'Lower Tank', id: 'lowerTankTemp' },
      { label: 'Upper Tank', id: 'upperTankTemp' },
    ],
  },
];

const Graphs = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);

  const classes = useStyles();

  if (!data) return null;

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabCreator = () => graphVariables.map((graph, index) => <Tab key={graph.title} label={graph.title} component={Link} to={`/graphs/${index + 1}`} />);

  const graphCreator = () => {
    const xAxis = data.map((entry) => moment(entry.time));
    const graphs = graphVariables.map((graph, index) => <LineChart key={index + 1} variables={graph.variables} xAxis={xAxis} />);

    return (
      graphs.map((graph) => <Route key={graph.key} path={`/graphs/${graph.key}`} render={() => graph} />)
    );
  };

  return (
    <Grid container direction="column" className={classes.container}>
      <Grid item>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          centered
          variant="fullWidth"
          className={clsx(classes.tabs, classes.shadow)}
        >
          {tabCreator()}
        </Tabs>
      </Grid>
      <Grid item component={Paper} className={clsx(classes.graph, classes.shadow)}>
        {graphCreator()}
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(Graphs);
