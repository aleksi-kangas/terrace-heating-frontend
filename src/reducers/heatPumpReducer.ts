import { Dispatch } from 'redux';
import heatPumpService from '../services/heatPump';
import {
  HeatingSchedules, HeatingStatus, HeatPumpEntry, ScheduleVariable, VariableHeatingSchedule,
} from '../types';

export type HeatPumpReducerState = {
  data: HeatPumpEntry[],
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
  data: [],
  schedulingEnabled: false,
  heatingSchedules: {} as HeatingSchedules,
  heatingStatus: HeatingStatus.Stopped,
  dataCoverageDays: 2,
};

const heatPumpReducer = (
  state = initialState, action: HeatPumpReducerActions,
): HeatPumpReducerState => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
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
 * Action creator for initialing heat-pump data.
 * Used when data is retrieved from the API the first time.
 */
export const initializeAction = () => async (dispatch: Dispatch): Promise<void> => {
  const heatPumpData = await heatPumpService.getHeatPumpData(2);
  const heatingStatus = await heatPumpService.getStatus();
  const schedulingEnabled = await heatPumpService.getSchedulingEnabled();
  const lowerTankSchedule = await heatPumpService.getSchedule(ScheduleVariable.LowerTank);
  const heatDistCircuitThreeSchedule = await heatPumpService.getSchedule(ScheduleVariable.HeatDistCircuit3);

  dispatch({
    type: 'SET_DATA',
    payload: heatPumpData,
  });
  dispatch({
    type: 'SET_HEATING_STATUS',
    payload: heatingStatus,
  });
  dispatch({
    type: 'SET_SCHEDULING_ENABLED',
    payload: schedulingEnabled,
  });
  dispatch({
    type: 'SET_VARIABLE_HEATING_SCHEDULE',
    payload: {
      variable: ScheduleVariable.LowerTank,
      schedule: lowerTankSchedule,
    },
  });
  dispatch({
    type: 'SET_VARIABLE_HEATING_SCHEDULE',
    payload: {
      variable: ScheduleVariable.HeatDistCircuit3,
      schedule: heatDistCircuitThreeSchedule,
    },
  });
};

/**
 * Action creator for updating/overwriting the heat-pump data.
 * Used when real-time updates are received from the API.
 * @param data array of heat-pump data
 */
export const setDataAction = (data: HeatPumpEntry[]) => (dispatch: Dispatch): void => {
  dispatch({
    type: 'SET_DATA',
    payload: data,
  });
};

export const setScheduleAction = (
  variable: string, schedule: VariableHeatingSchedule,
) => (dispatch: Dispatch): void => {
  dispatch({
    type: 'UPDATE_SCHEDULE',
    payload: { [variable]: schedule },
  });
};

export const setSchedulingEnabledAction = (schedulingEnabled: boolean) => (dispatch: Dispatch): void => {
  dispatch({
    type: 'SET_SCHEDULING_ENABLED',
    payload: schedulingEnabled,
  });
};

export const setHeatingStatusAction = (status: HeatingStatus) => (dispatch: Dispatch): void => {
  dispatch({
    type: 'SET_STATUS',
    payload: status,
  });
};

export const setDataCoverageDaysAction = (days: number) => (dispatch: Dispatch): void => {
  dispatch({
    type: 'SET_DATA_COVERAGE_DAYS',
    payload: days,
  });
};

export default heatPumpReducer;
