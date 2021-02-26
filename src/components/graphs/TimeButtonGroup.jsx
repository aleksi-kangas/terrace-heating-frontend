import React from 'react';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { setData } from '../../reducers/dataReducer';
import HeatPumpService from '../../services/heatPump';

/**
 * Custom styling.
 */
const useStyles = makeStyles({
  buttons: {
    margin: 20,
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
});

/**
 * Represents the buttons which control the time period which is shown on the graph.
 * @param createGraphData helper method for filtering data for the graph
 * @param dataTimePeriod time period in days which data covers
 * @param data contains heat-pump data
 * @param setData method for updating heat pump data of Redux-state
 * @param setDataTimePeriod method for changing time period which data covers
 * @param setUpdating method for changing state of updating, which shows a progress bar
 */
const TimeButtonGroup = ({
  data, dataTimePeriod,
  createGraphData, setData, setDataTimePeriod, setUpdating,
}) => {
  const classes = useStyles();

  /**
   * Handler for clicking '7 days' button.
   * Sets the data coverage of the graph to 7 days.
   */
  const handleSevenDays = async () => {
    setUpdating(true);
    let newData = data;
    if (dataTimePeriod !== 7) {
      newData = await HeatPumpService.getHeatPumpData(7);
      setDataTimePeriod(7);
      setData(newData);
    }
    createGraphData(newData, 7);
    setUpdating(false);
  };

  /**
   * Handler for clicking '2 days' button.
   * Sets the data coverage of the graph to 2 days.
   */
  const handleTwoDays = () => {
    setUpdating(true);
    createGraphData(data, 2);
    setUpdating(false);
  };

  /**
   * Handler for clicking '1 day' button.
   * Sets the data coverage of the graph to 1 day.
   */
  const handleOneDay = () => {
    createGraphData(data, 1);
  };

  return (
    <Grid container item justify="center">
      <ButtonGroup variant="contained" color="primary" className={classes.buttons}>
        <Button onClick={handleSevenDays}>
          7 Days
        </Button>
        <Button onClick={handleTwoDays}>
          2 Days
        </Button>
        <Button onClick={handleOneDay}>
          1 Day
        </Button>
      </ButtonGroup>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps, { setData })(TimeButtonGroup);
