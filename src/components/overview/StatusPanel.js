import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { Card, CardContent, CircularProgress, Grid, Switch, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import heatPumpService from '../../services/heatPump.js';

const useStyles = makeStyles({
  card: {
    margin: 20,
    width: 200,
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

const StatusPanel = () => {
  const [activeCircuits, setActiveCircuits] = useState(null);

  const classes = useStyles();

  // Fetching active circuits
  useEffect(() => {
    heatPumpService
      .getActiveCircuits()
      .then(res => setActiveCircuits(res));
  }, []);

  const statusColor = () => {
    if (!activeCircuits) return classes.loading;
    if (activeCircuits < 3) {
      return classes.stopped;
    } else {
      return classes.active;
    }
  };

  const handleTerraceHeatingToggle = async () => {
    const value = activeCircuits === 3 ? 2 : 3;
    await heatPumpService.toggleCircuitThree(value);
    setActiveCircuits(value);
  };

  return (
    <Grid container direction='column'>
      <Grid item container justify='center'>
        <Grid item component={Card} className={clsx(classes.card, statusColor())}>
          <CardContent>
            <Typography variant='h6' align='center'>Terassilämmitys</Typography>
            <Typography color='textSecondary' align='center' component={'span'}>
              { activeCircuits ? (activeCircuits === 3 ? 'Päällä' : 'Pois päältä') : <CircularProgress/> }
            </Typography>
          </CardContent>
        </Grid>
        <Grid item component={Card} className={clsx(classes.card, statusColor())}>
          <Switch
            checked={activeCircuits === 3}
            onChange={handleTerraceHeatingToggle}
            name="terraceHeatingToggle"
          />

        </Grid>
      </Grid>
    </Grid>
  )
};

const mapStateToProps = (state) => {
  return {
    data: state.data.data,
    latest: state.data.latest
  }
};

export default connect(mapStateToProps)(StatusPanel);