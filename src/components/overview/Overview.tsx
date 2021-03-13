import React from 'react';
import { Fade, Grid } from '@material-ui/core';
import CompressorUsageChart from './CompressorUsageChart';
import CompressorUsageGauge from './CompressorUsageGauge';
import OutsideTempChart from './OutsideTempChart';
import TogglePanel from './TogglePanel';

/**
 * Responsible for rendering the overview page of the application.
 * Contains multiple panels which provide a simple overview of the heating system's status.
 */
const Overview = (): JSX.Element => (
  <Fade in timeout={800}>
    <Grid container item justify="space-between">
      <OutsideTempChart />
      <TogglePanel />
      <CompressorUsageGauge />
      <CompressorUsageChart />
    </Grid>
  </Fade>
);

export default Overview;
