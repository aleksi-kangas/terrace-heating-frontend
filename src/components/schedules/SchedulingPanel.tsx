import React, { useState } from 'react';
import { connect } from 'react-redux';
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
import { useHistory } from 'react-router-dom';
import HeatPumpService from '../../services/heatPump';
import { setScheduleAction } from '../../reducers/heatPumpReducer';
import scheduleDefaults from '../../utils/scheduleDefaults';
import {
  HeatingSchedules, VariableHeatingSchedule, ScheduleVariable, WeekDays, WeekDayScheduleKeys,
} from '../../types';
import { State } from '../../store';

/**
 * Custom styling.
 */
const useStyles = makeStyles({
  panel: {
    padding: 20,
    paddingBottom: 0,
    marginTop: 20,
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
  button: {
    margin: 20,
  },
});

type SchedulingPanelProps = {
  heatingSchedules: HeatingSchedules,
  variable: ScheduleVariable,
  title: string,
  setSchedule: (variable: ScheduleVariable, schedule: VariableHeatingSchedule) => void,
}

/**
 * Represents a single schedule panel which contains properties:
 * start hour, end hour and temperature delta for each weekday.
 * @param heatingSchedules
 * @param variable either 'lowerTank' or 'heatDistCircuit3'
 * @param title text of the schedule panel
 * @param updateSchedule
 */
const SchedulingPanel = ({
  heatingSchedules, variable, title, setSchedule,
}: SchedulingPanelProps) => {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  // Used to force re-render of form to update field values
  const [key, setKey] = useState(Date.now());
  const classes = useStyles();
  const history = useHistory();
  const weekDays = WeekDays;

  // TODO TextField name and handleSubmit
  /**
   * Helper function for creating table rows for a schedule form.
   */
  const createTableRows = () => Object.values(WeekDays).map((weekDay) => (
    <TableRow key={weekDay}>
      <TableCell>
        <Typography align="center">
          {weekDay.substr(0, 3)}
        </Typography>
      </TableCell>
      {Object.values(WeekDayScheduleKeys).map((weekDayScheduleKey) => {
        const variableSchedule = heatingSchedules[variable];
        const weekDaySchedule = variableSchedule[weekDay];
        return (
          <TableCell key={weekDayScheduleKey} size="small" align="center">
            <Grid container justify="center">
              <Grid item sm={6} md={6} lg={6}>
                <TextField
                  name={`${weekDay.toLowerCase()}_${weekDayScheduleKey}`}
                  variant="outlined"
                  size="small"
                  inputProps={{ min: 0, style: { textAlign: 'center' } }}
                  defaultValue={weekDaySchedule[weekDayScheduleKey]}
                />
              </Grid>
            </Grid>
          </TableCell>
        );
      })}
    </TableRow>
  ));

  /**
   * Handler for schedule submission.
   * Sends the inputted schedule to the server.
   */
  // TODO
  // @ts-ignore
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      let schedule: VariableHeatingSchedule = {} as VariableHeatingSchedule;
      Object.values(weekDays).forEach((weekDay: WeekDays) => {
        schedule = {
          ...schedule,
          [weekDay]: {
            start: Number(event.target[`${weekDay.toLowerCase()}_start`].value),
            end: Number(event.target[`${weekDay.toLowerCase()}_end`].value),
            delta: Number(event.target[`${weekDay.toLowerCase()}_delta`].value),
          },
        };
      });
      await HeatPumpService.setSchedule(variable, schedule);
      setSchedule(variable, schedule);
    } catch (error) {
      if (error.response.status === 401) {
        history.push('/login');
      }
    }
  };

  /**
   * Handler for resetting the schedule to the default values.
   */
  const handleDefaults = async () => {
    try {
      await HeatPumpService.setSchedule(variable, scheduleDefaults[variable]);
      setSchedule(variable, scheduleDefaults[variable]);
      setResetDialogOpen(false);
      // Force re-render of form
      setKey(Date.now());
    } catch (error) {
      if (error.response.status === 401) {
        history.push('/login');
      }
    }
  };

  return (
    <Grid key={key} container component={Paper} className={classes.panel}>
      {Object.keys(heatingSchedules).length !== 2 ? (
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
            <Grid container item justify="center">
              <Button type="submit" variant="contained" color="primary" className={classes.button}>
                Save
              </Button>
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={() => setResetDialogOpen(true)}
                className={classes.button}
              >
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
                <Button
                  onClick={() => setResetDialogOpen(false)}
                  color="primary"
                  variant="contained"
                  className={classes.button}
                >
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

const mapStateToProps = (state: State) => ({
  heatingSchedules: state.heatPump.heatingSchedules,
});

export default connect(mapStateToProps, { setSchedule: setScheduleAction })(SchedulingPanel);
