import React from 'react';
import { Grid } from '@material-ui/core';
import OutsideTempPanel from './OutsideTempPanel';
import CompressorUsageGauge from './CompressorUsageGauge';
import TogglePanel from './TogglePanel';
import CompressorUsageChart from './CompressorUsageChart';

/**
 * Responsible for rendering the overview page of the application.
 * Contains multiple panels which provide a simple overview of the heating system's status.
 */
const Overview = () => (
  <Grid item container>
    <Grid container item justify="space-between">
      <OutsideTempPanel />
      <TogglePanel />
      <CompressorUsageGauge />
      <CompressorUsageChart />
    </Grid>
  </Grid>
);

export default Overview;
