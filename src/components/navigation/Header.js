import React from 'react';
import { Button, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu.js';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(() => ({
  logout: {
    marginLeft: 'auto'
  }
}));

const Header = ({ setSideMenuOpen, user }) => {

  const classes = useStyles();

  if (!user) {
    return (
      <Toolbar>
        <Typography variant='h6'>
          Terrace Heating Control
        </Typography>
      </Toolbar>
    )
  }

  return (
    <Toolbar>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={() => setSideMenuOpen(true)}
      >
        <MenuIcon />
      </Button>
      <Typography variant='h6'>
        Terrace Heating Control
      </Typography>
      <Button onClick={() => window.localStorage.removeItem('user')} className={classes.logout}>
        Logout
      </Button>
    </Toolbar>
  )
};

export default Header;