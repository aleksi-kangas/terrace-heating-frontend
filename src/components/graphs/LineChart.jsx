import React, { createRef, useEffect, useState } from 'react';
import 'chartjs-plugin-zoom';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/core/styles';
import { Tableau10 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau';
import dataFilterPlugin from '../../utils/chartFilter';

/**
 * Custom styling.
 */
const useStyles = makeStyles(() => ({
  canvasContainer: {
    height: '60vh',
  },
}));

/**
 * Helper function for converting hex-color to rgba-color
 * @param hex String representing a hex-color, e.g. #FFFFFF
 * @param alpha Number [0.0, 1.0]
 * @return {string} e.g. rgba(255, 255, 255, 0.5)
 */
const hex2rgba = (hex, alpha) => {
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

/**
 * Represents a line chart rendered with Chart.js.
 */
const LineChart = ({
  graphData, variables, xAxis, xAxisLimits,
}) => {
  const [chartRef] = useState(createRef);
  const classes = useStyles();

  const dataSets = [];

  useEffect(() => {
    // Reset chart zoom, when xAxisLimits change
    // This happens when time control buttons are clicked, e.g. '7 Days'
    chartRef.current.chartInstance.resetZoom();
  }, [xAxisLimits]);

  if (!xAxisLimits) {
    return null;
  }

  /**
   * Helper function for determining line color for the graph.
   * Returns half opacity colors for tank limits.
   * Otherwise returns colors from Tableau10 color scheme.
   * @param variable String variable name
   * @param index of the variable in Chart.js dataset creation loop
   * @return {string} hex-color or rgba-color for a line
   */
  const lineColor = (variable, index) => {
    if (variable.id === 'lowerTankLowerLimit') return hex2rgba(Tableau10[3], 0.5);
    if (variable.id === 'lowerTankUpperLimit') return hex2rgba(Tableau10[3], 0.5);
    if (variable.id === 'upperTankLowerLimit') return hex2rgba(Tableau10[5], 0.5);
    if (variable.id === 'upperTankUpperLimit') return hex2rgba(Tableau10[5], 0.5);
    return Tableau10[index];
  };

  /**
   * Helper function for determining if a variable is a tank limit.
   * @param id variable id/name
   * @return {boolean} true when variable is a tank limit
   */
  const isATankLimit = (id) => {
    const limits = ['lowerTankLowerLimit', 'lowerTankUpperLimit', 'upperTankLowerLimit', 'upperTankUpperLimit'];
    return limits.includes(id);
  };

  // Create a Chart.js dataset for each variable
  variables.forEach((variable, index) => {
    const dataPoints = graphData.map((entry) => entry[variable.id]);
    const dataSet = {
      label: variable.label,
      data: dataPoints,
      borderColor: lineColor(variable, index),
      fill: false,
      pointRadius: 0,
      pointHitRadius: isATankLimit(variable.id) ? 0 : 5,
      spanGaps: true,
    };
    dataSets.push(dataSet);
  });

  // Data in Chart.js form
  const lineData = {
    labels: xAxis,
    datasets: dataSets,
  };

  // Defining animations, ticks and zoom limits
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    hover: {
      animationDuration: 0,
    },
    responsiveAnimationDuration: 0,
    legend: {
      labels: {
        filter: (label) => !isATankLimit(label.text),
      },
    },
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
      dataFilterPlugin,
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          rangeMin: {
            x: xAxisLimits.start.valueOf(),
            y: null,
          },
          rangeMax: {
            x: xAxisLimits.end.valueOf(),
            y: null,
          },
        },
        zoom: {
          enabled: true,
          drag: false,
          mode: 'x',
          rangeMin: {
            x: xAxisLimits.start.valueOf(),
          },
          rangeMax: {
            x: xAxisLimits.end.valueOf(),
          },
        },
        speed: 15,
      },
    },
  };

  return (
    <div className={classes.canvasContainer}>
      <Line ref={chartRef} data={lineData} options={options} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(LineChart);
