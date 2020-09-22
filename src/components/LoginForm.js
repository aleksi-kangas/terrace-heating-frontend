import React, { useState } from 'react';
import { Button, Grid, TextField } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core/styles';
import loginService from '../services/login.js';

const useStyles = makeStyles(() => ({
  icon: {
    padding: 10
  },
  button: {
    padding: 20
  }
}));

const LoginForm = ({ history, setUser }) => {
  const [error, setError] = useState(null);

  const classes = useStyles();

  const notification = () => {
    if (error) {
      return (
        <MuiAlert elevation={6} variant='standard' severity='error'>
          {error}
        </MuiAlert>
      )
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      // Validate login on backend
      const user = await loginService.login({
        username: event.target.username.value,
        password: event.target.password.value
      });
      // Set user information to browser's local storage
      window.localStorage.setItem('user', JSON.stringify(user));
      // Update state
      setUser(user);
      // Redirect
      history.push('/')
    } catch (error) {
      setError('Wrong username or password!');
      setTimeout(() => {
        setError(null)
      }, 5000)
    }
  };

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
    >
      <Grid item>
        <form onSubmit={handleLogin}>
          <Grid
            container
            direction='column'
            alignItems='center'
            justify='center'
          >
            <Grid item className={classes.icon}>
              <PersonIcon fontSize='large'/>
            </Grid>
            <Grid item>
              <TextField
                id='username'
                label='Username'
                placeholder='Username'
              />
            </Grid>
            <Grid item className={classes.icon}>
              <LockIcon fontSize='large'/>
            </Grid>
            <Grid item>
              <TextField
                id='password'
                label='Password'
                placeholder='Password'
                type='password'
              />
            </Grid>
            <Grid item className={classes.button}>
              <Button variant='contained' type='submit'>
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
      <Grid item>
        {error ? notification() : null}
      </Grid>
    </Grid>
  )
};

export default LoginForm;