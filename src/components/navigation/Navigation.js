import React, { useState } from 'react';
import { AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header.js';
import SideMenu from './SideMenu.js';

const useStyles = makeStyles(() => ({
  appBar: {
    background: 'lightgray',
  }
}));

const Navigation = ({ user, setUser }) => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const classes = useStyles();

  return (
    <AppBar position="static" className={classes.appBar}>
      <Header setSideMenuOpen={setSideMenuOpen} user={user} setUser={setUser}/>
      <SideMenu sideMenuOpen={sideMenuOpen} setSideMenuOpen={setSideMenuOpen}/>
    </AppBar>
  )
};

export default Navigation;