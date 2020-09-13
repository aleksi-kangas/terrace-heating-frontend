import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const Menu = () => {
  return (
    <Navbar bg="light">
      <Nav.Link href="/">Statistics</Nav.Link>
      <Nav.Link href="/charts">Charts</Nav.Link>
      <Nav.Link href="/control">Control</Nav.Link>
    </Navbar>
  )
};

export default Menu;