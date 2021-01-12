import React from 'react';
import { connect } from 'react-redux';
import { Button, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { logout } from '../../reducers/userReducer';

const useStyles = makeStyles(() => ({
  logout: {
    marginLeft: 'auto',
    padding: 20,
    color: 'white',
  },
}));

const Header = ({ setSideMenuOpen, user, logout }) => {
  const classes = useStyles();

  if (!user) {
    return (
      <Toolbar>
        <Typography variant="h6">
          Terrace Heating Control
        </Typography>
      </Toolbar>
    );
  }

  return (
    <Toolbar>
      <IconButton
        color="inherit"
        edge="start"
        onClick={() => setSideMenuOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap>
        Terrace Heating Control
      </Typography>
      <Button onClick={logout} className={classes.logout}>
        Logout
      </Button>
    </Toolbar>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, { logout })(Header);
