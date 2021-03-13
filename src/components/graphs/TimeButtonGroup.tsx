import React from 'react';
import { Button, ButtonGroup, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
/**
 * Custom styling.
 */
const useStyles = makeStyles({
  buttons: {
    margin: 20,
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
});

type TimeButtonGroupProps = {
  setGraphDataCoverageDays: (days: number) => void,
}

/**
 * Represents the buttons which control the time period which is shown on the graph.
 * @param createGraphData helper method for filtering data for the graph
 */
const TimeButtonGroup = ({
  setGraphDataCoverageDays,
}: TimeButtonGroupProps): JSX.Element => {
  const classes = useStyles();

  return (
    <Grid container item justify="center">
      <ButtonGroup variant="contained" color="primary" className={classes.buttons}>
        <Button onClick={() => setGraphDataCoverageDays(7)}>
          7 Days
        </Button>
        <Button onClick={() => setGraphDataCoverageDays(2)}>
          2 Days
        </Button>
        <Button onClick={() => setGraphDataCoverageDays(1)}>
          1 Day
        </Button>
      </ButtonGroup>
    </Grid>
  );
};

export default TimeButtonGroup;
