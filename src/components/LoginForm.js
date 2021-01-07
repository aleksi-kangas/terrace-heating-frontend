import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, TextField } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core/styles';
import { login } from '../reducers/userReducer.js';
import Notification from './Notification.js';

const useStyles = makeStyles(() => ({
  icon: {
    padding: 10
  },
  button: {
    padding: 20,
    color: '#5390fe'
  }
}));

const LoginForm = ({ history, login }) => {
  const classes = useStyles();

  const handleLogin = async (event) => {
    event.preventDefault();
    const credentials = {
      username: event.target.username.value,
      password: event.target.password.value
    };
    login(credentials);
    // Redirect
    history.push('/');
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
              <Button variant='contained' type='submit' color='secondary'>
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
        <Notification/>
      </Grid>
    </Grid>
  )
};

export default connect(null, { login })(LoginForm);
