import React from 'react';
import { CircularProgress, Grid, Paper } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
// @ts-ignore
// TODO
import { Technic6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';
import { makeStyles } from '@material-ui/core/styles';
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

type CompressorUsageChartProps = {
  compressorUsages: (number | undefined)[],
  xAxis: XAxisEntry[]
}

/**
 * Represents the compressor usage line-chart.
 * Responsible for rendering a Chart.js line-chart,
 * containing two days of compressor usage data.
 */
const CompressorUsageChart = ({ compressorUsages, xAxis }: CompressorUsageChartProps): JSX.Element => {
  const classes = useStyles();

  if (!compressorUsages.length || !xAxis.length) {
    return (
      <Grid
        container
        item
        sm={12}
        md={8}
        lg={8}
        component={Paper}
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
    label: 'Compressor Usage',
    data: compressorUsages,
    borderColor: Technic6[0],
    fill: true,
    pointRadius: 4,
    pointHitRadius: 5,
    spanGaps: true,
  };

  const lineData: ChartData = {
    labels: xAxis,
    datasets: [dataSet],
  };

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
          labelString: 'Usage (%)',
        },
        ticks: {
          suggestedMin: 0,
          suggestedMax: 100,
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
      lg={8}
      justify="center"
      direction="column"
      className={classes.panel}
    >
      <Line data={lineData} options={options} />
    </Grid>
  );
};

export default CompressorUsageChart;
