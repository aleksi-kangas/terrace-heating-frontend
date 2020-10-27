import React, { useEffect, useState } from 'react';
import { LinearProgress } from '@material-ui/core';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart, Resizable, Legend, styler } from "react-timeseries-charts";
import { TimeSeries, TimeRange } from 'pondjs';
import moment from 'moment';


const LineGraph = ({ hidden, data, columns, graphId, graphTitle, currentTimeRange, setCurrentTimeRange }) => {
  // Contains all data
  const [dataTimeSeries, setDataTimeSeries] = useState(null);
  // Dynamic Y axis limits are calculated by the actively shown data and time range
  const [yAxisLimits, setYAxisLimits] = useState(null);
  const columnIds = columns.map((column) => column.id);
  const [activeColumns, setActiveColumns] = useState(columnIds);

  useEffect(() => {
    if (data && data.length !== 0) {
      /**
       * Create a series of data for producing a TimeSeries object with pondjs-library.
       * Columns to extract are determined by the prop variables.
       */
      const dataSeries = {
        name: 'dataSeries',
        columns: ['time', ...columnIds],
        points: data.map(datum => {
          const dataPoints = columnIds.map((id) => datum[id]);
          const result = [];
          result.push(moment(datum.time));
          result.push(...dataPoints);
          return result;
        })
      };
      setDataTimeSeries(new TimeSeries(dataSeries));

      /**
       * Calculates a new time range for the chart.
       *
       * If the chart is zoomed in a way that includes the last data point,
       * a new time range is calculated and the chart is updated to show the new entry.
       *
       * If the chart is zoomed elsewhere, where the last data point is not included in the current time range,
       * the time range is not updated and therefore the chart will not be re-rendered.
       */

      const dataStartTime = moment.utc(data[0].time);
      const dataEndTime = moment.utc(data[data.length - 1].time);
      const threshold = dataEndTime.clone().subtract(2, 'minutes');

      if (!currentTimeRange || !currentTimeRange.begin() || !currentTimeRange.end()) {
        // Set the initial time range of the data
        setCurrentTimeRange(new TimeRange(dataStartTime, dataEndTime));
      } else {
        const currentTimeRangeEnd = moment(currentTimeRange.end());

        if (currentTimeRangeEnd.isSameOrAfter(threshold)) {
          // Update the time range only if the last data point is included in the current time range
          setCurrentTimeRange(new TimeRange(moment(currentTimeRange.begin()), moment(dataEndTime)))
        }
      }
    }
  }, [data]);

  useEffect(() => {
    /**
     * Rescales the graph based on current time range and maximum and minimum values of the active columns.
     */
    if (dataTimeSeries && currentTimeRange) {
      let max = dataTimeSeries.max(activeColumns[0]);
      let min = dataTimeSeries.min(activeColumns[0]);
      activeColumns.forEach((columnId) => {
        const croppedDataTimeSeries = dataTimeSeries.crop(currentTimeRange);
        if (croppedDataTimeSeries.min(columnId) < min) {
          min = croppedDataTimeSeries.min(columnId);
        }
        if (croppedDataTimeSeries.max(columnId) > max) {
          max = croppedDataTimeSeries.max(columnId);
        }
      });
      setYAxisLimits({ min: min - 1.0 , max: max + 1.0 })
    }
  }, [currentTimeRange, activeColumns]);

  if (hidden) {
    return null;
  }

  // Data not loaded yet
  if (!data || !dataTimeSeries ||!yAxisLimits) {
    return (
      <LinearProgress />
    )
  }

  /**
   * Styling of the line
   */
  const lineStyle = styler(columnIds, 'Dark2');

  /**
   * Zooming
   */
  const handleTimeRangeChange = (timeRange) => {
    setCurrentTimeRange(timeRange);
  };

  /**
   * Legend-component related functionality and styling.
   * Produces labels for the data and allows user to filter which data lines to show in the chart.
   */
  const legend = [
    ...columns.map((column) => {
      return (
          {
            key: column.id,
            label: column.label,
            disabled: !activeColumns.includes(column.id)
          }
      )
    })
  ];

  const legendStyle = styler(columnIds, 'Dark2');

  const handleSelectionChange = (columnId) => {
    const newActive = [...activeColumns];
    if (newActive.includes(columnId)) {
      newActive.splice(newActive.indexOf(columnId), 1)
    } else {
      newActive.push(columnId)
    }
    setActiveColumns(newActive);
  };


  /**
   * Produces line charts for the data.
   * Takes the active columns and renders a line representing each column.
   */
  let charts = [];
  activeColumns.forEach((columnId) => {
    charts.push(
      <LineChart
        key={columnId}
        axis={graphId}
        series={dataTimeSeries}
        columns={[columnId]}
        style={lineStyle}
      />
    )
  });

  /**
   * Responsible for formatting X-axis timestamps.
   * @param time - a string representing a timestamp in the format YYYY-MM-DD hh:mm
   */
  const formatTime = (time) => {
    const timeString = moment(time).format('YYYY-MM-DD kk:mm');
    if (time.getHours() === 0) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[time.getMonth()];
      const day = time.getDate();
      return `${month} ${day}`
    } else {
      return `${timeString.substring(11)}`
    }
  };

  return (
    <div>
      <Resizable>
        <ChartContainer
          title={graphTitle}
          style={{
            background: "#201d1e",
            borderRadius: 10,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#232122"
          }}
          padding={20}
          enableDragZoom
          format={(time) => formatTime(time)}
          minTime={dataTimeSeries.begin()}
          maxTime={new Date()}
          timeRange={currentTimeRange}
          onTimeRangeChanged={handleTimeRangeChange}
        >
          <ChartRow height="400">
            <Charts>
              {charts}
            </Charts>
            <YAxis
              id={graphId}
              label="Celsius"
              min={yAxisLimits.min}
              max={yAxisLimits.max}
              width="80"
              type="linear"
              format=".2"
              showGrid={true}
              hideAxisLine={true}
            />
          </ChartRow>
        </ChartContainer>
      </Resizable>
      <Legend
        type="swatch"
        style={legendStyle}
        categories={legend}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  )
};

export default LineGraph;