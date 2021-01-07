import React, { useState } from 'react';
import { AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header.js';
import SideMenu from './SideMenu.js';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles(() => ({
  appBar: {
    background: '#5390fe',
  }
}));

const Navigation = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const classes = useStyles();

  return (
    <div>
      <CssBaseline/>
      <AppBar position="static" className={classes.appBar}>
        <Header setSideMenuOpen={setSideMenuOpen}/>
      </AppBar>
      <SideMenu sideMenuOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen}/>
    </div>
  )
};

export default Navigation;
