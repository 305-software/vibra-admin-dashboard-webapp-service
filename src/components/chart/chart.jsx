/**
 * ApexChartComponent
 * 
 * This component renders an ApexCharts chart with the specified type, series, options, height, and width.
 * It uses the ReactApexChart component from the react-apexcharts library.
 * 
 * @component
 * @param {string} type - The type of the chart (e.g., "line", "bar", "radialBar").
 * @param {Array} series - The data series to be displayed in the chart.
 * @param {object} options - The configuration options for the chart.
 * @param {number|string} height - The height of the chart.
 * @param {number|string} width - The width of the chart.
 * @example
 * return (
 *   <ApexChartComponent
 *     type="line"
 *     series={[{ name: 'Sales', data: [10, 20, 30, 40] }]}
 *     options={{ chart: { id: 'basic-bar' }, xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr'] } }}
 *     height={350}
 *     width="100%"
 *   />
 * )
 */




import React from 'react';
import ReactApexChart from 'react-apexcharts';

function ApexChartComponent({ type, series, options, height,  width }) {
  return (
    <div>
      <ReactApexChart
        type={type}
        series={series}
        options={options}
        height={height}
        width={width}
      />
    </div>
  );
}

export default ApexChartComponent;
