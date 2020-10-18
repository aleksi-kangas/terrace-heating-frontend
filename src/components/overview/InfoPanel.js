import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Card, CardContent, Grid, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    margin: '50px',
  },
  card: {
    borderBottom: '10px solid rgba(0, 150, 0, 0.5)',
    margin: '0 2px !important',
    width: 200,
  },
});


const InfoPanel = ({ data }) => {
  const [latest, setLatest] = useState(null);

  moment.locale('fi');

  const classes = useStyles();

  useEffect(() => {
    if (data) {
      setLatest(data[data.length - 1]);
    }
  }, [data]);

  return (
    <div>
      <Grid container className={classes.container}>
        <Grid item component={Card} className={classes.card}>
          <CardContent>
            <Typography color='textSecondary' gutterBottom>Inside Temperature</Typography>
            <Typography variant='h5'>
              {latest ? latest.insideTemp + "°C" : <CircularProgress/>}
            </Typography>
          </CardContent>
        </Grid>
        <Grid item component={Card} className={classes.card}>
          <CardContent>
            <Typography color='textSecondary' gutterBottom>Outside Temperature</Typography>
            <Typography variant='h5'>
              {latest ? latest.outsideTemp + "°C" : <CircularProgress/>}
            </Typography>
          </CardContent>
        </Grid>
        <Grid item component={Card} className={classes.card}>
          <CardContent>
            <Typography color='textSecondary' gutterBottom>Latest update</Typography>
            <Typography variant='h5'>
              {latest ? moment(latest.time).format('HH:mm') : <CircularProgress/>}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
    </div>
  )
};

export default InfoPanel;