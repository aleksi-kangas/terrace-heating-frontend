import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CircularProgress, Grid, Paper } from '@material-ui/core';
import clsx from 'clsx';
import { Line } from 'react-chartjs-2';
import { Technic6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';
import moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';

/**
 * Custom styling.
 */
const useStyles = makeStyles({
  container: {
    marginBottom: 40,
    height: '300px',
    padding: 10,
  },
  shadow: {
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
});

/**
 * Represents the compressor usage line-chart.
 * Responsible for rendering a Chart.js line-chart,
 * containing two days of compressor usage data.
 */
const CompressorUsageChart = ({ data }) => {
  const classes = useStyles();
  const [dataSets, setDataSets] = useState([]);
  const [xAxis, setXAxis] = useState(null);

  useEffect(() => {
    // Create a Chart.js dataset for compressor usage
    if (data) {
      const startThreshold = moment(data[data.length - 1].time).subtract(2, 'days');
      const graphData = data.filter((entry) => startThreshold.isBefore(moment(entry.time)));
      const dataSet = {
        label: 'Compressor Usage',
        data: graphData.map((entry) => {
          if (entry.compressorUsage) {
            return entry.compressorUsage * 100;
          }
          return Number.NaN;
        }),
        borderColor: Technic6[0],
        fill: true,
        pointRadius: 4,
        pointHitRadius: 5,
        spanGaps: true,
      };
      setDataSets([dataSet]);
      setXAxis(graphData.map((entry) => moment(entry.time)));
    }
  }, [data]);

  if (!data || !xAxis) {
    return (
      <Grid container item component={Paper} className={clsx(classes.container, classes.shadow)} alignItems="center" justify="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  const lineData = {
    labels: xAxis,
    datasets: dataSets,
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          tooltipFormat: 'YYYY-MM-DD HH:mm',
          unit: 'hour',
          unitStepSize: '1',
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
    <Grid container item component={Paper} sm={12} md={8} lg={8} justify="center" direction="column" className={clsx(classes.container, classes.shadow)}>
      <Line data={lineData} options={options} />
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(CompressorUsageChart);
