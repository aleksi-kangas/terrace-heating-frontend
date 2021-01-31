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
  buttonGroup: {
    padding: 10,
  },
  shadow: {
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
});

const TimeButtonGroup = ({
  data, dataTimePeriod,
  createGraphData, setData, setDataTimePeriod,
}) => {
  const classes = useStyles();

  const handleSevenDays = async () => {
    let newData = data;
    if (dataTimePeriod !== 7) {
      newData = await HeatPumpService.getHeatPumpData(7);
      setDataTimePeriod(7);
      setData(newData);
    }
    createGraphData(data, 7);
  };

  const handleTwoDays = () => {
    createGraphData(data, 2);
  };

  const handleOneDay = () => {
    createGraphData(data, 1);
  };

  return (
    <Grid container item justify="center" className={classes.buttonGroup}>
      <ButtonGroup variant="contained" color="primary" className={classes.shadow}>
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
