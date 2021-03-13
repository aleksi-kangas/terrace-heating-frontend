import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CircularProgress, Grid, Paper } from '@material-ui/core';
import { Line } from 'react-chartjs-2';
// @ts-ignore
// TODO
import { Technic6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import { ChartData, ChartDataSets, ChartOptions } from 'chart.js';
import { HeatPumpEntry } from '../../types';
import { XAxisEntry } from '../graphs/Graphs';
import { State } from '../../store';

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
  heatPumpData: HeatPumpEntry[]
}

/**
 * Represents the compressor usage line-chart.
 * Responsible for rendering a Chart.js line-chart,
 * containing two days of compressor usage data.
 */
const CompressorUsageChart = ({ heatPumpData }: CompressorUsageChartProps) => {
  const classes = useStyles();
  const [dataSets, setDataSets] = useState<ChartDataSets[]>([]);
  const [xAxis, setXAxis] = useState<XAxisEntry[]>([]);

  useEffect(() => {
    // Create a Chart.js dataset for compressor usage
    if (heatPumpData.length) {
      const startThreshold = moment(heatPumpData[heatPumpData.length - 1].time).subtract(2, 'days');
      const graphData: number[] = [];
      heatPumpData.forEach((entry: HeatPumpEntry) => {
        if (!startThreshold.isBefore(moment(entry.time))) {
          graphData.push(
            entry.compressorUsage ? Math.round(entry.compressorUsage * 100) : Number.NaN,
          );
        }
      });

      // const graphData = heatPumpData.filter((entry: HeatPumpEntry) => startThreshold.isBefore(moment(entry.time)));
      const dataSet: ChartDataSets = {
        label: 'Compressor Usage',
        // data: graphData.map((entry: HeatPumpEntry) => {
        //   if (entry.compressorUsage) {
        //     return Math.round(entry.compressorUsage * 100);
        //   }
        //   return Number.NaN;
        // }),
        data: graphData,
        borderColor: Technic6[0],
        fill: true,
        pointRadius: 4,
        pointHitRadius: 5,
        spanGaps: true,
      };
      setDataSets([dataSet]);
      setXAxis(heatPumpData.map((entry: HeatPumpEntry) => moment(entry.time)));
    }
  }, [heatPumpData]);

  if (!heatPumpData.length || !xAxis.length) {
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

  const lineData: ChartData = {
    labels: xAxis,
    datasets: dataSets,
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

const mapStateToProps = (state: State) => ({
  heatPumpData: state.heatPump.data,
});

export default connect(mapStateToProps)(CompressorUsageChart);
