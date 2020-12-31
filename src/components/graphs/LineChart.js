import React from 'react';
import 'chartjs-plugin-zoom';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/core/styles';
import { Atlas6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office.js';


const useStyles = makeStyles(() => ({
  canvasContainer: {
    height: '60vh'
  }
}));

const LineChart = ({ data, variables, xAxis }) => {
  const classes = useStyles();

  const dataSets = [];

  variables.forEach((variable, index) => {
    const dataPoints = data.map((entry) => entry[variable.id]);
    const dataSet = {
      label: variable.label,
      data: dataPoints,
      borderColor: Atlas6[index],
      fill: false,
      pointRadius: 0,
      pointHitRadius: 5
    };
    dataSets.push(dataSet)
  });

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
          unitStepSize: '0.5',
          displayFormats: {
            hour: 'HH:mm',
            minute: 'mm'
          },
        },
        scaleLabel: {
          display: true,
          labelString: 'Time'
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Celsius (°C)'
        },
      }]
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          rangeMin: {
            x: xAxis[0].valueOf(),
            y: null
          },
          rangeMax: {
            x: xAxis[xAxis.length - 1].valueOf(),
            y: null
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
      }
    }
  };


  return (
    <div className={classes.canvasContainer}>
      <Line data={lineData} options={options}/>
    </div>
  )
};

const mapStateToProps = (state) => {
  return {
    data: state.data.data
  }
};

export default connect(mapStateToProps)(LineChart);
