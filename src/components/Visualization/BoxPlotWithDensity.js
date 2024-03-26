// src/components/Visualization/BoxPlotWithDensity.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BoxPlotWithDensity = ({ quantable }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (quantable) {
            drawBoxPlotWithDensity(quantable.freedman_diaconis_bins, chartRef.current);
        }
    }, [quantable]);

    const drawBoxPlotWithDensity = (data, element) => {
        // Clear any existing chart
        d3.select(element).selectAll('*').remove();

        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(element)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xMin = d3.min(data, d => d.bin_min);
        const xMax = d3.max(data, d => d.bin_max);
        const x = d3.scaleLinear().domain([xMin, xMax]).range([0, width]);

        const yMax = d3.max(data, d => d.percentage);
        const y = d3.scaleLinear().domain([0, yMax]).range([height, 0]);

        // Box plot
        const boxPlot = svg.selectAll('.box')
            .data([data])
            .enter()
            .append('g')
            .attr('class', 'box');

        const q1 = d3.quantile(data.map(d => d.bin_min), 0.25);
        const median = d3.quantile(data.map(d => d.bin_min), 0.5);
        const q3 = d3.quantile(data.map(d => d.bin_min), 0.75);
        const iqr = q3 - q1;
        const whiskerMin = d3.max([xMin, q1 - 1.5 * iqr]);
        const whiskerMax = d3.min([xMax, q3 + 1.5 * iqr]);

        boxPlot.append('rect')
            .attr('x', x(q1))
            .attr('y', y(yMax * 0.75))
            .attr('width', x(q3) - x(q1))
            .attr('height', y(yMax * 0.25) - y(yMax * 0.75))
            .style('fill', 'white')
            .style('stroke', 'black');

        boxPlot.append('line')
            .attr('x1', x(median))
            .attr('y1', y(yMax * 0.75))
            .attr('x2', x(median))
            .attr('y2', y(yMax * 0.25))
            .style('stroke', 'black');

        boxPlot.append('line')
            .attr('x1', x(whiskerMin))
            .attr('y1', y(yMax * 0.5))
            .attr('x2', x(q1))
            .attr('y2', y(yMax * 0.5))
            .style('stroke', 'black');

        boxPlot.append('line')
            .attr('x1', x(q3))
            .attr('y1', y(yMax * 0.5))
            .attr('x2', x(whiskerMax))
            .attr('y2', y(yMax * 0.5))
            .style('stroke', 'black');

        // Density plot
        const densityData = data.map(d => ({
            bin_min: d.bin_min,
            bin_max: d.bin_max,
            density: d.percentage / 100
        }));

        const line = d3.line()
            .x(d => x((d.bin_min + d.bin_max) / 2))
            .y(d => y(d.density))
            .curve(d3.curveBasis);

        svg.append('path')
            .datum(densityData)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', line);

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x));

        svg.append('g').call(d3.axisLeft(y));
    };

    return <div ref={chartRef} />;
};

export default BoxPlotWithDensity;
