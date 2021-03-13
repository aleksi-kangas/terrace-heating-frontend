import React, {
  createRef, useEffect, useState,
} from 'react';
import 'chartjs-plugin-zoom';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { ChartDataSets, ChartLegendLabelItem, ChartOptions } from 'chart.js';
import { makeStyles } from '@material-ui/core/styles';
// @ts-ignore
import { Tableau10 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau';
import dataFilterPlugin from '../../utils/chartFilter';
import { GraphVariable, HeatPumpEntry } from '../../types';
import { XAxisEntry, XAxisLimits } from './Graphs';
import { State } from '../../store';

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
const hex2rgba = (hex: string, alpha: number) => {
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

type ChartVariable = {
  id: string,
}

type LineChartProps = {
  graphData: HeatPumpEntry[],
  variables: GraphVariable[],
  xAxis: XAxisEntry[],
  xAxisLimits: XAxisLimits
}

/**
 * Represents a line chart rendered with Chart.js.
 */
const LineChart = ({
  graphData, variables, xAxis, xAxisLimits,
}: LineChartProps) => {
  const [chartRef] = useState(createRef);
  // const chartRef = useRef();
  const classes = useStyles();

  const dataSets: ChartDataSets[] = [];

  useEffect(() => {
    if (xAxisLimits.start && xAxisLimits.end) {
      // Reset chart zoom, when xAxisLimits change
      // This happens when time control buttons are clicked, e.g. '7 Days'
      // @ts-ignore
      // TODO
      chartRef.current.chartInstance.resetZoom();
    }
  }, [xAxisLimits]);

  if (!xAxisLimits.start || !xAxisLimits.end) {
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
  const lineColor = (variable: ChartVariable, index: number) => {
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
  const isATankLimit = (id: string | undefined) => {
    if (id === undefined) return false;
    const limits = ['lowerTankLowerLimit', 'lowerTankUpperLimit', 'upperTankLowerLimit', 'upperTankUpperLimit'];
    return limits.includes(id);
  };

  // Create a Chart.js dataset for each variable
  variables.forEach((variable: GraphVariable, index: number) => {
    // @ts-ignore
    const dataPoints = graphData.map((entry: HeatPumpEntry) => entry[variable.id]);
    const dataSet: ChartDataSets = {
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
  const options: ChartOptions = {
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
        filter: (label: ChartLegendLabelItem) => !isATankLimit(label.text),
      },
    },
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
      <Line
        // @ts-ignore
        // TODO
        ref={chartRef}
        data={lineData}
        options={options}
      />
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  heatPumpData: state.heatPump.data,
  dataCoverageDays: state.heatPump.dataCoverageDays,
});

export default connect(mapStateToProps)(LineChart);
