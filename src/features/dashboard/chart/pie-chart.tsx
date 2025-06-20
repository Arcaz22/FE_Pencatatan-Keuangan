import { useEffect, useRef, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { PieChartData } from '@/types/api';
import { formatCurrency } from '@/utils/currency-utils';

type PieArcDatum = d3.PieArcDatum<PieChartData>;

type PieChartProps = {
  data: PieChartData[];
  colors: string[];
};

export const PieChart = ({ data, colors }: PieChartProps) => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const [activeSegment, setActiveSegment] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const drawChart = useCallback(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    d3.select(chartRef.current).selectAll('*').remove();

    const svg = d3.select(chartRef.current);
    const width = chartRef.current.clientWidth;
    const height = chartRef.current.clientHeight;
    const radius = (Math.min(width, height) / 2) * 0.8;

    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((d) => d.name))
      .range(colors);

    const pie = d3
      .pie<PieChartData>()
      .sort(null)
      .value((d) => d.value);

    const arc = d3
      .arc<PieArcDatum>()
      .innerRadius(radius * 0.4)
      .outerRadius(radius);

    const arcHover = d3
      .arc<PieArcDatum>()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 1.15);

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arcs = g.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');

    arcs
      .append('path')
      .attr('d', (d) => arc(d))
      .attr('fill', (d) => color(d.data.name) as string)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('cursor', 'pointer')
      .attr('class', (d) => `pie-slice pie-slice-${d.data.name.replace(/\s+/g, '-').toLowerCase()}`)
      .on('mouseover', function (event, d) {
        const [mouseX, mouseY] = d3.pointer(event);

        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', (d) => arcHover(d))
          .style('opacity', 1);

        setTooltipPosition({
          x: mouseX + width / 2,
          y: mouseY + height / 2
        });
        setActiveSegment(d.data.name);
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', (d) => arc(d))
          .style('opacity', 0.9);

        setActiveSegment(null);
      });

    const total = d3.sum(data, (d) => d.value);

    arcs
      .append('text')
      .attr('transform', (d) => {
        const centroid = arc.centroid(d);
        return `translate(${centroid[0]}, ${centroid[1]})`;
      })
      .attr('dy', '.35em')
      .attr('text-anchor', 'middle')
      .style('font-size', width < 400 ? '10px' : '12px')
      .style('fill', 'black')
      .style('font-weight', 'bold')
      .style('pointer-events', 'none')
      .text((d) => {
        const percentage = (d.data.value / total) * 100;
        return percentage > 5 ? `${Math.round(percentage)}%` : '';
      });

    const legendX = width < 400 ? 10 : width - 100;
    const legendY = width < 400 ? height - data.length * 20 - 10 : 10;

    const legend = svg
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${legendX}, ${legendY})`);

    data.forEach((item, i) => {
      const legendItem = legend
        .append('g')
        .attr('transform', `translate(0, ${i * 20})`)
        .style('cursor', 'pointer')
        .on('mouseover', function () {
          const pieSlice = svg.select(`.pie-slice-${item.name.replace(/\s+/g, '-').toLowerCase()}`);
          const pieSliceNode = pieSlice.node();
          if (pieSliceNode) {
            const event = new MouseEvent('mouseover');
            pieSliceNode.dispatchEvent(event);
          }
        })
        .on('mouseout', function () {
          const pieSlice = svg.select(`.pie-slice-${item.name.replace(/\s+/g, '-').toLowerCase()}`);
          const pieSliceNode = pieSlice.node();
          if (pieSliceNode) {
            const event = new MouseEvent('mouseout');
            pieSliceNode.dispatchEvent(event);
          }
        });

      legendItem
        .append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', color(item.name) as string);

      legendItem
        .append('text')
        .attr('x', 15)
        .attr('y', 10)
        .style('font-size', width < 400 ? '10px' : '12px')
        .text(item.name);
    });
  }, [data, colors]);

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

  const activeItem = activeSegment ? data.find((item) => item.name === activeSegment) : null;

  return (
    <div className="relative w-full h-full">
      <svg ref={chartRef} width="100%" height="100%" />

      {activeItem && (
        <div
          className="absolute pointer-events-none bg-white p-2 rounded shadow-lg border border-gray-200 z-10"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 80}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    colors[data.findIndex((item) => item.name === activeItem.name) % colors.length]
                }}
              ></div>
              <span className="font-medium">{activeItem.name}</span>
            </div>
            <span className="text-[hsl(var(--text-secondary))]">
              {formatCurrency(activeItem.value)}
            </span>
            <span className="text-sm text-[hsl(var(--text-secondary))]">
              {Math.round(
                (activeItem.value / data.reduce((acc, curr) => acc + curr.value, 0)) * 100
              )}
              %
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
