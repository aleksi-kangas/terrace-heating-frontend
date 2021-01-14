import React from 'react';
import { connect } from 'react-redux';
import {
  AppBar, Button, Toolbar, Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { logout } from '../../reducers/userReducer';

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
  },
}));

/**
 * Represents the Toolbar at the top of the page.
 */
const Header = ({ setSideBarOpen, user, logout }) => {
  const classes = useStyles();

  return (
    <AppBar>
      <Toolbar className={classes.toolBar}>
        {user
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
        {user
          ? (
            <Button onClick={logout} className={classes.logout}>
              Logout
            </Button>
          ) : null}
      </Toolbar>
    </AppBar>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { logout })(Header);
