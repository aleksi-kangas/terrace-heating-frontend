import React, { useState } from 'react';
import { AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Header from './Header';
import SideMenu from './SideMenu';

/**
 * Custom styling.
 */
const useStyles = makeStyles(() => ({
  appBar: {
    background: '#5390fe',
  },
}));

/**
 * Responsible for rendering the Toolbar and SideMenu for navigation.
 */
const Navigation = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const classes = useStyles();

  return (
    <div>
      <CssBaseline />
      <AppBar position="static" className={classes.appBar}>
        <Header setSideMenuOpen={setSideMenuOpen} />
      </AppBar>
      <SideMenu sideMenuOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen} />
    </div>
  );
};

export default Navigation;
