import React, { useState } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import LineGraph from './LineGraph.js';

const variables = [
  {
    title: 'Head Distribution Circuits',
    columns: [
      { label: 'Heat Distribution Circuit 1', id: 'heatDistCircuitTemp1' },
      { label: 'Heat Distribution Circuit 2', id: 'heatDistCircuitTemp2' },
      { label: 'Heat Distribution Circuit 3', id: 'heatDistCircuitTemp3' },
    ],
  },
  {
    title: 'General Temperatures',
    columns: [
      {label: 'Inside °C', id: 'insideTemp'},
      {label: 'Outside °C', id: 'outsideTemp'},
    ],
  },
];


const GraphSelector = ({ data, currentTimeRange, setTimeRange }) => {
  const [activeGraph, setActiveGraph] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveGraph(newValue)
  };

  const tabs = (
    variables.map((graph, index) =>
      <LineGraph
        key={index}
        hidden={activeGraph !== index}
        data={data}
        columns={graph.columns}
        graphId={graph.title}
        graphTitle={graph.title}
        currentTimeRange={currentTimeRange}
        setCurrentTimeRange={setTimeRange}
      />
    )
  );

  const tabTitles = (
    <Tabs value={activeGraph} onChange={handleChange} centered>
      {variables.map((graph) => {
        return (
          <Tab key={graph.title} label={graph.title}/>
        )
      })}
    </Tabs>
  );

  return (
    <div>
      {tabTitles}
      {tabs}
    </div>
  )
};

export default GraphSelector;