import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { ChartData } from '@/types/api';

type BarChartProps = {
  data: ChartData;
};

export const BarChart = ({ data }: BarChartProps) => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  const drawChart = useCallback(() => {
    if (!chartRef.current || !data) return;

    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3.select(chartRef.current);
    const width = chartRef.current.clientWidth;
    const height = chartRef.current.clientHeight;
    const margin = {
      top: 20,
      right: width < 400 ? 10 : 30,
      bottom: 50,
      left: width < 400 ? 40 : 80
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x0Scale = d3
      .scaleBand()
      .domain(data.labels)
      .rangeRound([0, innerWidth])
      .paddingInner(0.1);

    const x1Scale = d3
      .scaleBand()
      .domain(data.datasets.map((d) => d.label))
      .rangeRound([0, x0Scale.bandwidth()])
      .padding(0.05);

    const maxValue = d3.max(data.datasets.flatMap((dataset) => dataset.data)) || 0;

    const yScale = d3
      .scaleLinear()
      .domain([0, maxValue * 1.1])
      .range([innerHeight, 0]);

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xAxis = d3.axisBottom(x0Scale);
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((d) => {
        const formatter =
          width < 400
            ? (val: number) => `${(val / 1000000).toFixed(0)}M`
            : (val: number) => `Rp ${d3.format(',.0f')(val)}`;
        return formatter(Number(d));
      })
      .ticks(width < 400 ? 5 : 10);

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', width < 400 ? '10px' : '12px');

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', width < 400 ? '10px' : '12px');

    data.labels.forEach((month, i) => {
      data.datasets.forEach((dataset) => {
        g.append('rect')
          .attr('x', (x0Scale(month) || 0) + (x1Scale(dataset.label) || 0))
          .attr('y', yScale(dataset.data[i] || 0))
          .attr('width', x1Scale.bandwidth())
          .attr('height', innerHeight - yScale(dataset.data[i] || 0))
          .attr('fill', dataset.backgroundColor)
          .attr('rx', 3)
          .attr('ry', 3);
      });
    });

    if (width >= 400) {
      const legend = svg
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - margin.right - 100}, ${margin.top})`);

      data.datasets.forEach((dataset, i) => {
        const legendItem = legend.append('g').attr('transform', `translate(0, ${i * 20})`);

        legendItem
          .append('rect')
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', dataset.backgroundColor);

        legendItem
          .append('text')
          .attr('x', 15)
          .attr('y', 10)
          .style('font-size', '12px')
          .text(dataset.label);
      });
    }
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      drawChart();
    };

    window.addEventListener('resize', handleResize);
    drawChart();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [drawChart]);

  return <svg ref={chartRef} width="100%" height="100%" />;
};
