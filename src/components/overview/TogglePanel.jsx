import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid, Paper,
  Switch, Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import heatPumpService from '../../services/heatPump';
import { fetchStatus, setStatus } from '../../reducers/statusReducer';
import { updateScheduling } from '../../reducers/scheduleReducer';
import { setNotification, removeNotification } from '../../reducers/notificationReducer';

/**
 * Custom styling.
 */
const useStyles = makeStyles({
  container: {
    marginBottom: 40,
    height: '300px',
    padding: 10,
  },
  shadow: {
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
  text: {
    color: '#131313',
  },
  switchBox: {
    borderRadius: 10,
    borderColor: '#2f4050',
    borderWidth: 2,
    borderStyle: 'solid',
    margin: 0,
    padding: 10,
    pointerEvents: 'none',
  },
  dialogButton: {
    margin: 10,
  },
});

/**
 * Represents the panel which holds the heating control switch and status information.
 */
const TogglePanel = ({
  data, status, setStatus, updateScheduling, setNotification, removeNotification,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [outsideTemp, setOutsideTemp] = useState(null);
  const [statusHeader, setStatusHeader] = useState(null);
  const [statusText, setStatusText] = useState(null);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogText, setDialogText] = useState(null);
  const [dialogQuestion, setDialogQuestion] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    // Conditionally determine content for the startup dialog
    if (data) {
      const latest = data[data.length - 1];
      setOutsideTemp(latest.outsideTemp);
      if (latest.outsideTemp > 0 && latest.outsideTemp < 10) {
        setDialogTitle('Use soft-start?');
        setDialogText('It is recommended to use soft-start due to cold outside temperature.');
        setDialogQuestion('Do you want to use soft-start?');
      } else if (latest.outsideTemp < 0) {
        setDialogTitle('Heating not recommended');
        setDialogText('Heating is NOT recommended due to cold outside temperature. Soft-start is forced on.');
        setDialogQuestion('Are you sure you want to start heating?');
      }
    }
  }, [data]);

  useEffect(() => {
    // Conditionally determine the status information text
    if (status === 'running' || status === 'boosting' || status === 'softStart') {
      setStatusHeader('Heating Enabled');
    } else {
      setStatusHeader('Heating Disabled');
      setStatusText(null);
    }
    if (status === 'boosting') {
      setStatusText('Scheduled boosting');
    } else if (status === 'softStart') {
      setStatusText('Soft-starting');
    } else if (status === 'running') {
      setDialogText('Upkeep period');
    } else {
      setStatusText(null);
    }
  }, [status]);

  if (!data) {
    return (
      <Grid container item component={Paper} sm={12} lg={4} className={clsx(classes.container, classes.shadow)} justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }

  /**
   * Closes the dialog.
   */
  const handleClose = () => {
    setDialogOpen(false);
  };

  /**
   * Start the heating system normally.
   * Normal startup means that circuit 3 is started and schedules are enabled straight away.
   */
  const normalStartup = async () => {
    const newStatus = await heatPumpService.startCircuitThree(false);
    setStatus(newStatus);
    updateScheduling(true);
    setDialogOpen(false);
    setNotification('Heating enabled', 'success');
    setTimeout(() => {
      removeNotification();
    }, 5000);
  };

  /**
   * Starts the heating system by using a 'soft-start' process.
   * Soft-start means that circuit 3 is switched on,
   * and after 12 hours the schedules will be enabled.
   */
  const softStartup = async () => {
    const newStatus = await heatPumpService.startCircuitThree(true);
    setStatus(newStatus);
    setDialogOpen(false);
    setNotification('Heating enabled', 'success');
    setTimeout(() => {
      removeNotification();
    }, 5000);
  };

  /**
   * Shuts down the heating system.
   * Shutting down means switching off circuit 3 and the schedules.
   */
  const shutdown = async () => {
    const newStatus = await heatPumpService.stopCircuitThree();
    setStatus(newStatus);
    updateScheduling(false);
    setDialogOpen(false);
    setNotification('Heating disabled', 'info');
    setTimeout(() => {
      removeNotification();
    }, 5000);
  };

  /**
   * Handler for toggling the heating status.
   * Depending on current status of the heating system and outside temperature,
   * the heating system is either started via soft-start, normally or shut down.
   */
  const handleTerraceHeatingToggle = async () => {
    if (status === 'stopped' && outsideTemp < 10) {
      setDialogOpen(true);
    } else if (status === 'stopped') {
      await normalStartup();
    } else {
      await shutdown();
    }
  };

  /**
   * Handler for decline action from the dialog.
   * Depending on outside temperature heating is started normally or nothing happens.
   */
  const handleDecline = async () => {
    if (outsideTemp > 0 && outsideTemp < 10) {
      await normalStartup();
    } else if (outsideTemp < 0) {
      setDialogOpen(false);
    }
  };

  /**
   * Handler for accept action from the dialog.
   * Starts heating system via soft-start.
   */
  const handleAccept = async () => {
    await softStartup();
  };

  return (
    <Grid
      container
      item
      direction="column"
      component={Paper}
      sm={12}
      md={3}
      lg={4}
      className={clsx(classes.container, classes.shadow)}
      justify="space-evenly"
      alignItems="center"
    >
      <Grid item>
        <Typography variant="h6" className={classes.text} align="center">
          {statusHeader}
        </Typography>
        <Typography align="center">
          {statusText}
        </Typography>
      </Grid>
      <Grid item>
        <FormControlLabel
          control={(
            <Switch
              checked={status === 'running' || status === 'softStart' || status === 'boosting'}
              onChange={handleTerraceHeatingToggle}
              name="terraceHeatingToggle"
              color="primary"
              style={{ pointerEvents: 'auto' }}
            />
          )}
          label={status === 'stopped' ? 'Off' : 'On'}
          labelPlacement="start"
          className={classes.switchBox}
        />
      </Grid>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
      >
        <DialogTitle>
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogText}
            <br />
            <Box fontWeight="bold" component="span">
              {dialogQuestion}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDecline} color="primary" variant="contained" className={classes.dialogButton}>
            No
          </Button>
          <Button onClick={handleAccept} color="primary" variant="contained" className={classes.dialogButton}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
  status: state.status,
});

export default connect(
  mapStateToProps, {
    fetchStatus, setStatus, updateScheduling, setNotification, removeNotification,
  },
)(TogglePanel);
