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
  Grid,
  Paper,
  Switch,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import heatPumpService from '../../services/heatPump';
import { setHeatingStatusAction, setSchedulingEnabledAction } from '../../reducers/heatPumpReducer';
import { removeNotificationAction, setNotificationAction } from '../../reducers/notificationReducer';
import { HeatingStatus, NotificationType } from '../../types';
import { State } from '../../store';

/**
 * Custom styling.
 */
const useStyles = makeStyles({
  panel: {
    margin: 20,
    height: '300px',
    padding: 10,
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
  text: {
    color: '#131313',
    margin: 10,
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

type TogglePanelProps = {
  latestOutsideTemp: number | undefined,
  heatingStatus: HeatingStatus,
  setHeatingStatus: (heatingStatus: HeatingStatus) => void,
  setSchedulingEnabled: (schedulingEnabled: boolean) => void,
  setNotification: (message: string, type: NotificationType) => void,
  removeNotification: () => void,
}

/**
 * Represents the panel which holds the heating control switch and status information.
 */
const TogglePanel = ({
  latestOutsideTemp, heatingStatus, setHeatingStatus, setSchedulingEnabled, setNotification, removeNotification,
}: TogglePanelProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusHeader, setStatusHeader] = useState<string>('');
  const [statusText, setStatusText] = useState<string>('');
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const [dialogText, setDialogText] = useState<string>('');
  const [dialogQuestion, setDialogQuestion] = useState<string>('');

  const classes = useStyles();

  useEffect(() => {
    // Conditionally determine content for the startup dialog
    if (latestOutsideTemp !== undefined) {
      if (latestOutsideTemp > 0 && latestOutsideTemp < 10) {
        // Outside temp between 0 and 10 celsius -> Soft-start should be used
        setDialogTitle('Use soft-start?');
        setDialogText('It is recommended to use soft-start due to cold outside temperature.');
        setDialogQuestion('Do you want to use soft-start?');
      } else if (latestOutsideTemp < 0) {
        // Outside temp is below 0 celsius -> Heating is not recommended
        setDialogTitle('Heating not recommended');
        setDialogText('Heating is NOT recommended due to cold outside temperature. Soft-start is forced on.');
        setDialogQuestion('Are you sure you want to start heating?');
      }
    }
  }, [latestOutsideTemp]);

  useEffect(() => {
    // Conditionally determine the status information text
    if (heatingStatus === HeatingStatus.Stopped) {
      setStatusHeader('Heating Disabled');
      setStatusText('');
    } else {
      setStatusHeader('Heating Enabled');
      if (heatingStatus === HeatingStatus.Running) {
        setStatusText('Normal Heating');
      } else if (heatingStatus === HeatingStatus.Boosting) {
        setStatusText('Scheduled Boosting');
      } else if (heatingStatus === HeatingStatus.SoftStart) {
        setStatusText('Soft-Starting');
      }
    }
  }, [heatingStatus]);

  if (latestOutsideTemp === undefined) {
    return (
      <Grid
        container
        item
        component={Paper}
        sm={12}
        lg={4}
        className={classes.panel}
        justify="center"
        alignItems="center"
      >
        <CircularProgress />
      </Grid>
    );
  }

  /**
   * Helper method for closing the dialog and notifying user with a message.
   * @param message string
   * @param type NotificationType
   */
  const notify = (message: string, type: NotificationType) => {
    setDialogOpen(false);
    setNotification(message, type);
    setTimeout(() => {
      removeNotification();
    }, 5000);
  };

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
    setHeatingStatus(newStatus);
    setSchedulingEnabled(true);
    notify('Heating Enabled', NotificationType.Success);
  };

  /**
   * Starts the heating system by using a 'soft-start' process.
   * Soft-start means that circuit 3 is switched on,
   * and after 12 hours the schedules will be enabled.
   */
  const softStartup = async () => {
    const newStatus = await heatPumpService.startCircuitThree(true);
    setHeatingStatus(newStatus);
    notify('Heating Enabled', NotificationType.Success);
  };

  /**
   * Shuts down the heating system.
   * Shutting down means switching off circuit 3 and the schedules.
   */
  const shutdown = async () => {
    const newStatus = await heatPumpService.stopCircuitThree();
    setHeatingStatus(newStatus);
    setSchedulingEnabled(false);
    notify('Heating Disabled', NotificationType.Info);
  };

  /**
   * Handler for toggling the heating status.
   * Depending on current status of the heating system and outside temperature,
   * the heating system is either started via soft-start, normally or shut down.
   */
  const handleTerraceHeatingToggle = async () => {
    if (heatingStatus === HeatingStatus.Stopped && latestOutsideTemp < 10) {
      setDialogOpen(true);
    } else if (heatingStatus === HeatingStatus.Stopped) {
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
    if (latestOutsideTemp > 0 && latestOutsideTemp < 10) {
      await normalStartup();
    } else if (latestOutsideTemp < 0) {
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
      className={classes.panel}
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
              checked={heatingStatus !== HeatingStatus.Stopped}
              onChange={handleTerraceHeatingToggle}
              name="terraceHeatingToggle"
              color="primary"
              style={{ pointerEvents: 'auto' }}
            />
          )}
          label={heatingStatus === HeatingStatus.Stopped ? 'Off' : 'On'}
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

const mapStateToProps = (state: State) => ({
  heatingStatus: state.heatPump.heatingStatus,
});

export default connect(
  mapStateToProps, {
    setHeatingStatus: setHeatingStatusAction,
    setSchedulingEnabled: setSchedulingEnabledAction,
    setNotification: setNotificationAction,
    removeNotification: removeNotificationAction,
  },
)(TogglePanel);
