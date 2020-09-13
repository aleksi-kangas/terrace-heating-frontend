import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Grid from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/cjs/ButtonGroup.js';
import { Charts, ChartContainer, ChartRow, YAxis, LineChart, Resizable, Legend, styler} from "react-timeseries-charts";
import { TimeSeries, TimeRange } from 'pondjs';
import moment from 'moment';


const Chart = ({ data, columns, id, title }) => {
  // Contains all data
  const [dataTimeSeries, setDataTimeSeries] = useState(null);
  // Dynamic time range that changes when zooming the chart
  const [currentTimeRange, setCurrentTimeRange] = useState(null);
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

      const dataBeginTime = data[0].time;
      const dataEndTime = data[data.length - 1].time;

      // TODO VERIFY THAT THIS WORKS
      if (!currentTimeRange ) {
        // Set time range of the data
        setCurrentTimeRange(new TimeRange(moment(dataBeginTime), moment(dataEndTime)));
      } else if (currentTimeRange.end() === data[data.length - 2].time) {
        // Case where chart is zoomed but the end time is in the current time range.
        // Modifying the currently shown time range does not interfere with the user experience.
        // Update the time range to include the new data entry.
        setCurrentTimeRange(new TimeRange(moment(currentTimeRange.begin()), moment(dataEndTime)))
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
      setYAxisLimits({ min: min , max: max })
    }
  }, [currentTimeRange, activeColumns]);

  // Data not loaded yet
  if (!data || !dataTimeSeries ||!yAxisLimits) {
    return (
      <p>Loading...</p>
    )
  }

  /**
   * Timeframe buttons
   */
  const TimeControlButtonGroup = () => {
    const dayButton = (days) => {
      const dateTo = moment();
      const dateFrom = moment().subtract(days, 'd');
      const timeRange = new TimeRange(dateFrom, dateTo);
      return (
        <Button onClick={() => setCurrentTimeRange(timeRange)}>
          {days} days
        </Button>
      )
    };

    const resetButton = () => {
      // Calculate time range of the data
      const startTime = moment(data[0].time);
      const endTime = moment(data[data.length - 1].time);
      return (
        <Button onClick={() => setCurrentTimeRange(new TimeRange(startTime, endTime))}>
          Reset
        </Button>
      )
    };

    return (
      <ButtonGroup vertical>
        {dayButton(1)}
        {dayButton(3)}
        {dayButton(7)}
        {resetButton()}
      </ButtonGroup>
    )
  };

  /**
   * Styling
   */
  const lineStyle = styler(columnIds, 'Dark2');

  /**
   * Zooming
   */
  const handleTimeRangeChange = (timeRange) => {
    setCurrentTimeRange(timeRange);
  };

  /**
   * Legend related stuff
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
   * Render active columns to the graph
   */
  let charts = [];
  activeColumns.forEach((columnId) => {
    charts.push(
      <LineChart
        key={columnId}
        axis={id}
        series={dataTimeSeries}
        columns={[columnId]}
        style={lineStyle}
      />
    )
  });

  /**
   * Responsible for formatting X-axis timestamps.
   * @param time
   */
  const formatTime = (time) => {
    const timeString = moment(time).format('YYYY-MM-DD kk:mm');
    if (time.getHours() === 0) {
      // Extract abbreviated weekday e.g. Sat
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = months[time.getMonth()];
      const day = time.getDate();
      return `${month} ${day}`
    } else {
      return `${timeString.substring(11)}`
    }
  };

  return (
    <Grid>
      <Row>
        <Col xs="10" md="10" lg="11" >
          <Resizable>
            <ChartContainer
              title={title}
              style={{
                background: "#201d1e",
                borderRadius: 8,
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
                  id={id}
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
        </Col>
        <Col>
          <Row>
            <TimeControlButtonGroup />
          </Row>
          <Row>
            Testing
          </Row>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col xs="11" md="11" lg="11">
          <Legend
            type="swatch"
            style={legendStyle}
            categories={legend}
            onSelectionChange={handleSelectionChange}
          />
        </Col>
      </Row>
    </Grid>
  )
};

export default Chart;