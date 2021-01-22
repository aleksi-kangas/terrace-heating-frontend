import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import GaugeChart from 'react-gauge-chart';
import {
  CircularProgress,
  Grid, Paper, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
  gauge: {
    padding: 20,
  },
});

/**
 * Represents the panel which holds a graph and gauge of compressor usage.
 * Usages are represented as percentages of running time / cycle time,
 * where cycle is defined as compressor start -> stop -> start.
 */
const CompressorUsageGauge = ({ data }) => {
  const classes = useStyles();
  const [latestUsage, setLatestUsage] = useState(0);

  useEffect(() => {
    // Extract latest compressor usage from the data
    if (data) {
      const usages = data.filter((entry) => entry.compressorUsage != null);
      if (usages.length !== 0) {
        setLatestUsage(usages[usages.length - 1].compressorUsage);
      }
    }
  }, [data]);

  if (!data) {
    return (
      <Grid container item component={Paper} className={clsx(classes.container, classes.shadow)} alignItems="center" justify="center">
        <Grid item>
          <CircularProgress />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid
      container
      item
      component={Paper}
      sm={12}
      md={3}
      lg={3}
      alignItems="center"
      justify="center"
      direction="column"
      className={clsx(classes.container, classes.shadow)}
    >
      <Grid item>
        <GaugeChart
          id="1"
          animate={false}
          nrOfLevels={20}
          percent={latestUsage}
          textColor="black"
          needleColor="gray"
        />
      </Grid>
      <Grid item>
        <Typography variant="h6" className={classes.text} align="center">
          Compressor Usage
        </Typography>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  data: state.data,
});

export default connect(mapStateToProps)(CompressorUsageGauge);
