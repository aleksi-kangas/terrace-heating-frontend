import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import clsx from 'clsx';
import { Card, CardContent, Grid, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    margin: 20,
    width: 500,
  },
  green: {
    borderBottom: '10px solid rgba(0, 150, 0, 0.5)',
  },
  yellow: {
    borderBottom: '10px solid rgba(150, 150, 0, 0.5)',
  },
  red: {
    borderBottom: '10px solid rgba(150, 0, 0, 0.5)',
  }
});


const TemperaturePanel = ({ data }) => {
  const [status, setStatus] = useState(null);

  moment.locale('fi');

  const classes = useStyles();

  useEffect(() => {
    if (data) {
      const outsideTemp = data[data.length - 1].outsideTemp;
      if (outsideTemp > 10) {
        setStatus({
          color: classes.green,
          label: 'Normaalikäynnistä 24 tuntia aikaisemmin',
        });
      } else if (outsideTemp < 0) {
        setStatus({
          color: classes.red,
          label: 'Lämmitys ei ole suositeltavaa',
        });
      } else {
        setStatus({
          color: classes.yellow,
          label: 'Pehmokäynnistä 2 vuorokautta aikaisemmin',
        });
      }
    }
  }, [data]);

  if (!status) {
    return <CircularProgress />;
  }

  return (
      <Grid container justify='center'>
        <Grid item component={Card} className={clsx(classes.card, status.color)}>
          <CardContent>
            <Typography variant='h5' align='center'>Ulkolämpotila</Typography>
            <Typography color='textSecondary' variant='h6' align='center'>
              {latest ? latest.outsideTemp + '°C' : <CircularProgress/>}
            </Typography>
            <Typography variant='body1' align='center'>
              {status.label}
            </Typography>
          </CardContent>
        </Grid>
        <Grid item component={Card} className={clsx(classes.card, classes.green)}>
          <CardContent>
            <Typography variant='h5' align='center'>Viimeisin päivitys</Typography>
            <Typography color='textSecondary' variant='h6' align='center'>
              {latest ? moment(latest.time).format('HH:mm') : <CircularProgress/>}
            </Typography>
          </CardContent>
        </Grid>
      </Grid>
  )
};

const mapStateToProps = (state) => {
  return {
    data: state.data
  }
};

export default connect(mapStateToProps)(TemperaturePanel);
