import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { CircularProgress, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Line } from 'react-chartjs-2';
import { Technic6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';

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

/**
 * Represents the panel which renders a LineChart of outside temperature.
 */
const OutsideTempPanel = ({ data }) => {
  const [dataSets, setDataSets] = useState([]);
  const [xAxis, setXAxis] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    // Create a Chart.js dataset for outside temperature
    if (data) {
      const startThreshold = moment(data[data.length - 1].time).subtract(2, 'days');
      const graphData = data.filter((entry) => startThreshold.isBefore(moment(entry.time)));
      const dataSet = {
        label: 'Outside Temperature',
        data: graphData.map((entry) => entry.outsideTemp),
        borderColor: Technic6[0],
        fill: false,
        pointRadius: 0,
        pointHitRadius: 5,
      };
      setDataSets([dataSet]);
      setXAxis(graphData.map((entry) => moment(entry.time)));
    }
  }, [data]);

  if (!data || !xAxis) {
    return (
      <Grid container item component={Paper} sm={12} lg={7} className={classes.panel} alignItems="center" justify="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  // Data in Chart.js form
  const lineData = {
    labels: xAxis,
    datasets: dataSets,
  };

  // Define ticks and zoom limits
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

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(OutsideTempPanel);
