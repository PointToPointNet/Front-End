import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import style from "../styles/total-error.module.scss";
import TotalErrorGraphPopup from "./Total-error-graph-popup";
import { IoMdHelpCircleOutline } from "react-icons/io";

interface ErrGraphData {
  date: string;
  web: number;
  ufw: number;
  auth: number;
  mysql: number;
}
interface TotalErrorProps {
  errGraphData: ErrGraphData[];
}

const TotalError: React.FC = ({
  errGraphData,
  apacheErr,
  authErr,
  mysqlErr,
  ufwErr
}) => {
  /* START Popup을 위한 코드 START */
  const [selectedDetail, setSelectedDetail] = useState(false);
  const closePopup = () => {
    setSelectedDetail(false);
  };

  const [helperVisible, setHelperVisible] = useState(false);

  /* END Popup을 위한 코드 END*/
  const ErrorRef = useRef<SVGSVGElement | null>(null);
  const colorValues = ["#C3E1FF", "#B91293", "#9747FF", "#FFD7A3"];

  const drawGraph = (
    svgRef: React.RefObject<SVGSVGElement>,
    data: ErrGraphData[]
  ) => {
    if (!svgRef.current || data.length === 0) return;

    // 그래프의 크기 세팅
    const width = parseInt(d3.select("#errorbox").style("width"), 10) - 20;
    const height = 240;
    const margin = { top: 20, right: 40, bottom: 20, left: 30 };
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
    .scaleBand()
    .domain(data.map((_, i) => i.toString())) 
    .range([0, innerWidth])
    .padding(0.6)

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        Math.max(
          d3.max(data, (d) => d.web) || 0,
          d3.max(data, (d) => d.ufw) || 0,
          d3.max(data, (d) => d.auth) || 0,
          d3.max(data, (d) => d.mysql) || 0
        )
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

    //x축입니다
    graphGroup.select(".x-axis").remove();
    graphGroup
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(data.length)
          .tickFormat((d, i) => data[i]?.date)
      )
      .style("stroke", "#aaa");

    //y축입니다
    graphGroup.select(".y-axis").remove();
    graphGroup
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).ticks(10))
      .style("stroke", "#aaa");

    // 가로 보조선 추가
    const gridLines = graphGroup.selectAll(".grid-line").data(yScale.ticks(10)); // y축 눈금 기준으로 보조선 추가
    gridLines
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .merge(gridLines)
      .attr("x1", 0)
      .attr("x2", innerWidth)
      .attr("y1", (d) => yScale(d))
      .attr("y2", (d) => yScale(d))
      .attr("stroke", "#555") // 보조선 색상
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4"); // 점선 스타일 (원하면 제거 가능)

    gridLines.exit().remove();

    //선그래프 생성 - web
    const webLineGenerator = d3
      .line<ErrGraphData>()
      .x((_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2) // Align line with bar centers
      .y((d) => yScale(d.web))
      .curve(d3.curveMonotoneX);

    // 선그래프생성 - ufw
    const ufwLineGenerator = d3
      .line<ErrGraphData>()
      .x((_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2) // Align line with bar centers
      .y((d) => yScale(d.ufw))
      .curve(d3.curveMonotoneX);

    // 선그래프생성 - auth
    const authLineGenerator = d3
      .line<ErrGraphData>()
      .x((_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2) // Align line with bar centers
      .y((d) => yScale(d.auth))
      .curve(d3.curveMonotoneX);

    // 선그래프생성 - mysql
    const mysqlLineGenerator = d3
      .line<ErrGraphData>()
      .x((_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2) // Align line with bar centers
      .y((d) => yScale(d.mysql))
      .curve(d3.curveMonotoneX);

    //선그래프 추가
    const webLinePath = graphGroup.selectAll(".web-line-path").data([data]);
    webLinePath
      .enter()
      .append("path")
      .attr("class", "web-line-path")
      .merge(webLinePath)
      .transition()
      .duration(500)
      .attr("fill", "none")
      .attr("stroke", colorValues[0] + "90")
      .attr("stroke-width", 2)
      .attr("d", webLineGenerator);

    webLinePath.exit().remove();

    const ufwLinePath = graphGroup.selectAll(".ufw-line-path").data([data]);
    ufwLinePath
      .enter()
      .append("path")
      .attr("class", "ufw-line-path")
      .merge(ufwLinePath)
      .transition()
      .duration(500)
      .attr("fill", "none")
      .attr("stroke", colorValues[1] + "90")
      .attr("stroke-width", 2)
      .attr("d", ufwLineGenerator);

    ufwLinePath.exit().remove();

    const authLinePath = graphGroup.selectAll(".auth-line-path").data([data]);
    authLinePath
      .enter()
      .append("path")
      .attr("class", "auth-line-path")
      .merge(authLinePath)
      .transition()
      .duration(500)
      .attr("fill", "none")
      .attr("stroke", colorValues[2] + "90")
      .attr("stroke-width", 2)
      .attr("d", authLineGenerator);

    authLinePath.exit().remove();

    const mysqlLinePath = graphGroup.selectAll(".mysql-line-path").data([data]);
    mysqlLinePath
      .enter()
      .append("path")
      .attr("class", "mysql-line-path")
      .merge(mysqlLinePath)
      .transition()
      .duration(500)
      .attr("fill", "none")
      .attr("stroke", colorValues[3] + "90")
      .attr("stroke-width", 2)
      .attr("d", mysqlLineGenerator);

    mysqlLinePath.exit().remove();

    //data point 각 value의 점
    const webPoints = graphGroup.selectAll(".web-data-point").data(data);
    webPoints
      .enter()
      .append("circle")
      .attr("class", "web-data-point")
      .merge(webPoints)
      .transition()
      .duration(500)
      .attr("cx", (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.web))
      .attr("r", 4)
      .attr("fill", colorValues[0]);

    webPoints.exit().remove();

    const ufwPoints = graphGroup.selectAll(".ufw-data-point").data(data);
    ufwPoints
      .enter()
      .append("circle")
      .attr("class", "ufw-data-point")
      .merge(ufwPoints)
      .transition()
      .duration(500)
      .attr("cx", (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.ufw))
      .attr("r", 4)
      .attr("fill", colorValues[1]);

    ufwPoints.exit().remove();

    const authPoints = graphGroup.selectAll(".auth-data-point").data(data);
    authPoints
      .enter()
      .append("circle")
      .attr("class", "auth-data-point")
      .merge(authPoints)
      .transition()
      .duration(500)
      .attr("cx", (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.auth))
      .attr("r", 4)
      .attr("fill", colorValues[2]);

    authPoints.exit().remove();

    const mysqlPoints = graphGroup.selectAll(".mysql-data-point").data(data);
    mysqlPoints
      .enter()
      .append("circle")
      .attr("class", "mysql-data-point")
      .merge(mysqlPoints)
      .transition()
      .duration(500)
      .attr("cx", (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.mysql))
      .attr("r", 4)
      .attr("fill", colorValues[3]);

    mysqlPoints.exit().remove();
  };

  useEffect(() => {
    drawGraph(ErrorRef, errGraphData);
  }, [errGraphData]);

  if (!errGraphData) {
    return <div className={style.body}></div>;
  }
  return (
    <div className={style.body} id="errorbox">
      {selectedDetail && (
        <TotalErrorGraphPopup
          closePopup={closePopup}
          apacheErr={apacheErr}
          authErr={authErr}
          mysqlErr={mysqlErr}
          ufwErr={ufwErr}
        ></TotalErrorGraphPopup>
      )}
      <h2 className={style.title}>⚠️ Daily Service Error Count</h2>
      <svg ref={ErrorRef}></svg>
      {/* <button className={style.btn} onClick={
        ()=>{
          setSelectedDetail(true);
        }
       }>에러 로그 자세히 보기</button> */}
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
        각 그래프당 하루의 서비스 오류 건수를 나타냅니다.
        </p>
        <p className={style.help}>
          <span className={style.help_circle_web}></span> 웹에러
          <span className={style.help_circle_mysql}></span> mysql 에러
          <span className={style.help_circle_ufw}></span> ufw 에러
          <span className={style.help_circle_auth}></span> auth 에러
        </p>
      </div>
    </div>
  );
};

export default TotalError;
