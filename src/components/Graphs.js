import React, { useState } from 'react';
import LineGraph from './LineGraph.js';
import { AppBar, Tabs, Tab } from '@material-ui/core';

const Graphs = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);

  const heatDistCircuitVariables = [
    { label: 'Heat Distribution Circuit 1', id: 'heatDistCircuitTemp1' },
    { label: 'Heat Distribution Circuit 2', id: 'heatDistCircuitTemp2' },
    { label: 'Heat Distribution Circuit 3', id: 'heatDistCircuitTemp3' },
  ];

  const generalTempVariables = [
    { label: 'Outside', id: 'outsideTemp' },
    { label: 'Inside', id: 'insideTemp' },
  ];

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={handleChange} centered>
          <Tab label="Heat Distribution Circuits" />
          <Tab label="General Temperatures" />
        </Tabs>
      </AppBar>
      { activeTab === 0 ?
        <LineGraph
          data={data}
          graphId='heatDistCircuitTemp'
          graphTitle='Heat Distribution Circuits'
          columns={heatDistCircuitVariables}
        />
        :
        null
      }
      { activeTab === 1 ?
        <LineGraph
          data={data}
          graphId='generalTemps'
          graphTitle='General Temperatures'
          columns={generalTempVariables}
        />
        :
        null
      }
    </div>
  )

};

export default Graphs;