import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const ResponsiveChart = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // 부모 요소 크기 계산
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    if (svgRef.current?.parentElement) {
      resizeObserver.observe(svgRef.current.parentElement);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // D3 차트 렌더링
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // 기존 차트를 제거

    // 예제: 간단한 막대 그래프 생성
    const data = [10, 20, 30, 40];
    const xScale = d3.scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([0, dimensions.width])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)!])
      .range([dimensions.height, 0]);

    svg.append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_, i) => xScale(i.toString())!)
      .attr("y", (d) => yScale(d))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => dimensions.height - yScale(d))
      .attr("fill", "steelblue");
  }, [dimensions]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ResponsiveChart;
