import React from 'react';
import { Legend, styler } from 'react-timeseries-charts';

const GraphLegend = ({ columns, activeColumns, setActiveColumns, columnIds }) => {

  /**
   * Legend-component related functionality and styling.
   * Produces labels for the data and allows user to filter which data lines to show in the chart.
   */
  const legend = [
    ...columns.map((column) => {
      return (
        {
          key: column.id,
          label: column.label,
          disabled: !activeColumns.includes(column.id)
        }
      )
    })
  ];

  const legendStyle = styler(columnIds, 'Dark2');

  const handleSelectionChange = (columnId) => {
    const newActive = [...activeColumns];
    if (newActive.includes(columnId)) {
      newActive.splice(newActive.indexOf(columnId), 1)
    } else {
      newActive.push(columnId)
    }
    setActiveColumns(newActive);
  };

  return (
    <Legend
      type="swatch"
      style={legendStyle}
      categories={legend}
      onSelectionChange={handleSelectionChange}
    />
  )

};

export default GraphLegend;