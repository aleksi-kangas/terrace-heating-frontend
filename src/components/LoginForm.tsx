import React, { useContext } from 'react';
import { connect } from 'react-redux';
import {
  Button, Fade, Grid, Paper, TextField,
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { removeNotificationAction, setNotificationAction } from '../reducers/notificationReducer';
import { Credentials, NotificationType } from '../types';

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
    borderRadius: 4,
    boxShadow: '0px 3px 11px 0px #c0c4e0',
  },
  icon: {
    marginTop: 20,
  },
}));

type LoginFormProps = {
  setNotification: (message: string, type: NotificationType) => void,
  removeNotification: () => void,
}

/**
 * Represents the login form,
 * where user will enter username and password to have access to the application.
 */
const LoginForm = ({ setNotification, removeNotification }: LoginFormProps) => {
  const classes = useStyles();
  const history = useHistory();
  const { login } = useContext(AuthContext);

  /**
   * Handler for login submission.
   * Verifies the credentials at the server and redirects to overview page.
   */
  const handleLogin = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const credentials: Credentials = {
      username: (event.target as HTMLFormElement).username.value,
      password: (event.target as HTMLFormElement).password.value,
    };
    const result = await login(credentials);
    // Clear form fields
    (document.getElementById('login-form') as HTMLFormElement).reset();
    if (!result) {
      setNotification('Wrong username or password', NotificationType.Error);

      setTimeout(() => {
        removeNotification();
      }, 5000);
    } else {
      history.push('/');
    }
  };

  return (
    <Fade in timeout={800}>
      <Grid container justify="center">
        <form onSubmit={handleLogin} id="login-form">
          <Grid
            container
            item
            component={Paper}
            direction="column"
            alignItems="center"
            justify="space-evenly"
            className={classes.form}
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

export default connect(
  null,
  {
    setNotification: setNotificationAction,
    removeNotification: removeNotificationAction,
  },
)(LoginForm);
