// Array for schedule defaults of lowerTank and heatDistCircuit3
const scheduleDefaults = {
  lowerTank: {
    monday: { start: 3, end: 22, delta: 2 },
    tuesday: { start: 3, end: 22, delta: 2 },
    wednesday: { start: 3, end: 22, delta: 2 },
    thursday: { start: 3, end: 23, delta: 2 },
    friday: { start: 3, end: 23, delta: 2 },
    saturday: { start: 0, end: 24, delta: 2 },
    sunday: { start: 0, end: 22, delta: 2 },
  },
  heatDistCircuit3: {
    monday: { start: 4, end: 22, delta: 8 },
    tuesday: { start: 4, end: 22, delta: 8 },
    wednesday: { start: 4, end: 22, delta: 8 },
    thursday: { start: 4, end: 22, delta: 8 },
    friday: { start: 4, end: 23, delta: 8 },
    saturday: { start: 1, end: 24, delta: 8 },
    sunday: { start: 0, end: 22, delta: 8 },
  },
};

export default scheduleDefaults;
