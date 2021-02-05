import React, { useState } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  TableCell,
  TableRow,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText, Box, DialogActions, Dialog,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HeatPumpService from '../../services/heatPump';
import { updateSchedule } from '../../reducers/scheduleReducer';
import scheduleDefaults from '../../utils/scheduleDefaults';

/**
 * Custom styling.
 */
const useStyles = makeStyles({
  container: {
    padding: 10,
    marginRight: 50,
    marginLeft: 0,
  },
  shadow: {
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
  value: {
    marginRight: 20,
  },
  button: {
    marginTop: 20,
  },
});

/**
 * Represents a single schedule panel which contains properties:
 * start hour, end hour and temperature delta for each weekday.
 * @param variable either 'lowerTank' or 'heatDistCircuit3'
 * @param title text of the schedule panel
 */
const SchedulingPanel = ({
  schedule, variable, title, updateSchedule,
}) => {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  // Used to force re-render of form to update field values
  const [key, setKey] = useState(Date.now());
  const classes = useStyles();
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  /**
   * Helper function for creating table rows for a schedule form.
   */
  const createTableRows = () => {
    const columnNames = ['start', 'end', 'delta'];

    return weekDays.map((weekDay) => (
      <TableRow key={weekDay}>
        <TableCell>
          <Typography align="center">
            {weekDay.substr(0, 3)}
          </Typography>
        </TableCell>
        {columnNames.map((columnName) => (
          <TableCell key={columnName} size="small" align="center">
            <Grid container justify="center">
              <Grid item sm={6} md={6} lg={6}>
                <TextField
                  name={`${weekDay.toLowerCase()}_${columnName}`}
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 0, style: { textAlign: 'center' } }}
                  defaultValue={schedule[variable][weekDay.toLowerCase()][columnName]}
                />
              </Grid>
            </Grid>
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  /**
   * Handler for schedule submission.
   * Sends the inputted schedule to the server.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    let schedule = {};
    weekDays.forEach((weekDay) => {
      schedule = {
        ...schedule,
        [weekDay.toLowerCase()]: {
          start: Number(event.target[`${weekDay.toLowerCase()}_start`].value),
          end: Number(event.target[`${weekDay.toLowerCase()}_end`].value),
          delta: Number(event.target[`${weekDay.toLowerCase()}_delta`].value),
        },
      };
    });
    await HeatPumpService.setSchedule(variable, schedule);
    updateSchedule(variable, schedule);
  };

  /**
   * Handler for resetting the schedule to the default values.
   */
  const handleDefaults = async () => {
    await HeatPumpService.setSchedule(variable, scheduleDefaults[variable]);
    updateSchedule(variable, scheduleDefaults[variable]);
    setResetDialogOpen(false);
    // Force re-render of form
    setKey(Date.now());
  };

  return (
    <Grid key={key} container component={Paper} className={clsx(classes.container, classes.shadow)}>
      {!schedule || !schedule.lowerTank || !schedule.heatDistCircuit3 ? (
        <Grid container item justify="center">
          <CircularProgress />
        </Grid>
      )
        : (
          <form onSubmit={handleSubmit}>
            <Grid container item justify="center">
              <Typography variant="h5">
                {title}
              </Typography>
            </Grid>
            <Grid item>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell size="small" align="center">Day</TableCell>
                      <TableCell size="small" align="center">Start Hour</TableCell>
                      <TableCell size="small" align="center">End Hour</TableCell>
                      <TableCell size="small" align="center">Delta (+ °C)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {createTableRows()}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid container item justify="space-evenly" className={classes.button}>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
              <Button type="button" variant="contained" color="primary" onClick={() => setResetDialogOpen(true)}>
                Default
              </Button>
            </Grid>
            <Dialog
              open={resetDialogOpen}
              onClose={() => setResetDialogOpen(false)}
            >
              <DialogTitle>
                Reset to Defaults
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <Box fontWeight="bold" component="span">
                    {`Are you sure you want to reset schedule of ${title} to defaults?`}
                  </Box>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setResetDialogOpen(false)} color="primary" variant="contained" className={classes.button}>
                  No
                </Button>
                <Button onClick={handleDefaults} color="primary" variant="contained" className={classes.button}>
                  Yes
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        )}
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  schedule: state.schedule,
});

export default connect(mapStateToProps, { updateSchedule })(SchedulingPanel);
