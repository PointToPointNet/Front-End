import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import style from "../styles/board-resspeed.module.scss";
import { IoMdHelpCircleOutline } from "react-icons/io";

import url from "../assets/config/url.ts";

interface BoardResspeed {
  serverName: string;
}

const BoardResspeed: React.FC<BoardResspeed> = ({ serverName }) => {
  // const [PingData, setPingData] = useState<number[]>([
  //   32.1, 33.6, 26.7, 33.3, 22.1, 25.9, 15.3, 44.2, 22.3, 11,
  // ]);
  const initialData = new Array(10).fill(0);
  const [PingData, setPingData] = useState<number[]>(initialData);

  const pingRef = useRef<SVGSVGElement | null>(null);

  const [helperVisible, setHelperVisible] = useState(false);

  useEffect(() => {
    const fetchData = (): void => {
      fetch(`${url.url}/ping`)
        .then((response) => response.json())
        .then((data) => {
          setPingData((prevPingData) => {
            const tempPing = [...prevPingData];
            tempPing.push(
              data.find(
                (server_sep: { [key: string]: object }) =>
                  serverName in server_sep
              )[serverName]?.pingResponse
            );
            tempPing.shift();
            return tempPing;
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    setPingData(initialData); // 초기화
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 1500);
    return () => clearInterval(interval);
  }, [serverName]);

  const drawGraph = (
    svgRef: React.RefObject<SVGSVGElement>,
    data: number[]
  ) => {
    if (!svgRef.current || data.length === 0) return;

    //const width = 360;
    const height = 130;
    const margin = { top: 15, right: 10, bottom: 20, left: 30 };

    const width = parseInt(d3.select("#resspeedBox").style("width"), 10) - 40;
    //const height = parseInt(d3.select('#my_dataviz').style('height'), 10);

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Scales
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([15, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data) || 50])
      .nice()
      .range([innerHeight, 0]);

    // Clear previous content
    svg.selectAll("*").remove();

    // Create graph group
    const graphGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Axes
    graphGroup
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(5)
          .tickFormat((d): string => {
            const tickTime = data.length - 1 - Number(d);
            return tickTime <= 0 ? "Now" : `${tickTime * 3}s ago`;
          })
      );

    graphGroup.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale));

    // Line generator
    const lineGenerator = d3
      .line<number>()
      .x((_, i) => xScale(i))
      .y((d) => yScale(d))
      .curve(d3.curveMonotoneX);

    // Draw line graph
    graphGroup
      .append("path")
      .datum(data)
      .attr("class", "line-path")
      .attr("fill", "none")
      .attr("stroke", "#ACEBAB")
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);

    // Draw bar chart
    graphGroup
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (_, i) => xScale(i) - innerWidth / data.length / 2)
      .attr("y", (d) => yScale(d))
      .attr("width", innerWidth / data.length - 10)
      .attr("height", (d) => innerHeight - yScale(d))
      .attr("fill", "rgba(38,203,130,0.2)");
  };

  useEffect(() => {

    drawGraph(pingRef, PingData);


  }, [PingData]);

  return (
    <div className={style.body} id="resspeedBox">
      <h2 className={style.title}>Response Speed</h2>
      <svg ref={pingRef}></svg>
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
        <p className={style.help}>ping 8.8.8.8(Google Server) 명령어를 사용해 측정한 서버의 평균 응답 속도를 보여줍니다.</p>
      </div>
    </div>
  );
};

export default BoardResspeed;
