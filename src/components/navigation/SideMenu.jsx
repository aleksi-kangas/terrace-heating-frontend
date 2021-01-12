import React from 'react';
import {
  Button, Drawer, List, ListItem, ListItemText,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import TuneIcon from '@material-ui/icons/Tune';
import { makeStyles } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  // Necessary for content to be below appbar
  toolbar: theme.mixins.toolbar,
  button: {
    marginLeft: 5,
    padding: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: blueGrey[400],
    borderStyle: 'solid',
    width: '100px',
  },
  listItem: {
    marginBottom: -10,
  },
  paper: {
    background: '#F6F7FF',
  },
}));

const SideMenu = ({ sideMenuOpen, setSideMenuOpen }) => {
  const classes = useStyles();

  const drawer = (
    <List>
      <ListItem className={classes.listItem}>
        <AssessmentIcon />
        <Link to="/" style={{ textDecoration: 'none' }}>
          <ListItemText>
            <Button color="primary" onClick={() => setSideMenuOpen(false)} className={classes.button}>
              Overview
            </Button>
          </ListItemText>
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <ShowChartIcon />
        <Link to="/graphs/1" style={{ textDecoration: 'none' }}>
          <ListItemText>
            <Button color="primary" onClick={() => setSideMenuOpen(false)} className={classes.button}>
              Graphs
            </Button>
          </ListItemText>
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <TuneIcon />
        <Link to="/control" style={{ textDecoration: 'none' }}>
          <ListItemText>
            <Button color="primary" onClick={() => setSideMenuOpen(false)} className={classes.button}>
              Control
            </Button>
          </ListItemText>
        </Link>
      </ListItem>
    </List>
  );

  return (
    <Drawer
      classes={{ paper: classes.paper }}
      variant="temporary"
      anchor="left"
      open={sideMenuOpen}
      onClose={() => setSideMenuOpen(false)}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      className={classes.toolbar}
    >
      {drawer}
    </Drawer>
  );
};

export default SideMenu;
