import React from 'react';
import { connect } from 'react-redux';
import HeatPumpService from '../../services/heatPump.js';
import clsx from 'clsx';
import {
  Button, CircularProgress, Grid, Paper,
  Table, TableHead, TableBody, TableContainer, TableCell, TableRow, TextField, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { setSchedule } from '../../reducers/scheduleReducer.js';

const useStyles = makeStyles({
  container: {
    padding: 20,
    margin: 20
  },
  shadow: {
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0'
  },
  value: {
   marginRight: 20
  },
  switchButton: {
    marginTop: 20,
  },
});

const SchedulingPanel = ({ schedule, variable, title, setSchedule }) => {

  const classes = useStyles();

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const createRows = () => {
    const columnNames = ['start', 'end', 'delta'];

    return weekDays.map((weekDay) => (
      <TableRow key={weekDay}>
        <TableCell>
          <Typography>
            {weekDay}
          </Typography>
        </TableCell>
        {columnNames.map((columnName) => (
          <TableCell key={columnName} size='small'>
            <Grid container justify='flex-start'>
              <Grid container item alignItems='center' xs={1} sm={1} md={1} lg={1} xl={1} className={classes.value}>
                <Typography>
                  {schedule[variable][weekDay.toLowerCase()][columnName]}
                </Typography>
              </Grid>
              <Grid item xs={8} sm={8} md={4} lg={8} xl={6}>
                <TextField
                  variant='outlined'
                  size='small'
                  defaultValue={schedule[variable][weekDay.toLowerCase()][columnName]}
                />
              </Grid>
            </Grid>
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let schedule = {};
    weekDays.forEach((weekDay) => {
      schedule = {...schedule, [weekDay.toLowerCase()]: {
          start: event.target[`${weekDay}_start`].value,
          end: event.target[`${weekDay}_end`].value,
          delta: event.target[`${weekDay}_delta`].value
        }}
    });
    await HeatPumpService.setSchedule(variable, schedule);
  };

  return (
    <Grid container component={Paper} className={clsx(classes.container, classes.shadow)}>
      {!schedule || !schedule.lowerTank || !schedule.heatDistCircuit3 ? <CircularProgress/> :
      <form onSubmit={handleSubmit}>
        <Grid container item justify='center'>
          <Typography variant='h5'>
            {title}
          </Typography>
        </Grid>
        <Grid item>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell size='small'>Weekday</TableCell>
                  <TableCell size='small'>Start Hour</TableCell>
                  <TableCell size='small'>End Hour</TableCell>
                  <TableCell size='small'>Temperature Delta (+ °C)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {createRows()}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid container item justify='space-evenly'>
          <Button type='submit' variant='contained' color='primary' className={classes.switchButton}>
            Save
          </Button>
        </Grid>
      </form>
      }
    </Grid>
  )
};

const mapStateToProps = (state) => {
  return {
    schedule: state.schedule,
  }
};

export default connect(mapStateToProps, { setSchedule })(SchedulingPanel);
