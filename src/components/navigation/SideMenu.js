import React from 'react';
import { Button, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AssessmentIcon from '@material-ui/icons/Assessment.js';
import ShowChartIcon from '@material-ui/icons/ShowChart.js';
import TuneIcon from '@material-ui/icons/Tune.js';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  // Necessary for content to be below appbar
  toolbar: theme.mixins.toolbar
}));

const SideMenu = ({ sideMenuOpen, setSideMenuOpen }) => {

  const classes = useStyles();

  const drawer = (
    <div>
      <div className={classes.toolbar}/>
      <List>
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
    </div>
  );

  return (
    <Drawer
      variant="temporary"
      anchor='left'
      open={sideMenuOpen}
      onClose={() => setSideMenuOpen(false)}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default SideMenu;