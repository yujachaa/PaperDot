import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './Favorites.module.scss';

const Favorites = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const data = {
      nodes: [
        { id: '별1', group: 1 },
        { id: '별2', group: 2 },
        { id: '별3', group: 1 },
        { id: '별4', group: 2 },
        { id: '별5', group: 3 },
      ],
      links: [
        { source: '별1', target: '별2' },
        { source: '별2', target: '별3' },
        { source: '별3', target: '별4' },
        { source: '별4', target: '별5' },
        { source: '별5', target: '별1' },
      ],
    };

    const width = 600;
    const height = 400;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // 1. 색상 스케일 초기화
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 힘 기반 레이아웃
    const simulation = d3
      .forceSimulation(data.nodes)
      .force(
        'link',
        d3
          .forceLink(data.links)
          .id((d: any) => d.id)
          .distance(150),
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // 링크 생성
    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('stroke-width', 2);

    // 노드 생성
    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d: any) => color(d.group))
      .call(d3.drag().on('start', dragStarted).on('drag', dragged).on('end', dragEnded));

    // 노드 이름(텍스트) 추가
    const text = svg
      .append('g')
      .selectAll('text')
      .data(data.nodes)
      .enter()
      .append('text')
      .attr('x', 8)
      .attr('y', 3)
      .text((d: any) => d.id)
      .style('font-size', '12px')
      .style('fill', '#333');

    // 노드 및 링크 위치 업데이트 (애니메이션)
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

      text.attr('x', (d: any) => d.x + 10).attr('y', (d: any) => d.y + 5);
    });

    // 드래그 이벤트 처리 함수
    function dragStarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, []);

  return (
    <div className={styles.favorites}>
      <svg
        ref={svgRef}
        className={styles.networkChart}
      ></svg>
    </div>
  );
};

export default Favorites;
