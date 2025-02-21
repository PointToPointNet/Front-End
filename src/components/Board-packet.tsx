import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import style from '../styles/Board-packet.module.scss';

const BoardPacket: React.FC = () => {
  interface NetworkData {
    packets: number;
    bytes: number;
  }

  const [RXData, setRXData] = useState<NetworkData[]>([
    { "packets": 32243693, "bytes": 14873201.798 },
    { "packets": 12243693, "bytes": 24873201.798 },
    { "packets": 12243693, "bytes": 24873201.798 },
    { "packets": 62243693, "bytes": 34827301.798 },
    { "packets": 12243693, "bytes": 24873201.798 },
    { "packets": 42243693, "bytes": 24872301.798 },
    { "packets": 52243693, "bytes": 84872301.798 },
    { "packets": 32243693, "bytes": 44872301.798 },
    { "packets": 22243693, "bytes": 34873201.798 },
    { "packets": 12243693, "bytes": 24873201.798 },
    { "packets": 72243693, "bytes": 24873201.798 },
    { "packets": 22243693, "bytes": 64873201.798 },
    { "packets": 12243693, "bytes": 24873201.798 },
  ]);

  const [TXData, setTXData] = useState<NetworkData[]>([
    { "packets": 22243693, "bytes": 34817301.798 },
    { "packets": 12243693, "bytes": 24872301.798 },
    { "packets": 32243693, "bytes": 64873301.798 },
    { "packets": 2243693, "bytes": 14873301.798 },
    { "packets": 12243693, "bytes": 24873201.798 },
    { "packets": 72243693, "bytes": 34873301.797 },
    { "packets": 92243693, "bytes": 14873301.797 },
    { "packets": 12243693, "bytes": 24873301.797 },
    { "packets": 22243693, "bytes": 94873301.797 },
    { "packets": 12243693, "bytes": 24873201.798 },
    { "packets": 32243693, "bytes": 24873301.797 },
    { "packets": 22243693, "bytes": 14873301.797 },
    { "packets": 12243693, "bytes": 24873201.798 },
  ]);

  const rxsvgRef = useRef<SVGSVGElement | null>(null);
  const txsvgRef = useRef<SVGSVGElement | null>(null);
  

  useEffect(() => {

    //json데이터를 읽어오자
    const interval = setInterval(() => {
      fetch("http://localhost:3000/network")
        .then((response) => response.json())
        .then((data) => {
          setRXData(prevRXData => {
            const tempRX = [...prevRXData];
            tempRX.push({
              packets: data[0].test.enp0s25.RX.packets,
              bytes: data[0].test.enp0s25.RX.bytes / 1000, // bytes 값을 1/1000로 변환
            });
            tempRX.shift();
            return tempRX;
          });
        
          setTXData(prevTXData => {
            const tempTX = [...prevTXData];
            tempTX.push({
              packets: data[0].test.enp0s25.TX.packets,
              bytes: data[0].test.enp0s25.TX.bytes / 1000, // bytes 값을 1/1000로 변환
            });
            tempTX.shift();
            return tempTX;
          });

          console.log(RXData)
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, 3000);

    return () => clearInterval(interval);

  }, []);

  const drawGraph = (svgRef: React.RefObject<SVGSVGElement>, data: NetworkData[], title: string) => {
    if (!svgRef.current || data.length === 0) return;
  
    const width = 500;
    const height = 200;
    const margin = { top: 10, right: 10, bottom: 20, left: 35 };
  
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
  
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);
  
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => Math.max(d.packets, d.bytes)) || 100])
      .nice()
      .range([innerHeight, 0]);
 


    // packet gradient정의
    const gradient_packet = svg.append("defs")
      .append("linearGradient")
      .attr("id", `area-gradient-packet`)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0).attr("y1", yScale(0))
      .attr("x2", 0).attr("y2", yScale(d3.max(data, d => d.bytes) || 0));

    gradient_packet.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(212,185,255,0)");

    gradient_packet.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(212,185,255,0.8)");

    // bytes gradient정의
    const gradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", `area-gradient-bytes`)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", 0).attr("y1", yScale(0))
    .attr("x2", 0).attr("y2", yScale(d3.max(data, d => d.bytes) || 0));

    gradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "rgba(17,37,69,0.7)");

    gradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "rgba(151,71,255,0.7)");


    let graphGroup = svg.select(".graph-group");
    if (graphGroup.empty()) {
      graphGroup = svg.append("g").attr("class", "graph-group").attr("transform", `translate(${margin.left}, ${margin.top})`);
    }
  
    graphGroup.select(".x-axis").remove();
    graphGroup.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5));
  
    graphGroup.select(".y-axis").remove();
    graphGroup.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).tickFormat(d => Math.floor(d * Math.pow(10,-5))));
  
    const areaPackets = d3.area<NetworkData>()
      .x((_, i) => xScale(i))
      .y0(innerHeight)
      .y1(d => yScale(d.packets))
      .curve(d3.curveMonotoneX);
  
    const areaBytes = d3.area<NetworkData>()
      .x((_, i) => xScale(i))
      .y0(innerHeight)
      .y1(d => yScale(d.bytes))
      .curve(d3.curveMonotoneX);
  
    const packetsPath = graphGroup.selectAll(".area-packets").data([data]);
  
    packetsPath.enter()
      .append("path")
      .attr("class", "area-packets")
      .merge(packetsPath)
      .transition()
      .duration(500)
      .attr("fill", "url(#area-gradient-packet)")
      .attr("d", areaPackets);
  
    packetsPath.exit().remove();
  
    const bytesPath = graphGroup.selectAll(".area-bytes").data([data]);
  
    bytesPath.enter()
      .append("path")
      .attr("class", "area-bytes")
      .merge(bytesPath)
      .transition()
      .duration(500)
      .attr("fill", "url(#area-gradient-bytes)")
      .attr("d", areaBytes);
  
    bytesPath.exit().remove();
  };
  

  useEffect(() => {
    drawGraph(rxsvgRef, RXData, "RX");
  }, [RXData]);

  useEffect(() => {
    drawGraph(txsvgRef, TXData, "TX");
  }, [TXData]);

  return (
    <div className={style.packetbox}>
      <div className={style.body}>
        <h2 className={style.title}>Receive</h2>
        <svg ref={rxsvgRef}></svg>
      </div>
      <div className={style.body}>
        <h2 className={style.title}>Transmit</h2>
        {<svg ref={txsvgRef}></svg>}
      </div>
    </div>
  );
}

export default BoardPacket;
