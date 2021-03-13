import * as React from 'react';
import { connect } from 'react-redux';
import MuiAlert from '@material-ui/lab/Alert';
import { Fade } from '@material-ui/core';
import { NotificationType } from '../types';
import { State } from '../store';

type NotificationProps = {
  notification: { message: string, type: NotificationType }
}

/**
 * Represents a notification component which is rendered upon events,
 * where user should be notified of something.
 * @param notification
 * @return {JSX.Element|null}
 * @constructor
 */
const Notification = ({ notification }: NotificationProps) => {
  if (notification.message === '') {
    return null;
  }
  return (
    <Fade in timeout={400}>
      <MuiAlert elevation={6} variant="standard" severity={notification.type}>
        {notification.message}
      </MuiAlert>
    </Fade>
  );
};

const mapStateToProps = (state: State) => ({
  notification: state.notification,
});

export default connect(mapStateToProps)(Notification);
