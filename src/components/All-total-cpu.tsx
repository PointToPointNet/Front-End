import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import style from "../styles/total-cpu.module.scss";
import { IoMdHelpCircleOutline } from "react-icons/io";

interface CpuData {
  date: string;
  value: number;
}

const TotalCpu: React.FC = () => {
  const cpuRef = useRef<SVGSVGElement | null>(null);
  const colorValues = ["#ADEBAC", "#FFB6C1"]; // 선 색상 배열
  const [helperVisible, setHelperVisible] = useState(false);

  // 첫번째 서버 
  const cpuDataGroup1: CpuData[] = [
    { date: "2025.01.02", value: 15 },
    { date: "2025.01.03", value: 30 },
    { date: "2025.01.04", value: 10 },
    { date: "2025.01.05", value: 20 },
    { date: "2025.01.06", value: 45 },
    { date: "2025.01.07", value: 30 },
  ];

  //두번째 서버
  const cpuDataGroup2: CpuData[] = [
    { date: "2025.01.02", value: 25 },
    { date: "2025.01.03", value: 30 },
    { date: "2025.01.04", value: 10 },
    { date: "2025.01.05", value: 60 },
    { date: "2025.01.06", value: 44 },
    { date: "2025.01.07", value: 30 },
  ];

  const drawGraph = (
    svgRef: React.RefObject<SVGSVGElement>,
    dataGroups: CpuData[][]
  ) => {
    if (!svgRef.current || dataGroups.length === 0) return;

    const width = parseInt(d3.select("#cpubox").style("width"), 10) - 20;
    const height = 220;
    const margin = { top: 20, right: 40, bottom: 20, left: 30 };
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // x축 스케일 설정
    const xScale = d3
      .scaleBand()
      .domain(dataGroups[0].map((d) => d.date))
      .range([0, innerWidth])
      .padding(0.6);

    // y축 스케일 설정
    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(dataGroups.flat(), (d) => d.value) || 100, // 모든 데이터 그룹에서 최대값 찾기
      ])
      .nice()
      .range([innerHeight, 0]);

    let graphGroup = svg.select(".graph-group");
    if (graphGroup.empty()) {
      graphGroup = svg
        .append("g")
        .attr("class", "graph-group")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .style("stroke", "#aaa");
    }

    // x축 생성
    graphGroup.select(".x-axis").remove();
    graphGroup
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .style("stroke", "#aaa");

    // y축 생성
    graphGroup.select(".y-axis").remove();
    graphGroup
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).ticks(10))
      .style("stroke", "#aaa");

    // 가로 보조선 추가
    const gridLines = graphGroup.selectAll(".grid-line").data(yScale.ticks(10));
    gridLines
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .merge(gridLines)
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#555")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4");

    gridLines.exit().remove();

    // 각 데이터 그룹에 대해 선 그래프 생성
    dataGroups.forEach((data, index) => {
      const lineGenerator = d3
        .line<CpuData>()
        .x((d) => (xScale(d.date) || 0) + xScale.bandwidth() / 2)
        .y((d) => yScale(d.value))
        .curve(d3.curveMonotoneX);

      // 선 그래프 추가
      const linePath = graphGroup.selectAll(`.line-path-${index}`).data([data]);
      linePath
        .enter()
        .append("path")
        .attr("class", `line-path-${index}`)
        .merge(linePath)
        .transition()
        .duration(500)
        .attr("fill", "none")
        .attr("stroke", colorValues[index]) // 각 그룹마다 다른 색상 적용
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);

      linePath.exit().remove();

      // 데이터 포인트 추가 (각 점 표시)
      const points = graphGroup.selectAll(`.data-point-${index}`).data(data);
      points
        .enter()
        .append("circle")
        .attr("class", `data-point-${index}`)
        .merge(points)
        .transition()
        .duration(500)
        .attr(
          "cx",
          (d) => (xScale(d.date) || 0) + xScale.bandwidth() / 2
        )
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 4)
        .attr("fill", colorValues[index]);

      points.exit().remove();
    });
  };

  useEffect(() => {
    drawGraph(cpuRef, [cpuDataGroup1, cpuDataGroup2]); // 두 그룹 데이터를 전달
  }, []);

  return (
    <div className={style.body} id="cpubox">
      <h2 className={style.title}>💻 Daily CPU Usage(%) </h2>
      <svg ref={cpuRef}></svg>
      <button
        className={style.helpBtn}
        onClick={() => {
          setHelperVisible(!helperVisible);
        }}
      >
        <IoMdHelpCircleOutline />
      </button>
      <div
        className={style.helper}
        style={{ display: helperVisible ? "flex" : "none" }}
        onClick={() => {
          setHelperVisible(!helperVisible);
        }}
      >
        <p className={style.help}>
          그래프 하나당 하루의 CPU 사용률을 보여줍니다.
        </p>
        <p className={style.help}>
          CPU 부하 상태를 확인하여 성능 저하가 발생하기 전에 대처할 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default TotalCpu;
