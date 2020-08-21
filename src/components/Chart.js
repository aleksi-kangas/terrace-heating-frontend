import React, { useEffect, useState } from 'react';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart } from "react-timeseries-charts";
import { TimeSeries, TimeRange } from 'pondjs';

const Chart = (data) => {
  const outsideTempSeries = new TimeSeries({
    name: 'outside temp',
    events: data.toArray().map((datum) => datum.outsideTemp)
  });



  const startTime = data.toArray()[0].time;
  const endTime = data.toArray()[data.toArray().length - 1].time;
  const timeRange = new TimeRange(startTime, endTime);

  return (
    <ChartContainer timeRange={timeRange} width={800}>
      <ChartRow height="200">
        <Charts>
          <LineChart axis="axis1" series={outsideTempSeries}/>
        </Charts>
        <YAxis id="axis1" label="Celsius" min={-20.0} max={50.0} width="80" type="linear" format="$,.2f"/>
      </ChartRow>
    </ChartContainer>
  )
};

export default Chart;