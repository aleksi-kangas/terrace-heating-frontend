import React, { useState } from 'react';
import alertService from '../services/alert.js';
import { Button, Checkbox, Grid, Menu, MenuItem, Paper, TextField, Typography } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const AlertCreation = ({ user }) => {
  const [variable, setVariable] = useState('Choose a variable');
  const [emailFieldShown, setEmailFieldShown] = useState(false);

  const options = [
    'Inside °C',
    'Outside °C',
    'Heat circuit 1 °C',
    'Heat circuit 2 °C',
    'Heat circuit 3 °C',
  ];
  const itemHeight = 48;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    if (event.target.textContent) {
      setVariable(event.target.textContent);
    }
    setAnchorEl(null);
  };

  const createAlert = async (event) => {
    event.preventDefault();
    await alertService.create({
      variable: variable,
      lowerLimit: event.target.minimum.value,
      upperLimit: event.target.maximum.value,
      user: user,
      email: event.target.email.value,
    });
  };

  return (
    <Paper>
      <form onSubmit={createAlert}>
        <Grid container direction='column' justify='center' alignItems='center'>
          <Typography variant='h6'>
            Alert Creation
          </Typography>

          <Button
            variant='contained'
            onClick={handleClick}
          >
            {variable}
            <ExpandMoreIcon />
          </Button>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: itemHeight * 4.5,
              },
            }}
          >
            {options.map((option) => (
              <MenuItem key={option} onClick={handleClose}>
                {option}
              </MenuItem>
            ))}
          </Menu>
          <Typography variant='subtitle1'>Threshold</Typography>
          <TextField id='minimum' type='number' helperText='Lower limit'/>
          <TextField id='maximum' type='number' helperText='Upper limit'/>

          <Typography variant='subtitle1'>Email notification
            <Checkbox
              checked={emailFieldShown}
              onChange={() => setEmailFieldShown(!emailFieldShown)}
              color="primary"
              inputProps={{ 'aria-label': 'secondary checkbox' }}
            />
          </Typography>

          {emailFieldShown ?
            <TextField id='email' type='email' placeholder='Email address'/>
            : null
          }
          <Button variant='contained' type='submit'>
            Create
          </Button>
        </Grid>
      </form>
    </Paper>
  )
};

export default AlertCreation;