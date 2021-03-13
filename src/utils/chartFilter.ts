/*
Keep the real data in a seperate object called allData
Put only that part of allData in the dataset to optimize zoom/pan performance
Original Author: Evert van der Weit - 2018
Modified: Aleksi Kangas
 */
// TODO
// @ts-ignore
const filterData = (chartInstance) => {
  const { datasets } = chartInstance.data;
  const originalDatasets = chartInstance.data.allData;
  const chartOptions = chartInstance.options.scales.xAxes[0];

  const startX = chartOptions.time.min;
  const endX = chartOptions.time.max;

  for (let i = 0; i < originalDatasets.length; i += 1) {
    const dataset = datasets[i];
    const originalData = originalDatasets[i];

    if (!originalData.length) break;

    const s = startX;
    const e = endX;
    let sI = null;
    let eI = null;

    for (let j = 0; j < originalData.length; j += 1) {
      if ((sI == null) && originalData[j].x > s) {
        sI = j;
      }
      if ((eI == null) && originalData[j].x > e) {
        eI = j;
      }
    }
    if (sI == null) sI = 0;
    if (originalData[originalData.length - 1].x < s) eI = 0;
    else if (eI == null) eI = originalData.length;

    dataset.data = originalData.slice(sI, eI);
  }
};

const dataFilterPlugin = {
  // TODO
  // @ts-ignore
  beforeUpdate(chartInstance) {
    filterData(chartInstance);
  },
};

export default dataFilterPlugin;
