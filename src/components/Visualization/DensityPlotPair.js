// src/components/Visualization/DensityPlotPair.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DensityPlotPair = ({
  minData,
  maxData,
  minMean,
  maxMean,
  minStdDev,
  maxStdDev,
  xLabel,
  yLabel,
  minUserVote,
  maxUserVote,
}) => {
  const svgRef = useRef();

  useEffect(() => {
    if (minData && maxData) {
      const margin = { top: 20, right: 20, bottom: 50, left: 60 };
      const width = 600 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Clear the previous chart
      d3.select(svgRef.current).selectAll('*').remove();

      const svg = d3.select(svgRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const xMin = d3.min([...minData, ...maxData], d => d.bin_min);
      const xMax = d3.max([...minData, ...maxData], d => d.bin_max);
      const xMargin = Math.max(Math.abs(minMean - xMin), Math.abs(maxMean - xMax)) + Math.max(minStdDev, maxStdDev);
      const xDomain = [Math.min(minMean, maxMean) - xMargin, Math.max(minMean, maxMean) + xMargin];
      const x = d3.scaleLinear().domain(xDomain).range([0, width]);

      const yMax = d3.max([...minData, ...maxData], d => d.percentage);
      const y = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

      const line = d3.line()
        .x(d => x((d.bin_min + d.bin_max) / 2))
        .y(d => y(d.percentage))
        .curve(d3.curveBasis);

      svg.append('path')
        .datum(minData)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', line);

      svg.append('path')
        .datum(maxData)
        .attr('fill', 'none')
        .attr('stroke', 'orange')
        .attr('stroke-width', 1.5)
        .attr('d', line);

      // Add x-axis label
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(xLabel);

      // Add y-axis label
      svg.append('text')
        .attr('transform', `rotate(-90)`)
        .attr('x', -height / 2)
        .attr('y', -margin.left + 20)
        .attr('text-anchor', 'middle')
        .attr('fill', 'white')
        .text(yLabel);

      // Add min mean marker and label
      svg.append('line')
        .attr('x1', x(minMean))
        .attr('y1', y(0))
        .attr('x2', x(minMean))
        .attr('y2', y(yMax))
        .attr('stroke', 'red')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,3');

      svg.append('text')
        .attr('x', x(minMean))
        .attr('y', y(yMax) - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', 'red')
        .text('Min Mean');

      // Add max mean marker and label
      svg.append('line')
        .attr('x1', x(maxMean))
        .attr('y1', y(0))
        .attr('x2', x(maxMean))
        .attr('y2', y(yMax))
        .attr('stroke', 'red')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,3');

      svg.append('text')
        .attr('x', x(maxMean))
        .attr('y', y(yMax) - 10)
        .attr('text-anchor', 'middle')
        .attr('fill', 'red')
        .text('Max Mean');

      // Add standard deviation markers and labels for min data
      [-minStdDev, minStdDev].forEach((sd, index) => {
        const label = index === 0 ? '-1σ (Min)' : '+1σ (Min)';
        svg.append('line')
          .attr('x1', x(minMean + sd))
          .attr('y1', y(0))
          .attr('x2', x(minMean + sd))
          .attr('y2', y(yMax))
          .attr('stroke', 'green')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3,3');

        svg.append('text')
          .attr('x', x(minMean + sd))
          .attr('y', y(yMax) - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', 'green')
          .text(label);
      });

      // Add standard deviation markers and labels for max data
      [-maxStdDev, maxStdDev].forEach((sd, index) => {
        const label = index === 0 ? '-1σ (Max)' : '+1σ (Max)';
        svg.append('line')
          .attr('x1', x(maxMean + sd))
          .attr('y1', y(0))
          .attr('x2', x(maxMean + sd))
          .attr('y2', y(yMax))
          .attr('stroke', 'green')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3,3');

        svg.append('text')
          .attr('x', x(maxMean + sd))
          .attr('y', y(yMax) - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', 'green')
          .text(label);
      });

      // Add user vote markers and labels
      if (minUserVote) {
        svg.append('circle')
          .attr('cx', x(minUserVote))
          .attr('cy', y(0))
          .attr('r', 5)
          .attr('fill', 'steelblue');

        svg.append('text')
          .attr('x', x(minUserVote))
          .attr('y', y(0) - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', 'steelblue')
          .text('Your Min Vote');
      }

      if (maxUserVote) {
        svg.append('circle')
          .attr('cx', x(maxUserVote))
          .attr('cy', y(0))
          .attr('r', 5)
          .attr('fill', 'orange');

        svg.append('text')
          .attr('x', x(maxUserVote))
          .attr('y', y(0) - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', 'orange')
          .text('Your Max Vote');
      }

      // Add x-axis
      svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .attr('color', 'white')
        .selectAll('text')
        .attr('fill', 'white');

      // Add y-axis
      svg.append('g')
        .call(d3.axisLeft(y))
        .attr('color', 'white')
        .selectAll('text')
        .attr('fill', 'white');
    }
  }, [minData, maxData, minMean, maxMean, minStdDev, maxStdDev, xLabel, yLabel, minUserVote, maxUserVote]);

  return <svg ref={svgRef} />;
};

export default DensityPlotPair;