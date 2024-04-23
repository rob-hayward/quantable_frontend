// src/components/Visualization/DensityPlot.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DensityPlot = ({ data, mean, stdDev, xLabel, yLabel, userVote }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data) {
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

      const xMin = d3.min(data, d => d.bin_min);
      const xMax = d3.max(data, d => d.bin_max);
      const xMargin = Math.max(Math.abs(mean - xMin), Math.abs(xMax - mean)) + stdDev;
      const xDomain = [mean - xMargin, mean + xMargin];
      const x = d3.scaleLinear().domain(xDomain).range([0, width]);

      const yMax = d3.max(data, d => d.percentage);
      const y = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

      const line = d3.line()
        .x(d => x((d.bin_min + d.bin_max) / 2))
        .y(d => y(d.percentage))
        .curve(d3.curveBasis);

      svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
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

      // Add mean marker and label
      svg.append('line')
        .attr('x1', x(mean))
        .attr('y1', y(0))
        .attr('x2', x(mean))
        .attr('y2', y(yMax))
        .attr('stroke', 'red')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '3,3');

      svg.append('text')
        .attr('x', x(mean))
        .attr('y', y(yMax) - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'red')
        .text('Mean');

      // Add standard deviation markers and labels
      [-stdDev, stdDev].forEach((sd, index) => {
        const label = index === 0 ? '-1σ' : '+1σ';
        const angle = index === 0 ? -45 : 45;

        svg.append('line')
          .attr('x1', x(mean + sd))
          .attr('y1', y(0))
          .attr('x2', x(mean + sd))
          .attr('y2', y(yMax))
          .attr('stroke', 'green')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3,3');

        svg.append('text')
          .attr('transform', `translate(${x(mean + sd)},${y(yMax) + 10})rotate(${angle})`)
          .attr('text-anchor', index === 0 ? 'end' : 'start')
          .attr('fill', 'green')
          .text(label);
      });

      // Add user vote marker and label
      if (userVote) {
        svg.append('circle')
          .attr('cx', x(userVote))
          .attr('cy', y(0))
          .attr('r', 5)
          .attr('fill', 'orange');

        svg.append('text')
          .attr('x', x(userVote))
          .attr('y', y(0) - 10)
          .attr('text-anchor', 'middle')
          .attr('fill', 'orange')
          .text('Your Vote');
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
  }, [data, mean, stdDev, xLabel, yLabel, userVote]);

  return <svg ref={svgRef} />;
};

export default DensityPlot;