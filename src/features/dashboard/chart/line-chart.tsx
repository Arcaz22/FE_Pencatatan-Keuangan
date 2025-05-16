import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import { formatCurrency } from '@/utils/currency-utils';

type BudgetData = {
  date: string;
  amount: number;
  budget: number;
};

type LineChartProps = {
  data: BudgetData[];
};

export const LineChart = ({ data }: LineChartProps) => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  const drawChart = useCallback(() => {
    if (!chartRef.current || !data.length) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3.select(chartRef.current);
    const width = chartRef.current.clientWidth;
    const height = chartRef.current.clientHeight;
    const margin = {
      top: 20,
      right: width < 400 ? 50 : 100,
      bottom: 40,
      left: width < 400 ? 60 : 70
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.date)) as [Date, Date])
      .range([0, innerWidth])
      .nice();

    const yScale = d3
      .scaleLinear()
      .domain([0, (d3.max(data, (d) => Math.max(d.amount, d.budget)) as number) * 1.1])
      .range([innerHeight, 0])
      .nice();

    // Create line generators with smoothing
    const amountLine = d3
      .line<BudgetData>()
      .x((d) => xScale(new Date(d.date)))
      .y((d) => yScale(d.amount))
      .curve(d3.curveCardinal.tension(0.5));

    const budgetLine = d3
      .line<BudgetData>()
      .x((d) => xScale(new Date(d.date)))
      .y((d) => yScale(d.budget))
      .curve(d3.curveCardinal.tension(0.5));

    // Create chart container
    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Add light grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .select('.domain')
      .remove();

    g.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(0, ${innerHeight})`)
      .attr('opacity', 0.1)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-innerHeight)
          .tickFormat(() => '')
      )
      .select('.domain')
      .remove();

    // Configure axes with proper formatting
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(data.length > 6 ? 6 : data.length)
      .tickFormat((d) => d3.timeFormat('%d %b')(d as Date));

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat((d) => {
        if (typeof d !== 'number') return '';
        return formatCurrency(d).replace('Rp', 'Rp ');
      });

    // Add axes to chart with styling
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', width < 400 ? '10px' : '12px')
      .style('fill', 'hsl(var(--text-secondary))');

    g.selectAll('.domain').style('stroke', 'hsl(var(--text-muted) / 0.3)');
    g.selectAll('.tick line').style('stroke', 'hsl(var(--text-muted) / 0.3)');

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', width < 400 ? '10px' : '12px')
      .style('fill', 'hsl(var(--text-secondary))');

    // Add gradient for the area under the amount line
    const gradient = g
      .append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', 'hsl(var(--bg-primary) / 0.3)');

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'hsl(var(--bg-primary) / 0.05)');

    // Area under amount line
    const area = d3
      .area<BudgetData>()
      .x((d) => xScale(new Date(d.date)))
      .y0(innerHeight)
      .y1((d) => yScale(d.amount))
      .curve(d3.curveCardinal.tension(0.5));

    // Add area under the amount line
    g.append('path').datum(data).attr('fill', 'url(#area-gradient)').attr('d', area);

    // Add budget line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'hsl(var(--bg-destructive))')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,3')
      .attr('d', budgetLine);

    // Add amount line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'hsl(var(--bg-primary))')
      .attr('stroke-width', 2.5)
      .attr('d', amountLine);

    // Add dots for data points
    g.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (d) => xScale(new Date(d.date)))
      .attr('cy', (d) => yScale(d.amount))
      .attr('r', 4)
      .attr('fill', 'white')
      .attr('stroke', 'hsl(var(--bg-primary))')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function (event, d) {
        // Enlarge the circle on hover
        d3.select(this).transition().duration(200).attr('r', 6);

        // Add tooltip
        const tooltip = g
          .append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${xScale(new Date(d.date))}, ${yScale(d.amount) - 20})`);

        tooltip
          .append('rect')
          .attr('x', -60)
          .attr('y', -30)
          .attr('width', 120)
          .attr('height', 30)
          .attr('fill', 'white')
          .attr('rx', 4)
          .attr('stroke', 'hsl(var(--border-input))')
          .attr('stroke-width', 1)
          .style('filter', 'drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.1))');

        tooltip
          .append('text')
          .attr('x', 0)
          .attr('y', -10)
          .attr('text-anchor', 'middle')
          .style('font-size', '12px')
          .style('font-weight', 'bold')
          .style('fill', 'hsl(var(--text-primary))')
          .text(formatCurrency(d.amount));
      })
      .on('mouseout', function () {
        // Restore circle size
        d3.select(this).transition().duration(200).attr('r', 4);

        // Remove tooltip
        g.selectAll('.tooltip').remove();
      });

    // Add legend
    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - margin.right + 15}, ${margin.top})`);

    // Spending legend item
    const legendSpending = legend.append('g');
    legendSpending
      .append('circle')
      .attr('cx', 5)
      .attr('cy', 5)
      .attr('r', 4)
      .attr('fill', 'hsl(var(--bg-primary))');

    legendSpending
      .append('text')
      .attr('x', 15)
      .attr('y', 9)
      .text('Pengeluaran')
      .style('font-size', '12px')
      .style('fill', 'hsl(var(--text-primary))');

    // Budget legend item
    const legendBudget = legend.append('g').attr('transform', 'translate(0, 25)');
    legendBudget
      .append('line')
      .attr('x1', 0)
      .attr('x2', 15)
      .attr('y1', 5)
      .attr('y2', 5)
      .attr('stroke', 'hsl(var(--bg-destructive))')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,3');

    legendBudget
      .append('text')
      .attr('x', 20)
      .attr('y', 9)
      .text('Batas Anggaran')
      .style('font-size', '12px')
      .style('fill', 'hsl(var(--text-primary))');
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
