import React, { useEffect, useState } from 'react';
import moment from 'moment';
import clsx from 'clsx';
import { connect } from 'react-redux';
import {
  CircularProgress,
  Fade,
  Grid, Paper, Tab, Tabs,
} from '@material-ui/core';
import { Link, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import LineChart from './LineChart';
import TimeButtonGroup from './TimeButtonGroup';

/**
 * Custom styling.
 */
const useStyles = makeStyles({
  tabs: {
    marginBottom: 10,
    borderRadius: 10,
    background: '#2f4050',
  },
  tab: {
    color: '#bfbfbf',
  },
  graph: {
    padding: 10,
  },
  container: {
    padding: 50,
  },
  loading: {
    margin: 20,
    padding: 50,
  },
  shadow: {
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
});

/**
 * Predetermined variables to draw graphs for.
 */
const graphVariables = [
  {
    title: 'Outside Temperatures',
    variables: [
      { label: 'Outside', id: 'outsideTemp' },
      { label: 'Ground-loop Input', id: 'groundLoopTempInput' },
      { label: 'Ground-loop Output', id: 'groundLoopTempOutput' },
    ],
  },
  {
    title: 'Tank Temperatures',
    variables: [
      { label: 'Lower Tank', id: 'lowerTankTemp' },
      { label: 'Upper Tank', id: 'upperTankTemp' },
      { label: 'Hot Gas', id: 'hotGasTemp' },
    ],
  },
  {
    title: 'Heat Distribution Circuits',
    variables: [
      { label: 'Heat Distribution Circuit 1', id: 'heatDistCircuitTemp1' },
      { label: 'Heat Distribution Circuit 2', id: 'heatDistCircuitTemp2' },
      { label: 'Heat Distribution Circuit 3', id: 'heatDistCircuitTemp3' },
      { label: 'Inside', id: 'insideTemp' },
    ],
  },
];

/**
 * Represents the graphs page as a whole.
 * Responsible for drawing three different LineCharts in separate tabs.
 */
const Graphs = ({ data, dataTimePeriod, setDataTimePeriod }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [graphData, setGraphData] = useState(null);
  const [xAxisLimits, setAxisLimits] = useState(null);
  const [xAxis, setXAxis] = useState(null);

  const classes = useStyles();

  /**
   * Helper function for filtering data for graph.
   * Filters the given that and retains data for the given amount of days.
   * @param data to filter
   * @param days of data to retain
   */
  const createGraphData = (data, days) => {
    const startThreshold = moment(data[data.length - 1].time).subtract(days, 'days');
    const graphData = data.filter((entry) => startThreshold.isBefore(moment(entry.time)));
    const limits = {
      start: moment(graphData[0].time),
      end: moment(graphData[graphData.length - 1].time),
    };
    setXAxis(graphData.map((entry) => moment(entry.time)));
    setGraphData(graphData);
    setAxisLimits(limits);
  };

  useEffect(() => {
    if (data && !graphData) {
      // Create graph data initially
      createGraphData(data, 2);
    }
  }, [data]);

  if (!graphData) {
    return (
      <Grid container className={classes.container} justify="center">
        <Grid item component={Paper} className={clsx(classes.graph, classes.shadow)}>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  /**
   * Handler for changing the active tab.
   */
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  /**
   * Responsible for creating a tab for each LineChart.
   */
  const tabCreator = () => (
    // eslint-disable-next-line arrow-body-style
    graphVariables.map((graph, index) => {
      return <Tab key={graph.title} label={graph.title} component={Link} to={`/graphs/${index + 1}`} className={classes.tab} />;
    })
  );

  /**
   * Responsible for creating a LineChart for the variables given in graphVariables.
   */
  const graphCreator = () => {
    const graphs = graphVariables.map((graph, index) => (
      <LineChart
          // eslint-disable-next-line react/no-array-index-key
        key={index + 1}
        variables={graph.variables}
        xAxis={xAxis}
        xAxisLimits={xAxisLimits}
        graphData={graphData}
      />
    ));
    return (
      graphs.map((graph) => <Route key={graph.key} path={`/graphs/${graph.key}`} render={() => graph} />)
    );
  };

  return (
    <Fade in timeout={800}>
      <Grid container direction="column">
        <Grid item>
          <Tabs
            value={activeTab}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="secondary"
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
        <TimeButtonGroup
          dataTimePeriod={dataTimePeriod}
          setXAxis={setXAxis}
          setDataTimePeriod={setDataTimePeriod}
          setGraphData={setGraphData}
          createGraphData={createGraphData}
        />
      </Grid>
    </Fade>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(Graphs);
