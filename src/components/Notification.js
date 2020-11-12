import React from 'react';
import { connect } from 'react-redux';
import MuiAlert from '@material-ui/lab/Alert';

const Notification = ({ notification }) => {
  if (!notification) {
     return null;
  }
  return (
    <MuiAlert elevation={6} variant='standard' severity='error'>
      {notification}
    </MuiAlert>
  )
};

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
  }
};

export default connect(mapStateToProps)(Notification);