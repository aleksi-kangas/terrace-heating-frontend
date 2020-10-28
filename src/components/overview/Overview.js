import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InfoPanel from './InfoPanel.js';

const useStyles = makeStyles({
  container: {
    margin: 50,
    padding: 30,
  },
});

const Overview = ({ data }) => {
  const classes = useStyles();

  return (
    <InfoPanel data={data}/>
  )
};

export default Overview;