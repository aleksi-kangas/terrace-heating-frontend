import React from 'react';
import { Box, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <Box alignItems="center" p={2}>
      <Box>
        <Button color="primary">
          <Link to='/'>
            Home
          </Link>
        </Button>
        <Button color="primary">
          <Link to='/charts'>
            Charts
          </Link>
        </Button>
        <Button color="primary">
          <Link to='/control'>
            Control
          </Link>
        </Button>
      </Box>
    </Box>
  )
};

export default NavBar;