import React from 'react';
import { connect } from 'react-redux';
import MuiAlert from '@material-ui/lab/Alert';

/**
 * Represents a notification component which is rendered upon events,
 * where user should be notified of something.
 * @param notification
 * @return {JSX.Element|null}
 * @constructor
 */
const Notification = ({ notification }) => {
  if (!notification) {
    return null;
  }
  return (
    <MuiAlert elevation={6} variant="standard" severity={notification.type}>
      {notification.message}
    </MuiAlert>
  );
};

const mapStateToProps = (state) => ({
  notification: state.notification,
});

export default connect(mapStateToProps)(Notification);
