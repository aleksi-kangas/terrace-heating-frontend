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
import heatPumpService from '../../services/heatPump.js';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    padding: 10,
  },
  shadow: {
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0'
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
    borderBottom: '10px solid rgba(100, 100, 100, 0.5)'
  },
  active: {
    borderBottom: '10px solid rgba(0, 150, 0, 0.5)',
  },
  stopped: {
    borderBottom: '10px solid rgba(150, 0, 0, 0.5)',
  }
});

const TogglePanel = ({ data }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCircuits, setActiveCircuits] = useState(null);
  const [outsideTemp, setOutsideTemp] = useState(null);
  const [recommended, setRecommended] = useState(null);

  const classes = useStyles();

  // Fetching active circuits
  useEffect(() => {
    heatPumpService
      .getActiveCircuits()
      .then(res => setActiveCircuits(res));
  }, []);

  useEffect(() => {
    if (data) {
      const latest = data[data.length - 1];
      setOutsideTemp(latest.outsideTemp);
      if (latest.outsideTemp > 0 && latest.outsideTemp < 10) {
        setRecommended('It is recommended to use soft-start due to cold outside temperature.')
      } else if (latest.outsideTemp < 0) {
        setRecommended(null);
      } else {
        setRecommended('It is recommended to not use soft-start.')
      }
    }
  }, [data]);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleNormalStartup = async () => {
    await heatPumpService.startCircuitThree(true);
    setActiveCircuits(3);
  };

  const handleSoftStartStartup = async () => {
    await heatPumpService.startCircuitThree(true);
    setActiveCircuits(3);
  };

  const handleShutdown = async () => {
    await heatPumpService.stopCircuitThree();
    setActiveCircuits(2);
  };

  const handleTerraceHeatingToggle = async () => {
    if (activeCircuits !== 3 && recommended) {
      setDialogOpen(true);
    } else if (activeCircuits !== 3) {
      await handleNormalStartup();
    } else {
      await handleShutdown();
    }
  };

  return (
    <Grid container item component={Paper} lg={4} className={clsx(classes.container, classes.shadow)}>
      <Typography variant='h6' className={classes.text} align='center'>
        Status of circuit 3 (3 colors, soft start indicated)
      </Typography>
      <Switch
        checked={activeCircuits === 3}
        onChange={handleTerraceHeatingToggle}
        name='terraceHeatingToggle'
      />
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
      >
        <DialogTitle>
          Use soft-start?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Soft-start enables heating schedules for lower tank and circuit 3 to boost heating performance during startup.
            <Box fontWeight='bold'>
              {recommended}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNormalStartup} color='primary'>
            No
          </Button>
          <Button onClick={handleSoftStartStartup} color='primary' autoFocus={outsideTemp < 0}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
};

const mapStateToProps = (state) => {
  return {
    data: state.data,
  }
};

export default connect(mapStateToProps, null)(TogglePanel);
