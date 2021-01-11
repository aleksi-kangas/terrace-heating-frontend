import React, { useEffect, useState } from 'react';
import HeatPumpService from '../../services/heatPump.js';
import {
  Button, CircularProgress, Grid, Paper, Switch,
  Table, TableHead, TableBody, TableContainer, TableCell, TableRow, TextField, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    padding: 20,
    margin: 20
  },
  value: {
   marginRight: 20
  },
  switchButton: {
    marginTop: 20,
  },
});

const SchedulingPanel = ({ variable, title }) => {
  const [registerValues, setRegisterValues] = useState(null);

  const classes = useStyles();

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (variable === 'lowerTank' || variable === 'heatDistCircuit3') {
      HeatPumpService
        .getSchedule(variable)
        .then((res) => {
          setRegisterValues(res)
        })
    }
  }, [variable]);

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
                  {registerValues[weekDay.toLowerCase()][columnName]}
                </Typography>
              </Grid>
              <Grid item xs={8} sm={8} md={4} lg={8} xl={6}>
                <TextField
                  variant='outlined'
                  size='small'
                  defaultValue={registerValues[weekDay.toLowerCase()][columnName]}
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
    <Grid container component={Paper} className={classes.container}>
      {!registerValues ? <CircularProgress/> :
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

export default SchedulingPanel;
