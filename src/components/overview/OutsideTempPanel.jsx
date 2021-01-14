import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import moment from 'moment';
import { CircularProgress, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Line } from 'react-chartjs-2';
import { Atlas6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';

/**
 * Custom styling.
 */
const useStyles = makeStyles({
  container: {
    marginBottom: 40,
    height: '250px',
    padding: 15,
  },
  shadow: {
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
  card: {
    margin: 5,
  },
  loading: {
    borderBottom: '10px solid rgba(100, 100, 100, 0.5)',
  },
  active: {
    borderBottom: '10px solid rgba(0, 150, 0, 0.5)',
  },
  stopped: {
    borderBottom: '10px solid rgba(150, 0, 0, 0.5)',
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
      const dataSet = {
        label: 'Outside Temperature',
        data: data.map((entry) => entry.outsideTemp),
        borderColor: Atlas6[2],
        fill: false,
        pointRadius: 0,
        pointHitRadius: 5,
      };
      setDataSets([dataSet]);
      setXAxis(data.map((entry) => moment(entry.time)));
    }
  }, [data]);

  if (!data || !xAxis) {
    return (
      <Grid container item component={Paper} sm={12} lg={7} className={clsx(classes.container, classes.shadow)} alignItems="center" justify="center">
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
      className={clsx(classes.container, classes.shadow)}
    >
      <Line data={lineData} options={options} />
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(OutsideTempPanel);
