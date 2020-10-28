import React from 'react';
import { Button, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu.js';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';


const useStyles = makeStyles(() => ({
  logout: {
    marginLeft: 'auto',
    padding: 20,
    color: 'white',
  }
}));

const Header = ({ setSideMenuOpen, user, setUser }) => {

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

  const handleLogout = () => {
    window.localStorage.removeItem('user');
    setUser(null)
  };

  return (
    <Toolbar>
      <IconButton
        color="inherit"
        edge="start"
        onClick={() => setSideMenuOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant='h6' noWrap>
        Terrace Heating Control
      </Typography>
      <Button onClick={handleLogout} className={classes.logout}>
        Logout
      </Button>
    </Toolbar>
  )
};

export default Header;