import React from 'react';
import { Grid, Button, TextField } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import PersonIcon from '@material-ui/icons/Person';
import { Redirect, useHistory } from 'react-router-dom';


const LoginForm = ({ user, handleLogin }) => {

  const history = useHistory();

  if (user) {
    history.push('/');
    return (
      <Redirect to='/' />
    )
  }

  return (
    <form onSubmit={handleLogin}>
      <Grid
        container
        direction='column'
        alignItems='center'
        p={100}
      >
        <PersonIcon/>
        <TextField
          id='username'
          label='Username'
          placeholder='Username'
        />

        <LockIcon/>
        <TextField
          id='password'
          label='Password'
          placeholder='Password'
          type='password'
        />
        <Button variant='contained' type='submit'>
          Login
        </Button>
      </Grid>
    </form>
  )
};

export default LoginForm;