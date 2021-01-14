import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import GaugeChart from 'react-gauge-chart';
import { Atlas6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';
import {
  CircularProgress,
  Grid, Paper, Typography,
} from '@material-ui/core';
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
  text: {
    color: '#131313',
  },
});

/**
 * Represents the panel which holds a graph and gauge of compressor usage.
 * Usages are represented as percentages of running time / cycle time,
 * where cycle is defined as compressor start -> stop -> start.
 */
const UsagePanel = ({ data }) => {
  const classes = useStyles();
  const [latestUsage, setLatestUsage] = useState(0);
  const [dataSets, setDataSets] = useState([]);
  const [xAxis, setXAxis] = useState(null);

  useEffect(() => {
    // Create a Chart.js dataset for compressor usage
    if (data) {
      const dataSet = {
        label: 'Compressor Usage',
        data: data.map((entry) => {
          if (entry.compressorUsage) {
            return entry.compressorUsage * 100;
          }
          return Number.NaN;
        }),
        borderColor: Atlas6[2],
        fill: true,
        pointRadius: 4,
        pointHitRadius: 5,
        spanGaps: true,
      };
      setDataSets([dataSet]);
      setXAxis(data.map((entry) => moment(entry.time)));
      const usages = data.filter((entry) => entry.compressorUsage != null);
      setLatestUsage(usages[usages.length - 1].compressorUsage);
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
    labels: data.map((entry) => entry.time),
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
            // day: 'DD MMM',
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
    <Grid container item component={Paper} className={clsx(classes.container, classes.shadow)} justify="space-evenly">
      <Grid container item sm={4} lg={3} justify="center" direction="column" className={classes.gauge}>
        <GaugeChart
          id="1"
          animate={false}
          nrOfLevels={20}
          percent={latestUsage}
          textColor="black"
          needleColor="gray"
        />
        <Typography variant="h6" className={classes.text} align="center">
          Compressor Usage
        </Typography>
      </Grid>
      <Grid container item sm={8} lg={8} justify="center" direction="column">
        <Line data={lineData} options={options} />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(UsagePanel);
