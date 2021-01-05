import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Line } from 'react-chartjs-2';
import GaugeChart from 'react-gauge-chart';
import { Atlas6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.office.js';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    margin: 20,
    padding: 10,
    height: '300px'
  },
});

const UsagePanel = ({ data }) => {
  const classes = useStyles();
  const [latestUsage, setLatestUsage] = useState(0);
  const [dataSets, setDataSets] = useState([]);

  useEffect(() => {
    if (data) {
      const dataSet = {
        label: 'Compressor Usage',
        data: data.map((entry) => {
          if (entry.compressorUsage) {
            return entry.compressorUsage * 100;
          } else {
            return Number.NaN;
          }
        }),
        borderColor: Atlas6[2],
        fill: true,
        pointRadius: 0,
        pointHitRadius: 5,
        spanGaps: true,
      };
      setDataSets([dataSet]);
      const usages = data.filter((entry) => entry.compressorUsage != null);
      setLatestUsage(usages[usages.length - 1].compressorUsage);
    }
  }, [data]);

  if (!data) return null;

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
    <Grid container item component={Paper} className={classes.container} justify='center'>
      <Grid container item lg={4} justify='center' direction='column'>
        <GaugeChart
          id='1'
          animate={false}
          nrOfLevels={20}
          percent={latestUsage}
          textColor='black'
          needleColor='gray'
        />
      </Grid>
      <Grid container item lg={8} justify='center' direction='column'>
        <Line data={lineData} options={options}/>
      </Grid>
    </Grid>
  )
};

const mapStateToProps = (state) => {
  return {
    data: state.data.data
  }
};

export default connect(mapStateToProps)(UsagePanel);
