import React from 'react';
import { Button, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AssessmentIcon from '@material-ui/icons/Assessment.js';
import CloseIcon from '@material-ui/icons/Close.js';
import ShowChartIcon from '@material-ui/icons/ShowChart.js';
import TuneIcon from '@material-ui/icons/Tune.js';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  sideMenu: {
    background: 'lightgray'
  }
}));

const SideMenu = ({ sideMenuOpen, setSideMenuOpen }) => {

  const classes = useStyles();

  return (
    <Drawer anchor="left" open={sideMenuOpen} className={classes.sideMenu}>
      <List>
        <ListItem>
          <Button onClick={() => setSideMenuOpen(false)}>
            <CloseIcon />
          </Button>
        </ListItem>
        <ListItem>
          <AssessmentIcon />
          <Link to='/'>
            <Button color="primary" onClick={() => setSideMenuOpen(false)}>
              <ListItemText>
                Overview
              </ListItemText>
            </Button>
          </Link>
        </ListItem>
        <ListItem>
          <ShowChartIcon />
          <Link to='/graphs'>
            <Button color="primary" onClick={() => setSideMenuOpen(false)}>
              <ListItemText>
                Graphs
              </ListItemText>
            </Button>
          </Link>
        </ListItem>
        <ListItem>
          <TuneIcon />
          <Link to='/control'>
            <Button color="primary" onClick={() => setSideMenuOpen(false)}>
              <ListItemText>
                Control
              </ListItemText>
            </Button>
          </Link>
        </ListItem>
      </List>
    </Drawer>
  )
};

export default SideMenu;