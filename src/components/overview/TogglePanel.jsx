import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid, Paper,
  Switch, Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import heatPumpService from '../../services/heatPump';
import { setActiveCircuits } from '../../reducers/circuitReducer';

const useStyles = makeStyles({
  container: {
    padding: 10,
  },
  shadow: {
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
  text: {
    color: '#131313',
  },
  column: {
    padding: 10,
  },
  card: {
    margin: 10,
  },
  loading: {
    borderBottom: '10px solid rgba(100, 100, 100, 0.5)',
  },
  active: {
    borderBottom: '10px solid rgba(0, 150, 0, 0.5)',
  },
  stopped: {
    borderBottom: '10px solid rgba(150, 0, 0, 0.5)',
  },
});

const TogglePanel = ({
  data, circuits, fetchActiveCircuits, setActiveCircuits,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [outsideTemp, setOutsideTemp] = useState(null);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogText, setDialogText] = useState(null);
  const [dialogQuestion, setDialogQuestion] = useState(null);

  const classes = useStyles();

  useEffect(() => {
    if (data) {
      const latest = data[data.length - 1];
      setOutsideTemp(latest.outsideTemp);
      if (latest.outsideTemp > 0 && latest.outsideTemp < 10) {
        setDialogTitle('Use soft-start?');
        setDialogText('It is recommended to use soft-start due to cold outside temperature.');
        setDialogQuestion('Do you want to use soft-start?');
      } else if (latest.outsideTemp < 0) {
        setDialogTitle('Start heating?');
        setDialogText('Heating is NOT recommended due to cold outside temperature. Soft-start is forced on.');
        setDialogQuestion('Are you sure you want to start heating?');
      }
    }
  }, [data]);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const normalStartup = async () => {
    await heatPumpService.startCircuitThree(false);
    // await heatPumpService.enableScheduling();
    setActiveCircuits(3);
  };

  const softStartup = async () => {
    await heatPumpService.startCircuitThree(true);
    // await heatPumpService.softStart();
    setActiveCircuits(3);
  };

  const shutdown = async () => {
    await heatPumpService.stopCircuitThree();
    // TODO Needed?
    // await heatPumpService.disableScheduling();
    setActiveCircuits(2);
  };

  const handleTerraceHeatingToggle = async () => {
    if (circuits !== 3 && outsideTemp < 10) {
      setDialogOpen(true);
    } else if (circuits !== 3) {
      await normalStartup();
    } else {
      await shutdown();
    }
  };

  const handleDecline = async () => {
    if (outsideTemp > 0 && outsideTemp < 10) {
      await normalStartup();
    } else if (outsideTemp < 0) {
      // TODO NOTHING
    }
  };

  const handleAccept = async () => {
    if (outsideTemp > 0 && outsideTemp < 10) {
      await softStartup();
    } else if (outsideTemp < 0) {
      await softStartup();
    }
  };

  return (
    <Grid container item component={Paper} lg={4} className={clsx(classes.container, classes.shadow)}>
      <Typography variant="h6" className={classes.text} align="center">
        Status of circuit 3 (3 colors, soft start indicated)
      </Typography>
      <Switch
        checked={circuits === 3}
        onChange={handleTerraceHeatingToggle}
        name="terraceHeatingToggle"
      />
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
            <Box fontWeight="bold">
              {dialogQuestion}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDecline} color="primary">
            No
          </Button>
          <Button onClick={handleAccept} color="primary" autoFocus={outsideTemp < 0}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
  circuits: state.circuits,
});

export default connect(mapStateToProps, { setActiveCircuits })(TogglePanel);
