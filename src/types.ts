export enum HeatPumpEntryVariables {
  Time = 'time',
  OutsideTemp = 'outsideTemp',
  InsideTemp = 'insideTemp',
  HotGasTemp = 'hotGasTemp',
  HeatDistCircuit1Temp = 'heatDistCircuit1Temp',
  HeatDistCircuit2Temp = 'heatDistCircuit2Temp',
  HeatDistCircuit3Temp = 'heatDistCircuit3Temp',
  LowerTankTemp = 'lowerTankTemp',
  UpperTankTemp = 'upperTankTemp',
  GroundLoopInputTemp = 'groundLoopInputTemp',
  GroundLoopOutputTemp = 'groundLoopOutputTemp',
  ActiveHeatDistCircuits = 'activeHeatDistCircuits',
  CompressorRunning = 'compressorRunning',
  CompressorUsage = 'compressorUsage',
  LowerTankLowerLimit = 'lowerTankLowerLimit',
  LowerTankUpperLimit = 'lowerTankUpperLimit',
  UpperTankLowerLimit = 'upperTankLowerLimit',
  UpperTankUpperLimit = 'upperTankUpperLimit',
}

export enum GraphVariableIds {
  OutsideTemp = 'outsideTemp',
  InsideTemp = 'insideTemp',
  GroundLoopInputTemp = 'groundLoopInputTemp',
  GroundLoopOutputTemp = 'groundLoopOutputTemp',
  LowerTankTemp = 'lowerTankTemp',
  UpperTankTemp = 'upperTankTemp',
  HotGasTemp = 'hotGasTemp',
  LowerTankLowerLimit = 'lowerTankLowerLimit',
  LowerTankUpperLimit = 'lowerTankUpperLimit',
  UpperTankLowerLimit = 'upperTankLowerLimit',
  UpperTankUpperLimit = 'upperTankUpperLimit',
  HeatDistCircuit1Temp = 'heatDistCircuit1Temp',
  HeatDistCircuit2Temp = 'heatDistCircuit2Temp',
  HeatDistCircuit3Temp = 'heatDistCircuit3Temp',
}

export type GraphVariable = {
  label: string,
  id: GraphVariableIds
}

// export type GraphVariables = [
//   title: string,
//   variables: GraphVariable[]
// ]

export type GraphGroup = {
  title: string,
  variables: GraphVariable[]
}

export type HeatPumpEntry = {
  time: Date,
  outsideTemp: number,
  insideTemp: number,
  hotGasTemp: number,
  heatDistCircuit1Temp: number,
  heatDistCircuit2Temp: number,
  heatDistCircuit3Temp: number,
  lowerTankTemp: number,
  upperTankTemp: number,
  groundLoopTempInput: number,
  groundLoopTempOutput: number,
  activeHeatDistCircuits: number,
  compressorRunning: boolean,
  compressorUsage: number,
  lowerTankLowerLimit: number,
  lowerTankUpperLimit: number,
  upperTankLowerLimit: number,
  upperTankUpperLimit: number,
}

export enum HeatingStatus {
  Running = 'RUNNING',
  Boosting = 'BOOSTING',
  SoftStart = 'SOFT_START',
  Stopped = 'STOPPED',
}

export enum NotificationType {
  Success = 'success',
  Info = 'info',
  Error = 'error'
}

export enum ScheduleVariable {
  LowerTank = 'lowerTank',
  HeatDistCircuit3 = 'heatDistCircuit3'
}

export enum WeekDays {
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
  Sunday = 'sunday',
}

export enum WeekDayScheduleKeys {
  Start = 'start',
  End = 'end',
  Delta = 'delta',
}

export type WeekDaySchedule = {
  [key in WeekDayScheduleKeys]: number
}

export type VariableHeatingSchedule = {
  [weekDay in WeekDays]: WeekDaySchedule
}

export type HeatingSchedules = {
  [key in ScheduleVariable]: VariableHeatingSchedule
}

export type Credentials = {
  username: string,
  password: string
}

export type User = {
  id: string,
  username: string,
  name: string,
}
