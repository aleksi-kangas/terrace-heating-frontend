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
const useStyles = makeStyles((theme) => ({
  sideBar: {
    flex: 1,
    backgroundColor: '#2F4050',
  },
  white: {
    color: 'white',
  },
  item: {
    '&:hover': {
      background: theme.palette.action.hover,
    },
    '& > *': {
      color: 'white',
    },
  },
}));

/**
 * Represents the sidebar drawer which contains navigation links.
 * @param sideBarOpen whether to show the sidebar or not
 * @param setSideBarOpen method for changing sidebar visibility
 */
const SideBar = ({ sideBarOpen, setSideBarOpen }) => {
  const classes = useStyles();

  // Array of navigation links
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
            <ListItem onClick={() => setSideBarOpen(false)} className={classes.item}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText>
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
