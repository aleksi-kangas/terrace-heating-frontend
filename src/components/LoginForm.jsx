import React from 'react';
import { connect } from 'react-redux';
import {
  Button, Fade, Grid, Paper, TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { removeNotification, setNotification } from '../reducers/notificationReducer';

/**
 * Custom styling.
 */
const useStyles = makeStyles(() => ({
  button: {
    paddingTop: 50,
    color: '#2F4050',
  },
  form: {
    padding: 50,
  },
  icon: {
    marginTop: 20,
  },
  shadow: {
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
}));

/**
 * Represents the login form,
 * where user will enter username and password to have access to the application.
 */
const LoginForm = ({ setNotification, removeNotification }) => {
  const classes = useStyles();
  const history = useHistory();
  const { login } = useAuth();

  /**
   * Handler for login submission.
   * Verifies the credentials at the server and redirects to overview page.
   */
  const handleLogin = async (event) => {
    event.preventDefault();
    const credentials = {
      username: event.target.username.value,
      password: event.target.password.value,
    };
    const result = await login(credentials);
    if (result) {
      setNotification('Login successful', 'success');
      setTimeout(() => {
        removeNotification();
      }, 3000);
    }
    history.push('/');
  };

  return (
    <Fade in timeout={800}>
      <Grid container justify="center">
        <form onSubmit={handleLogin}>
          <Grid
            container
            item
            component={Paper}
            direction="column"
            alignItems="center"
            justify="space-evenly"
            className={clsx(classes.form, classes.shadow)}
          >
            <Grid item className={classes.icon}>
              <PersonIcon fontSize="large" />
            </Grid>
            <Grid item>
              <TextField
                id="username"
                label="Username"
                placeholder="Username"
              />
            </Grid>
            <Grid item className={classes.icon}>
              <LockIcon fontSize="large" />
            </Grid>
            <Grid item>
              <TextField
                id="password"
                label="Password"
                placeholder="Password"
                type="password"
              />
            </Grid>
            <Grid item className={classes.button}>
              <Button variant="contained" type="submit" color="primary">
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </Fade>
  );
};

export default connect(null, { setNotification, removeNotification })(LoginForm);
