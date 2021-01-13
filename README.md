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
[Planned Upcoming Features](#planned-upcoming-features)

## Features
The features of the React.js frontend include:
- A simple overview of the status of the heating system.
- Provides ability to control the status of the heating system with a dynamic startup process.
- Multiple graphs for monitoring different aspects of the heat-pump.
- Controlling the schedule for boosted heating.
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


## Planned upcoming features
- High priority to implement a fully custom UI
- Conversion to TypeScript
- Additional controlling features 



