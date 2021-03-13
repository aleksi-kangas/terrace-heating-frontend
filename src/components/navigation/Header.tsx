import React, { useContext } from 'react';
import {
  AppBar, Button, Toolbar, Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Notification from '../Notification';

/**
 * Custom styling.
 */
const useStyles = makeStyles(() => ({
  logout: {
    marginLeft: 'auto',
    padding: 20,
    color: 'white',
  },
  toolBar: {
    backgroundColor: '#2F4050',
    color: 'white',
  },
  text: {
    marginLeft: 20,
    paddingRight: 40,
  },
}));

type HeaderProps = {
  setSideBarOpen: (arg0: boolean) => void
}

/**
 * Represents the Toolbar at the top of the page.
 */
const Header = ({ setSideBarOpen }: HeaderProps): JSX.Element => {
  const classes = useStyles();
  const history = useHistory();
  const { isAuthenticated, logout } = useContext(AuthContext);

  /**
   * Handler for clicking logout button.
   * Destroys user session and redirects to login.
   */
  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <AppBar>
      <Toolbar className={classes.toolBar}>
        {isAuthenticated
          ? (
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setSideBarOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )
          : null}

        <Typography variant="h6" noWrap className={classes.text}>
          Terrace Heating
        </Typography>
        <Notification />
        {isAuthenticated
          ? (
            <Button onClick={handleLogout} className={classes.logout}>
              Logout
            </Button>
          ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
