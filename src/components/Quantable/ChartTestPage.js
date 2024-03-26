// src/components/Quantable/ChartTestPage.js

import React, { useEffect, useState } from 'react';
import DensityPlot from '../Visualization/DensityPlot';
import axiosInstance from '../../api/axiosConfig';

const ChartTestPage = () => {
  const [chartData, setChartData] = useState(null);
  const [mean, setMean] = useState(null);
  const [stdDev, setStdDev] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axiosInstance.get('/chart-test/');
        setChartData(response.data.freedman_diaconis_bins);
        setMean(response.data.vote_average);
        setStdDev(response.data.vote_stddev);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, []);

  if (!chartData || !mean || !stdDev) {
    return <div>Loading...</div>;
  }

  return (
    <div className="density-plot-container">
      <DensityPlot data={chartData} mean={mean} stdDev={stdDev} />
    </div>
  );
};

export default ChartTestPage;