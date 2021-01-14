import React from 'react';
import { Link } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AssessmentIcon from '@material-ui/icons/Assessment';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import ScheduleIcon from '@material-ui/icons/Schedule';

/**
 * Custom styling.
 */
const useStyles = makeStyles(() => ({
  sideBar: {
    height: '100%',
    width: '175px',
    backgroundColor: '#2F4050',
  },
  white: {
    color: 'white',
  },
}));

const SideBar = ({ sideBarOpen, setSideBarOpen }) => {
  const classes = useStyles();

  const sideBarItems = [
    { name: 'Overview', icon: <AssessmentIcon />, link: '/' },
    { name: 'Graphs', icon: <ShowChartIcon />, link: '/graphs/1' },
    { name: 'Scheduling', icon: <ScheduleIcon />, link: '/schedules' },
  ];

  return (
    <Drawer
      anchor="left"
      variant="temporary"
      open={sideBarOpen}
      onClose={() => setSideBarOpen(false)}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <List className={classes.sideBar}>
        {sideBarItems.map((item) => (
          <Link to={item.link} key={item.name} style={{ textDecoration: 'none' }}>
            <ListItem onClick={() => setSideBarOpen(false)}>
              <ListItemIcon className={classes.white}>
                {item.icon}
              </ListItemIcon>
              <ListItemText className={classes.white}>
                {item.name}
              </ListItemText>
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;