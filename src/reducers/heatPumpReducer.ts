import { Dispatch } from 'redux';
import heatPumpService from '../services/heatPump';
import {
  HeatingSchedules, HeatingStatus, HeatPumpEntry, ScheduleVariable, VariableHeatingSchedule,
} from '../types';

/**
 * Types
 */

export type HeatPumpReducerState = {
  heatPumpData: HeatPumpEntry[],
  schedulingEnabled: boolean,
  heatingSchedules: {
    lowerTank: VariableHeatingSchedule,
    heatDistCircuit3: VariableHeatingSchedule
  },
  heatingStatus: HeatingStatus,
  dataCoverageDays: number,
}

type SetDataAction = { type: 'SET_DATA', payload: HeatPumpEntry[] }
type SetSchedulingEnabledAction = { type: 'SET_SCHEDULING_ENABLED', payload: boolean }
type SetVariableHeatingScheduleAction = {
  type: 'SET_VARIABLE_HEATING_SCHEDULE', payload: { variable: ScheduleVariable, schedule: VariableHeatingSchedule } }
type SetHeatingStatusAction = { type: 'SET_HEATING_STATUS', payload: HeatingStatus }
type SetDataCoverageDays = { type: 'SET_DATA_COVERAGE_DAYS', payload: number }

type HeatPumpReducerActions =
  SetDataAction |
  SetSchedulingEnabledAction |
  SetVariableHeatingScheduleAction |
  SetHeatingStatusAction |
  SetDataCoverageDays

const initialState: HeatPumpReducerState = {
  heatPumpData: [],
  schedulingEnabled: false,
  heatingSchedules: {} as HeatingSchedules,
  heatingStatus: HeatingStatus.Stopped,
  dataCoverageDays: 2,
};

/**
 * Redux reducer which handles application state related to heat-pump.
 * The state contains heat-pump data, heating status and scheduling related variables.
 * @param state HeatPumpReducerState
 * @param action HeatPumpReducerActions
 */
const heatPumpReducer = (
  state: HeatPumpReducerState = initialState, action: HeatPumpReducerActions,
): HeatPumpReducerState => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, heatPumpData: action.payload };
    case 'SET_SCHEDULING_ENABLED':
      return { ...state, schedulingEnabled: action.payload };
    case 'SET_VARIABLE_HEATING_SCHEDULE':
      return {
        ...state,
        heatingSchedules: {
          ...state.heatingSchedules,
          [action.payload.variable]: action.payload.schedule,
        },
      };
    case 'SET_HEATING_STATUS':
      return { ...state, heatingStatus: action.payload };
    case 'SET_DATA_COVERAGE_DAYS':
      return { ...state, dataCoverageDays: action.payload };
    default:
      return state;
  }
};

/**
 * Action creator for initialing application data related to the heat-pump.
 * Used for retrieving data from the API initially.
 */
export const initializeAction = () => (dispatch: Dispatch): Promise<void> => new Promise((resolve) => {
  heatPumpService.getHeatPumpData(2)
    .then((heatPumpData: HeatPumpEntry[]) => {
      dispatch({
        type: 'SET_DATA',
        payload: heatPumpData,
      });
    });
  heatPumpService.getStatus()
    .then((heatingStatus: HeatingStatus) => {
      dispatch({
        type: 'SET_HEATING_STATUS',
        payload: heatingStatus,
      });
    });
  heatPumpService.getSchedulingEnabled()
    .then((schedulingEnabled: boolean) => {
      dispatch({
        type: 'SET_SCHEDULING_ENABLED',
        payload: schedulingEnabled,
      });
    });
  heatPumpService.getSchedule(ScheduleVariable.LowerTank)
    .then((lowerTankSchedule: VariableHeatingSchedule) => {
      dispatch({
        type: 'SET_VARIABLE_HEATING_SCHEDULE',
        payload: {
          variable: ScheduleVariable.LowerTank,
          schedule: lowerTankSchedule,
        },
      });
    });
  heatPumpService.getSchedule(ScheduleVariable.HeatDistCircuit3)
    .then((heatDistCircuitThreeSchedule: VariableHeatingSchedule) => {
      dispatch({
        type: 'SET_VARIABLE_HEATING_SCHEDULE',
        payload: {
          variable: ScheduleVariable.HeatDistCircuit3,
          schedule: heatDistCircuitThreeSchedule,
        },
      });
    });
  resolve();
});

/**
 * Action creator for updating/overwriting the heat-pump data.
 * Used when real-time updates are received from the API.
 * @param newHeatPumpData HeatPumpEntry[]
 */
export const setDataAction = (newHeatPumpData: HeatPumpEntry[]) => (dispatch: Dispatch): void => {
  dispatch({
    type: 'SET_DATA',
    payload: newHeatPumpData,
  });
};

/**
 * Action creator for writing a variable's heating schedule to the state.
 * @param variable ScheduleVariable
 * @param schedule VariableHeatingSchedule
 */
export const setScheduleAction = (
  variable: ScheduleVariable, schedule: VariableHeatingSchedule,
) => (dispatch: Dispatch): void => {
  dispatch({
    type: 'UPDATE_SCHEDULE',
    payload: { [variable]: schedule },
  });
};

/**
 * Action creator for writing the scheduling status to the state.
 * @param schedulingEnabled boolean
 */
export const setSchedulingEnabledAction = (schedulingEnabled: boolean) => (dispatch: Dispatch): void => {
  dispatch({
    type: 'SET_SCHEDULING_ENABLED',
    payload: schedulingEnabled,
  });
};

/**
 * Action creator for writing the status of heating to the state.
 * @param status HeatingStatus
 */
export const setHeatingStatusAction = (status: HeatingStatus) => (dispatch: Dispatch): void => {
  dispatch({
    type: 'SET_HEATING_STATUS',
    payload: status,
  });
};

/**
 * Action creator for writing the data coverage period in days to the state.
 * @param days number
 */
export const setDataCoverageDaysAction = (days: number) => (dispatch: Dispatch): void => {
  dispatch({
    type: 'SET_DATA_COVERAGE_DAYS',
    payload: days,
  });
};

export default heatPumpReducer;
