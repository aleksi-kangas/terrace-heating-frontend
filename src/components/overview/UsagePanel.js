import React from 'react';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { Atlas6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office.js';

const UsagePanel = ({ data }) => {

  if (!data) return null;

  const dataSets = [{
    label: 'Compressor Usage',
    data: data.map((entry) => {
      if (entry.compressorUsage) {
        return entry.compressorUsage * 100;
      } else {
        return Number.NaN;
      }
    }),
    borderColor: Atlas6[2],
    fill: true,
    pointRadius: 0,
    pointHitRadius: 5,
    spanGaps: true,
  }];


  const lineData = {
    labels: data.map((entry) => entry.time),
    datasets: dataSets
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
            //day: 'DD MMM',
          },
        },
        ticks: {
          major: {
            enabled: true,
            fontStyle: 'bold',
            fontSize: 14,
          }
        },
        scaleLabel: {
          display: true,
          labelString: 'Time',
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Usage %'
        },
      }],
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          rangeMin: {
            x: data[0].time.valueOf(),
            y: null
          },
          rangeMax: {
            x: data[data.length - 1].time.valueOf(),
            y: null
          },
        },
        zoom: {
          enabled: true,
          drag: false,
          mode: 'x',
          rangeMin: {
            x: data[0].time.valueOf(),
          },
          rangeMax: {
            x: data[data.length - 1].time.valueOf(),
          },
        },
        speed: 15,
      }
    }
  };

  return (
    <Line data={lineData} options={options}/>
  )
};

const mapStateToProps = (state) => {
  return {
    data: state.data.data
  }
};

export default connect(mapStateToProps)(UsagePanel);
