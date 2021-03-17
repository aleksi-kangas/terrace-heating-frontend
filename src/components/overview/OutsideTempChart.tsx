import React from 'react';
import { CircularProgress, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Line } from 'react-chartjs-2';
// TODO
// @ts-ignore
import { Technic6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';
import { ChartData, ChartDataSets, ChartOptions } from 'chart.js';
import { XAxisEntry } from '../graphs/Graphs';

/**
 * Custom styling.
 */
const useStyles = makeStyles({
  panel: {
    margin: 20,
    height: '300px',
    padding: 10,
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
});

type OutsideTempPanelProps = {
  outsideTemps: number[],
  xAxis: XAxisEntry[]
};

/**
 * Represents the panel which renders a LineChart of outside temperature.
 */
const OutsideTempChart = ({ outsideTemps, xAxis }: OutsideTempPanelProps): JSX.Element => {
  const classes = useStyles();

  if (!outsideTemps.length || !xAxis.length) {
    return (
      <Grid
        container
        item
        component={Paper}
        sm={12}
        lg={7}
        className={classes.panel}
        alignItems="center"
        justify="center"
      >
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  const dataSet: ChartDataSets = {
    label: 'Outside Temperature',
    data: outsideTemps,
    borderColor: Technic6[0],
    fill: false,
    pointRadius: 0,
    pointHitRadius: 5,
  };

  // Data in Chart.js form
  const lineData: ChartData = {
    labels: xAxis,
    datasets: [dataSet],
  };

  // Define ticks and zoom limits
  const options: ChartOptions = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          tooltipFormat: 'YYYY-MM-DD HH:mm',
          unit: 'hour',
          unitStepSize: 1,
          displayFormats: {
            hour: 'HH:mm',
          },
        },
        ticks: {
          major: {
            enabled: true,
            fontStyle: 'bold',
            fontSize: 14,
          },
        },
        scaleLabel: {
          display: true,
          labelString: 'Time',
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Celsius (°C)',
        },
      }],
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          rangeMin: {
            x: xAxis[0].valueOf(),
            y: null,
          },
          rangeMax: {
            x: xAxis[xAxis.length - 1].valueOf(),
            y: null,
          },
        },
        zoom: {
          enabled: true,
          drag: false,
          mode: 'x',
          rangeMin: {
            x: xAxis[0].valueOf(),
          },
          rangeMax: {
            x: xAxis[xAxis.length - 1].valueOf(),
          },
        },
        speed: 15,
      },
    },
  };

  return (
    <Grid
      container
      item
      component={Paper}
      sm={12}
      md={8}
      lg={7}
      className={classes.panel}
    >
      <Line data={lineData} options={options} />
    </Grid>
  );
};

export default OutsideTempChart;
