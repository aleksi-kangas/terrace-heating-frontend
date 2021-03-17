import React, { useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  CircularProgress, Grid, Paper, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ChartOptions } from 'chart.js';
import { HeatPumpEntry } from '../../types';

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
  text: {
    color: '#131313',
  },
  gauge: {
    padding: 20,
  },
});

type CompressorUsageGaugeProps = {
  latestHeatPumpEntry: HeatPumpEntry | undefined
}

type GaugeRef = {
  chartInstance: {
    canvas: HTMLCanvasElement
  }
}

/**
 * Represents a gauge for current compressor usage.
 * Responsible for rendering a simple gauge,
 * showing the percentage of compressor usage during the last cycle.
 */
const CompressorUsageGauge = ({ latestHeatPumpEntry }: CompressorUsageGaugeProps): JSX.Element => {
  const classes = useStyles();
  const gaugeRef = useRef<GaugeRef>({} as GaugeRef);

  if (!latestHeatPumpEntry) {
    return (
      <Grid
        container
        item
        sm={12}
        md={3}
        lg={3}
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

  // Define the color areas of the gauge
  const gaugeData = {
    datasets: [
      {
        data: [70, 15, 15],
        backgroundColor: [
          'rgb(155, 225, 90)',
          'rgb(206,188,73)',
          'rgb(255, 100, 50)',
        ],
        borderWidth: 2,
      },
    ],
  };

  /**
   * Draws the needle on the gauge.
   * Code by: obernals
   * From: https://github.com/chartjs/Chart.js/issues/2874
   * @param radius length of needle
   * @param radianAngle angle of needle
   */
  const drawNeedle = (radius: number, radianAngle: number) => {
    const { canvas } = gaugeRef.current.chartInstance;
    // TODO
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const ctx = canvas.getContext('2d')!;
    const cw = canvas.offsetWidth;
    const ch = canvas.offsetHeight;
    const cx = cw / 2;
    const cy = ch - (ch / 4);

    ctx.translate(cx, cy);
    // Create needle
    ctx.rotate(radianAngle);
    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.lineTo(radius, 0);
    ctx.lineTo(0, 5);
    ctx.fillStyle = '#131313';
    ctx.fill();
    // Create dot at the end of needle
    ctx.rotate(-radianAngle);
    ctx.translate(-cx, -cy);
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
  };

  const options: ChartOptions = {
    rotation: -1.0 * Math.PI,
    circumference: Math.PI,
    events: [],
    title: {
      display: true,
      position: 'bottom',
      text: `${latestHeatPumpEntry.compressorUsage} %`,
      fontSize: 16,
      fontColor: '#131313',
      padding: 5,
    },
    animation: {
      easing: 'linear',
      onProgress: () => drawNeedle(80, Math.PI + (latestHeatPumpEntry.compressorUsage / 100) * Math.PI),
    },
  };

  return (
    <Grid
      container
      item
      component={Paper}
      sm={12}
      md={3}
      lg={3}
      alignItems="center"
      justify="center"
      direction="column"
      className={classes.panel}
    >
      <Grid item>
        <Doughnut
          // TODO
          // @ts-ignore
          ref={gaugeRef}
          data={gaugeData}
          options={options}
        />
      </Grid>
      <Grid item>
        <Typography variant="h6" className={classes.text} align="center">
          Compressor Usage
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CompressorUsageGauge;
