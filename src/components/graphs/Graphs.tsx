import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  CircularProgress, Fade, Grid, LinearProgress, Paper, Tab, Tabs,
} from '@material-ui/core';
import { Link, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import LineChart from './LineChart';
import TimeButtonGroup from './TimeButtonGroup';
import { GraphGroup, GraphVariableIds, HeatPumpEntry } from '../../types';
import { State } from '../../store';
import HeatPumpService from '../../services/heatPump';
import { setDataAction, setDataCoverageDaysAction } from '../../reducers/heatPumpReducer';

/**
 * Custom styling.
 */
const useStyles = makeStyles({
  container: {
    margin: 20,
  },
  tabs: {
    marginBottom: 10,
    background: '#2f4050',
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
  tab: {
    color: '#bfbfbf',
  },
  graph: {
    padding: 15,
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
  loading: {
    margin: 20,
    padding: 50,
  },
  updating: {
    zIndex: 10,
  },
});

/**
 * Predetermined variables to draw graphs for.
 */
const graphVariables: GraphGroup[] = [
  {
    title: 'Outside Temperatures',
    variables: [
      { label: 'Outside', id: GraphVariableIds.OutsideTemp },
      { label: 'Ground-loop Input', id: GraphVariableIds.GroundLoopInputTemp },
      { label: 'Ground-loop Output', id: GraphVariableIds.GroundLoopOutputTemp },
    ],
  },
  {
    title: 'Tank Temperatures',
    variables: [
      { label: 'Lower Tank', id: GraphVariableIds.LowerTankTemp },
      { label: 'Upper Tank', id: GraphVariableIds.UpperTankTemp },
      { label: 'Hot Gas', id: GraphVariableIds.HotGasTemp },
      { label: 'lowerTankLowerLimit', id: GraphVariableIds.LowerTankLowerLimit },
      { label: 'lowerTankUpperLimit', id: GraphVariableIds.LowerTankUpperLimit },
      { label: 'upperTankLowerLimit', id: GraphVariableIds.UpperTankLowerLimit },
      { label: 'upperTankUpperLimit', id: GraphVariableIds.UpperTankUpperLimit },
    ],
  },
  {
    title: 'Heat Distribution Circuits',
    variables: [
      { label: 'Heat Distribution Circuit 1', id: GraphVariableIds.HeatDistCircuit1Temp },
      { label: 'Heat Distribution Circuit 2', id: GraphVariableIds.HeatDistCircuit2Temp },
      { label: 'Heat Distribution Circuit 3', id: GraphVariableIds.HeatDistCircuit3Temp },
      { label: 'Inside', id: GraphVariableIds.InsideTemp },
    ],
  },
];

export type XAxisEntry = moment.Moment

export type XAxisLimits = {
  start: moment.Moment
  end: moment.Moment
}

type GraphsProps = {
  heatPumpData: HeatPumpEntry[],
  dataCoverageDays: number,
  setDataCoverageDays: (days: number) => void,
  setData: (heatPumpData: HeatPumpEntry[]) => void,
}

/**
 * Represents the graphs page as a whole.
 * Responsible for drawing three different LineCharts in separate tabs.
 */
const Graphs = ({
  heatPumpData, dataCoverageDays, setDataCoverageDays, setData,
}: GraphsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [graphDataCoverageDays, setGraphDataCoverageDays] = useState(dataCoverageDays);
  const [graphData, setGraphData] = useState<HeatPumpEntry[]>([]);
  const [xAxisLimits, setAxisLimits] = useState<XAxisLimits>({} as XAxisLimits);
  const [xAxis, setXAxis] = useState<XAxisEntry[]>([] as XAxisEntry[]);
  const [updating, setUpdating] = useState(false);

  const classes = useStyles();

  /**
   * Helper function for filtering data for graph.
   * Filters the given that and retains data for the given amount of days.
   * @param days of data to retain
   */
  const createGraphData = async (days: number) => {
    let data = heatPumpData;
    if (dataCoverageDays < graphDataCoverageDays) {
      setUpdating(true);
      // Get missing data
      data = await HeatPumpService.getHeatPumpData(graphDataCoverageDays);
      setData(data);
      setDataCoverageDays(graphDataCoverageDays);
      setUpdating(false);
    }

    const startThreshold = moment(data[data.length - 1].time).subtract(days, 'days');
    const newGraphData = data.filter(
      (entry: HeatPumpEntry) => startThreshold.isBefore(moment(entry.time)),
    );
    const limits = {
      start: moment(newGraphData[0].time),
      end: moment(newGraphData[newGraphData.length - 1].time),
    };
    setXAxis(newGraphData.map((entry: HeatPumpEntry) => moment(entry.time)));
    setGraphData(newGraphData);
    setAxisLimits(limits);
  };

  useEffect(() => {
    if (heatPumpData.length && !graphData.length) {
      // Create graph data initially
      createGraphData(dataCoverageDays).then();
    }
  }, [heatPumpData]);

  useEffect(() => {
    if (heatPumpData.length) {
      // Graph data is updated when graphDataCoverageDays is changed,
      // i.e. the user clicks any of the TimeButtonGroup's buttons
      createGraphData(graphDataCoverageDays).then();
    }
  }, [graphDataCoverageDays]);

  if (!graphData.length) {
    return (
      <Grid container className={classes.container} justify="center">
        <Grid item component={Paper}>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  /**
   * Handler for changing the active tab.
   */
  const handleChange = (event: any, value: React.SetStateAction<number>) => {
    setActiveTab(value);
  };

  /**
   * Responsible for creating a tab for each LineChart.
   */
  const tabCreator = () => (
    // eslint-disable-next-line arrow-body-style
    graphVariables.map((graph: GraphGroup, index: number) => {
      return (
        <Tab
          key={graph.title}
          label={graph.title}
          component={Link}
          to={`/graphs/${index + 1}`}
          className={classes.tab}
        />
      );
    })
  );

  /**
   * Responsible for creating a LineChart for the variables given in graphVariables.
   */
  const graphCreator = () => {
    const graphs = graphVariables.map((graph: GraphGroup, index: number) => (
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
      graphs.map((graph: JSX.Element) => <Route key={graph.key} path={`/graphs/${graph.key}`} render={() => graph} />)
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
            className={classes.tabs}
          >
            {tabCreator()}
          </Tabs>
        </Grid>
        <Grid item component={Paper} className={classes.graph}>
          {graphCreator()}
          { updating ? <LinearProgress className={classes.updating} /> : null }
        </Grid>
        <TimeButtonGroup
          setGraphDataCoverageDays={setGraphDataCoverageDays}
        />
      </Grid>
    </Fade>
  );
};

const mapStateToProps = (state: State) => ({
  heatPumpData: state.heatPump.data,
  dataCoverageDays: state.heatPump.dataCoverageDays,
});

export default connect(
  mapStateToProps,
  {
    setDataCoverageDays: setDataCoverageDaysAction,
    setData: setDataAction,
  },
)(Graphs);
