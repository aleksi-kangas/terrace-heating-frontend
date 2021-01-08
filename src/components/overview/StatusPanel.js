import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { Card, CardContent, Checkbox, FormControlLabel, CircularProgress, Grid, Paper, Switch, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import heatPumpService from '../../services/heatPump.js';
import { Line } from 'react-chartjs-2';
import { Atlas6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office.js';

const useStyles = makeStyles({
  container: {
    margin: 20,
  },
  shadow: {
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0'
  },
  text: {
    color: '#131313',
  },
  column: {
    padding: 20,
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

const StatusPanel = ({ data }) => {
  const [activeCircuits, setActiveCircuits] = useState(null);
  const [dataSets, setDataSets] = useState([]);
  const [useSoftStart, setUseSoftStart] = useState(false);

  const classes = useStyles();

  // Fetching active circuits
  useEffect(() => {
    heatPumpService
      .getActiveCircuits()
      .then(res => setActiveCircuits(res));
  }, []);

  useEffect(() => {
    if (data) {
      const dataSet = {
        label: 'Outside Temperature',
        data: data.map((entry) => entry.outsideTemp),
        borderColor: Atlas6[2],
        fill: false,
        pointRadius: 0,
        pointHitRadius: 5,
      };
      setDataSets([dataSet]);
    }
  }, [data]);

  if (!data) return null;

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

  const lineData = {
    labels: data.map((entry) => entry.time),
    datasets: dataSets
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          tooltipFormat: 'YYYY-MM-DD HH:mm',
          unit: 'hour',
          unitStepSize: '1',
          displayFormats: {
            hour: 'HH:mm',
            //day: 'DD MMM',
          },
        },
        ticks: {
          major: {
            enabled: true,
            fontStyle: 'bold',
            fontSize: 14,
          }
        },
        scaleLabel: {
          display: true,
          labelString: 'Time',
        },
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Usage %'
        },
      }],
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
          rangeMin: {
            x: data[0].time.valueOf(),
            y: null
          },
          rangeMax: {
            x: data[data.length - 1].time.valueOf(),
            y: null
          },
        },
        zoom: {
          enabled: true,
          drag: false,
          mode: 'x',
          rangeMin: {
            x: data[0].time.valueOf(),
          },
          rangeMax: {
            x: data[data.length - 1].time.valueOf(),
          },
        },
        speed: 15,
      }
    }
  };

  return (
    <Grid container item justify='space-between' className={classes.container}>
      <Grid container item component={Paper} lg={7} justify='center' direction='column' className={clsx(classes.column, classes.shadow)}>
        <Line data={lineData} options={options} />
      </Grid>
      <Grid container item component={Paper} lg={4} justify='center' direction='column' className={clsx(classes.column, classes.shadow)}>
        <Card className={clsx(classes.card, statusColor())}>
          <CardContent>
            <Typography variant='h6' className={classes.text} align='center'>
              STATUS OF HEAT PUMP CIRCUITS
              WITH SWITCH
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <Grid container justify='space-evenly' component={CardContent}>
            <Grid item>
              <Switch
                checked={activeCircuits === 3}
                onChange={handleTerraceHeatingToggle}
                name="terraceHeatingToggle"
              />
            </Grid>
            <Grid item>
              <FormControlLabel
                control={<Checkbox checked={useSoftStart} onChange={() => setUseSoftStart(!useSoftStart)} name="softStart" />}
                label="Soft Start"
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  )
};

const mapStateToProps = (state) => {
  return {
    data: state.data
  }
};

export default connect(mapStateToProps)(StatusPanel);
