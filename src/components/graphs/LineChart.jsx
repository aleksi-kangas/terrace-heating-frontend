import React from 'react';
import 'chartjs-plugin-zoom';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { fi } from 'date-fns/locale';
import { makeStyles } from '@material-ui/core/styles';
import { Office6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office';

/**
 * Custom styling.
 */
const useStyles = makeStyles(() => ({
  canvasContainer: {
    height: '60vh',
  },
}));

/**
 * Represents a line chart rendered with Chart.js.
 */
const LineChart = ({ data, variables, xAxis }) => {
  const classes = useStyles();

  const dataSets = [];

  // Create a Chart.js dataset for each variable
  variables.forEach((variable, index) => {
    const dataPoints = data.map((entry) => entry[variable.id]);
    const dataSet = {
      label: variable.label,
      data: dataPoints,
      borderColor: Office6[index],
      fill: false,
      pointRadius: 0,
      pointHitRadius: 5,
    };
    dataSets.push(dataSet);
  });

  const lineData = {
    labels: xAxis,
    datasets: dataSets,
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      adapters: {
        date: {
          locale: fi,
        },
      },
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
    <div className={classes.canvasContainer}>
      <Line data={lineData} options={options} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(LineChart);
