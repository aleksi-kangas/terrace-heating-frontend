import moment from 'moment';
import { TimeRange } from "pondjs";
import { Button, ButtonGroup } from '@material-ui/core';
import React from 'react';


/**
 * Timeframe buttons
 */
const TimeControlGroup = ({ data, setTimeRange }) => {
  const dayButton = (days) => {
    const dateTo = moment();
    const dateFrom = moment().subtract(days, 'd');
    const timeRange = new TimeRange(dateFrom, dateTo);
    return (
      <Button onClick={() => setTimeRange(timeRange)}>
        {days === 1 ? `1 day` : `${days} days`}
      </Button>
    )
  };

  const resetButton = () => {
    // Calculate time range of the data
    const startTime = moment(data[0].time);
    const endTime = moment(data[data.length - 1].time);
    return (
      <Button onClick={() => setTimeRange(new TimeRange(startTime, endTime))}>
        Reset
      </Button>
    )
  };

  return (
    <ButtonGroup orientation='vertical'>
      {dayButton(1)}
      {dayButton(3)}
      {dayButton(7)}
      {resetButton()}
    </ButtonGroup>
  )
};

export default TimeControlGroup;