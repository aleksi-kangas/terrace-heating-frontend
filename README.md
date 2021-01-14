# Terrace Heating Frontend
> A React.js frontend which enables monitoring and controlling of a terrace heating system.

A personal project for gaining a deeper understanding of Full Stack development
by building a meaningful application for real world use.

In a nutshell, this project enables monitoring and controlling the heating system for an enclosed terrace at my parents' home.

#### Background Motivation
At my parents' home, there is an enclosed terrace for which the heating (ground & air) is provided by a *Lämpöässä* ground source heat-pump.

As I found that monitoring and controlling the heat-pump was a bit cumbersome through the provided cloud platform,
I visioned about a simple and responsive web application which would provide my family members an easy way of using the terrace heating system.

This repository contains the implementation of the frontend portion of the application.

### Table of Contents
[Features](#features)   
[Implementation](#implementation)  
[Requirements](#requirements)  
[Planned Upcoming Features](#planned-upcoming-features)

## Features
The features of the React.js frontend include:
- A simple overview of the status of the heating system.
  - Includes information about compressor usage, outside temperature and the current status of the terrace heating system.
  - Provides ability to control the status of the heating system with a dynamic startup process (normal vs soft-start).

![Overview Example](/images/overview.png)
- Multiple graphs for monitoring different aspects of the heat-pump.

![Graphs Example](/images/graphs.png)
- Controlling the schedule for boosted heating.
  - Allows the user to change schedule timing and temperature delta for boosting.
  
![Schedule Example](/images/schedule.png)
- UI created with [Material UI](https://material-ui.com/).
    - Fully custom UI is in the works.

## Implementation
- The Application has been created with [React.js](https://reactjs.org/)
  framework in conjunction with [Material UI](https://material-ui.com/).
  - Some custom styling has been used, and planning to create a fully custom UI.
- JavaScript ES6 revision is used.
- [Redux.js](https://redux.js.org/) is used for state management.
    - Simple example:
```JavaScript
/**
 * Handles the dispatched actions to update the heating system Redux state.
 */
const statusReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_STATUS':
      return action.payload;
    default:
      return state;
  }
};
```

## Requirements
- [modbus-serial](https://github.com/yaacov/node-modbus-serial#readme) installation requires some extra steps:
  - Install Windows Build Tools with ```npm install --global windows-build-tools```
  - Install modbus-serial with ```npm install modbus-serial```
    - If the installation fails, try the following command ```npm install modbus-serial --unsafe-perm --build-from-source```
- Run ```npm install``` as usual

## Planned upcoming features
- High priority to implement a fully custom UI
- Conversion to TypeScript
- Additional controlling and monitoring features 

