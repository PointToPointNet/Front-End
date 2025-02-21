import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import style from '../styles/Board-packet.module.scss';

const BoardPacket: React.FC = () => {
  interface NetworkData {
    packets: number;
    bytes: number;
  }

  const [RXData, setRXData] = useState<NetworkData[]>([
    { packets: 31499111952, bytes: 14872699632 },
    { packets: 3355941123, bytes: 21938207568 },
    { packets: 28479112952, bytes: 13849333632 },
    { packets: 3273411113, bytes: 11872699632 },
    { packets: 31499911152, bytes: 148799632 },
    { packets: 3355941123, bytes: 21938807568 },
    { packets: 4100001100, bytes: 23834724 },
    { packets: 2847511443, bytes: 9872634632 },
    { packets: 54838111234, bytes: 13872699632 },
    { packets: 3281111343, bytes: 11872699632 },
  ]);

  const [TXData, setTXData] = useState<NetworkData[]>([
    { packets: 28475422343, bytes: 98723234232 },
    { packets: 234232132333, bytes: 23342236332 },
    { packets: 54332322334, bytes: 313872629632 },
    { packets: 32817312423, bytes: 772699632 },
    { packets: 54838254434, bytes: 138769961132 },
    { packets: 32817222343, bytes: 21872699632 },
    { packets: 31499993952, bytes: 248723119632 },
    { packets: 3355332423, bytes: 21938807568 },
    { packets: 12847923952, bytes: 338442632 },
    { packets: 41000100110, bytes: 11872699632 },
  ]);

  const rxsvgRef = useRef<SVGSVGElement | null>(null);
  const txsvgRef = useRef<SVGSVGElement | null>(null);
  

  useEffect(() => {

    //json데이터를 읽어오자
    const interval = setInterval(() => {
      fetch("http://localhost:3000/network")
        .then((response) => response.json())
        .then((data) => {
          
            let tempRX = [...RXData];
            console.log(data[0].test.enp0s25.RX);
            tempRX.push(data[0].test.enp0s25.RX);
            tempRX.shift();
            setRXData(tempRX);
        
            let tempTX = [...TXData];
            tempTX.push(data[0].test.enp0s25.TX);
            tempTX.shift();
            setTXData(tempTX);

            console.log("rx" + RXData[8].packets + '/' + RXData[9].packets);
            console.log("tx" + TXData[9].packets);

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

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

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



    // x축
    svg
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .style("stroke", "#444");
      
    // y축
    svg.append("g").call(
      d3.axisLeft(yScale)
        .tickFormat(d => (Math.floor(d * 0.00000001)))
    ).style("stroke", "#444");


  
    const area1 = d3.area<NetworkData>()
      .x((_, i) => xScale(i))
      .y0(innerHeight)
      .y1(d => yScale(d.packets))
      .curve(d3.curveMonotoneX);

    const area2 = d3.area<NetworkData>()
      .x((_, i) => xScale(i))
      .y0(innerHeight)
      .y1(d => yScale(d.bytes))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "url(#area-gradient-packet)")
      .attr("d", area1)

      //console.log(d3.max(data, d => Math.max(d.packets, d.bytes)))
    svg
      .append("path")
      .datum(data)
      .attr("fill", `url(#area-gradient-bytes)`)
      .attr("d", area2)
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