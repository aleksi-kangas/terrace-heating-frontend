import React, { useState } from 'react';
import { Card, CardActions, CardContent, Grid, Switch, Typography } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from '@material-ui/icons/Close';
import SchedulingPanel from './SchedulingPanel.js';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    padding: 50,
  },
  card: {
    margin: 20,
  }
});

const Control = () => {
  const [scheduleActive, setScheduleActive] = useState(false);
  const classes = useStyles();

  const handleScheduleToggle = async () => {
    // TODO
    console.log('Toggled');
    setScheduleActive(!scheduleActive)
  };

  return (
    <Grid container direction='column' alignItems='center'>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant='h5'>
            Scheduling
          </Typography>
        </CardContent>
        <CardActions>
          <Grid container item justify='center' alignItems='center'>
            <Switch className={classes.switchButton}
                    color='primary'
                    checked={scheduleActive}
                    onChange={handleScheduleToggle}
                    name='scheduleActiveToggle'
            />
            {scheduleActive ? <CheckCircleOutlineIcon color='primary' /> : <CloseIcon />}
          </Grid>
        </CardActions>
      </Card>
      <Grid container justify='center'>
        <Grid container item lg={4} justify='center'>
          <SchedulingPanel variable='lowerTank' title='Lower Tank'/>
        </Grid>
        <Grid container item lg={4} justify='center'>
          <SchedulingPanel variable='heatDistCircuit3' title='Circuit 3'/>
        </Grid>
      </Grid>
    </Grid>
  )
};

export default Control;
