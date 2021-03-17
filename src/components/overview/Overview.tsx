import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Fade, Grid } from '@material-ui/core';
import moment from 'moment';
import CompressorUsageChart from './CompressorUsageChart';
import CompressorUsageGauge from './CompressorUsageGauge';
import OutsideTempChart from './OutsideTempChart';
import TogglePanel from './TogglePanel';
import { XAxisEntry } from '../graphs/Graphs';
import { HeatPumpEntry } from '../../types';
import { State } from '../../store';

type OverviewProps = {
  heatPumpData: HeatPumpEntry[]
}

/**
 * Responsible for rendering the overview page of the application.
 * Contains multiple panels which provide a simple overview of the heating system's status.
 */
const Overview = ({ heatPumpData }: OverviewProps): JSX.Element => {
  const [latestHeatPumpEntry, setLatestHeatPumpEntry] = useState<HeatPumpEntry>();
  const [compressorUsages, setCompressorUsages] = useState<number[]>([]);
  const [outsideTemps, setOutsideTemps] = useState<number[]>([]);
  const [xAxis, setXAxis] = useState<XAxisEntry[]>([]);

  useEffect(() => {
    if (heatPumpData.length) {
      const startThreshold = moment(heatPumpData[heatPumpData.length - 1].time).subtract(2, 'days');
      const newCompressorUsages: number[] = [];
      const newOutsideTemps: number[] = [];
      const newXAxis: XAxisEntry[] = [];

      heatPumpData.forEach((entry: HeatPumpEntry) => {
        if (startThreshold.isBefore(moment(entry.time))) {
          newCompressorUsages.push(
            entry.compressorUsage ? Math.round(entry.compressorUsage * 100) : Number.NaN,
          );
          newOutsideTemps.push(entry.outsideTemp);
          newXAxis.push(moment(entry.time));
        }
      });

      setLatestHeatPumpEntry(heatPumpData.slice(-1).pop());
      setCompressorUsages(newCompressorUsages);
      setOutsideTemps(newOutsideTemps);
      setXAxis(newXAxis);
    }
  }, [heatPumpData]);

  return (
    <Fade in timeout={800}>
      <Grid container item justify="space-between">
        <OutsideTempChart outsideTemps={outsideTemps} xAxis={xAxis} />
        <TogglePanel latestHeatPumpEntry={latestHeatPumpEntry} />
        <CompressorUsageGauge latestHeatPumpEntry={latestHeatPumpEntry} />
        <CompressorUsageChart compressorUsages={compressorUsages} xAxis={xAxis} />
      </Grid>
    </Fade>
  );
};

const mapStateToProps = (state: State) => ({
  heatPumpData: state.heatPump.heatPumpData,
});

export default connect(mapStateToProps)(Overview);
