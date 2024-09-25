import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import styles from './Favorites.module.scss';
import BookMark from '../common/BookMark';

const Favorites = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // 노드 데이터(제목, 저자, 연도)
  const [nodesData, setNodesData] = useState<any[]>([
    { id: '썸타기와 어장관리에...', group: 1, author: '최성호', year: 2020 },
    { id: '도파민 터지는 세상', group: 2, author: '장래혁', year: 2024 },
    { id: '누적된 생애 트라우마', group: 1, author: '김혜윤', year: 2022 },
    { id: '서브3', group: 2, author: '저자4', year: 2021 },
    { id: '서브4', group: 3, author: '저자5', year: 2022 },
  ]);

  // 링크 데이터
  const [linksData, setLinksData] = useState<any[]>([
    { source: '썸타기와 어장관리에...', target: '서브3' },
    { source: '서브3', target: '서브4' },
    { source: '서브4', target: '도파민 터지는 세상' },
    { source: '서브4', target: '누적된 생애 트라우마' },
  ]);

  // 클릭된 노드 관리
  const [selectedNode, setSelectedNode] = useState<any>(null);
  // 클릭된 노드와 링크된 목록 관리
  const [linkedNodes, setLinkedNodes] = useState<any[]>([]);

  useEffect(() => {
    // D3 라이브러리로 SVG 엘리먼트
    const svg = d3.select(svgRef.current);
    // 이전 렌더링 내용 초기화
    svg.selectAll('*').remove();

    const width = 600;
    const height = 400;

    // SVG 크기 설정
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // 줌 핸들러 설정(사용자가 확대/축소 가능하도록)
    const zoomHandler = d3
      .zoom()
      // 줌의 최소 최대 비율 설정
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        svgGroup.attr('transform', event.transform);
      });

    // 줌 핸들러 svg에 적용
    svg.call(zoomHandler);

    // SVG 그룹 생성, 모든 노드와 링크가 그룹에 추가
    const svgGroup = svg.append('g');

    // 노드 색상을 그룹별로 설정
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 시뮬레이션 생성
    const simulation = d3
      .forceSimulation(nodesData)
      .force(
        'link',
        d3
          .forceLink(linksData)
          // 각 노드의 id로 링크를 정의
          .id((d: any) => d.id)
          // 링크 간의 거리 설정
          .distance(150),
      )
      // 노드 간 반발력 설정
      .force('charge', d3.forceManyBody().strength(-400))
      // 시뮬레이션 중심 위치 지정
      .force('center', d3.forceCenter(width / 2, height / 2));

    // 링크 그림
    const link = svgGroup
      .append('g')
      // 링크 색상
      .attr('stroke', '#999')
      // 링크 투명도
      .attr('stroke-opacity', 0.5)
      .selectAll('line')
      // 링크 데이터 바인딩
      .data(linksData)
      .enter()
      .append('line')
      // 링크 두께 설정
      .attr('stroke-width', 2);

    // 노드 그림
    const node = svgGroup
      .append('g')
      // 노드 테두리 색상
      .attr('stroke', '#fff')
      // 노드 테두리 두께
      // .attr('stroke-width', 0.5)
      .selectAll('polygon')
      // 노드 데이터 바인딩
      .data(nodesData)
      .enter()
      .append('polygon')
      // 별 좌표 생성
      .attr('points', createStarPoints(0, 0, 15, 7, 5))
      // 그룹에 따른 색상 지정
      .attr('fill', (d: any) => color(d.group))
      // 드래그 핸들러 추가
      .call(d3.drag().on('start', dragStarted).on('drag', dragged).on('end', dragEnded))
      // 노드 클릭시 처리할 함수
      .on('click', (event: any, d: any) => handleClick(d, linksData));

    // 노드에 제목 추가
    const text = svgGroup
      .append('g')
      .selectAll('text')
      // 노드 데이터 바인딩
      .data(nodesData)
      .enter()
      .append('text')
      .attr('x', 8)
      .attr('y', 3)
      // 텍스트는 노드 제목
      .text((d: any) => d.id)
      .style('font-size', '12px')
      // 텍스트 색상
      .style('fill', '#fff');

    // 시뮬레이션 각 단계마다 위치 업뎃
    simulation.on('tick', () => {
      // 링크 위치 설정
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);
      // 노드 위치 설정
      node.attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);
      // 텍스트 위치 설정
      text.attr('x', (d: any) => d.x + 10).attr('y', (d: any) => d.y + 5);
    });

    // 드래그 시작 시 호출 함수
    function dragStarted(event: any, d: any) {
      // 시뮬레이션 재시작
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    // 드래그 중 호출 함수
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    // 드래그 종료 호출 함수
    function dragEnded(event: any, d: any) {
      // 시뮬레이션 멈춤
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // 노드 클릭 시 호출 함수
    function handleClick(d: any, links: any) {
      // 선택된 노드 상태 설정
      setSelectedNode(d);
      const relatedNodes = links
        // 클릭된 노드와 연결된 링크 찾기
        .filter((link: any) => link.source.id === d.id || link.target.id === d.id)
        // 연결된 노드 가져오기
        .map((link: any) => (link.source.id === d.id ? link.target : link.source));
      // 연결된 노드들을 상태에 저장
      setLinkedNodes([d, ...relatedNodes]);
    }
    // nodesData와 linksData가 변경될 때마다 useEffect 실행
  }, [nodesData, linksData]);

  // 노드 삭제 함수
  const removeNode = (id: string) => {
    // 해당 ID 가진 노드 삭제
    const newNodes = nodesData.filter((node) => node.id !== id);
    // 해당 노드와 연결된 링크 삭제
    const newLinks = linksData.filter((link) => link.source.id !== id && link.target.id !== id);
    // 새로운 노드 데이터 설정
    setNodesData(newNodes);
    // 새로운 링크 데이터 설정
    setLinksData(newLinks);
    // 선택된 노드를 초기화
    setSelectedNode(null);
  };

  return (
    <div className={styles.favorites}>
      <svg
        ref={svgRef}
        className={styles.networkChart}
      ></svg>

      {selectedNode && (
        <div className={styles.infoBox}>
          <button
            className={styles.closeButton}
            onClick={() => setSelectedNode(null)}
          >
            ✕
          </button>
          <ul className={styles.nodeList}>
            {linkedNodes.map((node, index) => (
              <li key={index}>
                <p>제목: {node.id}</p>
                <p>저자: {node.author}</p>
                <p>년도: {node.year}</p>
                <button
                  className={styles.bookmarkButton}
                  onClick={() => removeNode(node.id)}
                >
                  <BookMark />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Favorites;

function createStarPoints(cx, cy, outerRadius, innerRadius, numPoints) {
  let points = '';
  // 별의 각도 계산
  const angle = Math.PI / numPoints;

  for (let i = 0; i < 2 * numPoints; i++) {
    // 바깥과 안쪽 반지름을 번갈아 사용
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    // x 좌표 계산
    const x = cx + r * Math.cos(i * angle);
    // y 좌표 계산
    const y = cy + r * Math.sin(i * angle);
    points += `${x},${y} `;
  }

  // 최종 좌표 반환
  return points.trim();
}
