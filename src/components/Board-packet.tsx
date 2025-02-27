import { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import style from '../styles/board-packet.module.scss';
import { IoMdHelpCircleOutline } from "react-icons/io";
import url from "../assets/config/url.ts";

interface BoardPacket {
  serverName: string;
}

const BoardPacket: React.FC<BoardPacket> = ({ serverName }) => {
  interface NetworkData {
    packets: number;
    bytes: number;
  }

  // const [RXData, setRXData] = useState<NetworkData[]>([
  //   { "packets": 32243693, "bytes": 14873201.798 },
  //   { "packets": 12243693, "bytes": 24873201.798 },
  //   { "packets": 12243693, "bytes": 24873201.798 },
  //   { "packets": 62243693, "bytes": 34827301.798 },
  //   { "packets": 12243693, "bytes": 24873201.798 },
  //   { "packets": 42243693, "bytes": 24872301.798 },
  //   { "packets": 52243693, "bytes": 84872301.798 },
  //   { "packets": 32243693, "bytes": 44872301.798 },
  //   { "packets": 22243693, "bytes": 34873201.798 },
  //   { "packets": 12243693, "bytes": 24873201.798 },
  //   { "packets": 72243693, "bytes": 24873201.798 },
  //   { "packets": 22243693, "bytes": 64873201.798 },
  //   { "packets": 12243693, "bytes": 24873201.798 },
  // ]);

  // const [TXData, setTXData] = useState<NetworkData[]>([
  //   { "packets": 22243693, "bytes": 34817301.798 },
  //   { "packets": 12243693, "bytes": 24872301.798 },
  //   { "packets": 32243693, "bytes": 64873301.798 },
  //   { "packets": 2243693, "bytes": 14873301.798 },
  //   { "packets": 12243693, "bytes": 24873201.798 },
  //   { "packets": 72243693, "bytes": 34873301.797 },
  //   { "packets": 92243693, "bytes": 14873301.797 },
  //   { "packets": 12243693, "bytes": 24873301.797 },
  //   { "packets": 22243693, "bytes": 94873301.797 },
  //   { "packets": 12243693, "bytes": 24873201.798 },
  //   { "packets": 32243693, "bytes": 24873301.797 },
  //   { "packets": 22243693, "bytes": 14873301.797 },
  //   { "packets": 12243693, "bytes": 24873201.798 },
  // ]);
  const initialData = new Array(13).fill({ "packets": 0, "bytes": 0 })

  const [helperVisibleR, setHelperVisibleR] = useState(false);
  const [helperVisibleT, setHelperVisibleT] = useState(false);

  const [RXData, setRXData] = useState<NetworkData[]>(initialData);
  const [TXData, setTXData] = useState<NetworkData[]>(initialData);

  const rxsvgRef = useRef<SVGSVGElement | null>(null);
  const txsvgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const prevRX = { packets: 0, bytes: 0 };
    const prevTX = { packets: 0, bytes: 0 };

    const fetchData = (): void => {
      fetch(`${url.url}/network`)
        .then((response) => response.json())
        .then((data) => {

          const curRX = {
            packets: Number(data.find(((server_sep: { [key: string]: object }) => serverName in server_sep))[serverName].enp0s25.RX.packets),
            bytes: Number(data.find(((server_sep: { [key: string]: object }) => serverName in server_sep))[serverName].enp0s25.RX.bytes) / 100,
          };
          const curTX = {
            packets: Number(data.find(((server_sep: { [key: string]: object }) => serverName in server_sep))[serverName].enp0s25.TX.packets),
            bytes: Number(data.find(((server_sep: { [key: string]: object }) => serverName in server_sep))[serverName].enp0s25.TX.bytes) / 100,
          };

          const diffRX = {
            packets: prevRX.packets === 0 ? 0 : Math.abs(curRX.packets - prevRX.packets),
            bytes: prevRX.bytes === 0 ? 0 : Math.abs(curRX.bytes - prevRX.bytes),
          }
          const diffTX = {
            packets: prevTX.packets === 0 ? 0 : Math.abs(curTX.packets - prevTX.packets),
            bytes: prevTX.bytes === 0 ? 0 : Math.abs(curTX.bytes - prevTX.bytes),
          }

          prevRX.packets = curRX.packets;
          prevRX.bytes = curRX.bytes;
          prevTX.packets = curTX.packets;
          prevTX.bytes = curTX.bytes;

          // console.log(diffRX);
          // console.log(diffTX);

          setRXData(prevRXData => {
            const tempRX = [...prevRXData];

            tempRX.push(diffRX);
            tempRX.shift();
            return tempRX;
          });

          setTXData(prevTXData => {
            const tempTX = [...prevTXData];

            tempTX.push(diffTX);
            tempTX.shift();
            return tempTX;
          });

          // console.log(RXData)
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
    //json데이터를 읽어오자
    setRXData(initialData);
    setTXData(initialData);
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 1500);

    return () => clearInterval(interval);

  }, [serverName]);

  const drawGraph = (svgRef: React.RefObject<SVGSVGElement>, data: NetworkData[], title: string) => {
    if (!svgRef.current || data.length === 0) return;

    //const width = 500;
    const width = parseInt(d3.select('#packetBox').style('width'), 10) - 40;
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



    // // packet gradient정의
    // const gradient_packet = svg.append("defs")
    //   .append("linearGradient")
    //   .attr("id", `area-gradient-packet`)
    //   .attr("gradientUnits", "userSpaceOnUse")
    //   .attr("x1", 0).attr("y1", yScale(0))
    //   .attr("x2", 0).attr("y2", yScale(d3.max(data, d => d.bytes) || 0));

    // gradient_packet.append("stop")
    //   .attr("offset", "0%")
    //   .attr("stop-color", "rgba(212,185,255,0)");

    // gradient_packet.append("stop")
    //   .attr("offset", "100%")
    //   .attr("stop-color", "rgba(212,185,255,0.8)");

    // // bytes gradient정의
    // const gradient = svg.append("defs")
    //   .append("linearGradient")
    //   .attr("id", `area-gradient-bytes`)
    //   .attr("gradientUnits", "userSpaceOnUse")
    //   .attr("x1", 0).attr("y1", yScale(0))
    //   .attr("x2", 0).attr("y2", yScale(d3.max(data, d => d.bytes) || 0));

    // gradient.append("stop")
    //   .attr("offset", "0%")
    //   .attr("stop-color", "rgba(17,37,69,0.7)");

    // gradient.append("stop")
    //   .attr("offset", "100%")
    //   .attr("stop-color", "rgba(151,71,255,0.7)");


    let graphGroup = svg.select(".graph-group");
    if (graphGroup.empty()) {
      graphGroup = svg.append("g").attr("class", "graph-group").attr("transform", `translate(${margin.left}, ${margin.top})`);
    }

    graphGroup.select(".x-axis").remove();
    graphGroup.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(
        d3.axisBottom(xScale).ticks(5)
          .tickFormat((d): string => {
            const tickTime = (data.length - 1) - Number(d);
            return tickTime <= 0 ? "Now" : `${tickTime * 1.5}s ago`;
          })
      );

    graphGroup.select(".y-axis").remove();
    graphGroup.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).tickFormat(d => Math.floor(d)));

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
      .attr("fill", "rgba(212,185,255,0.8)")
      .attr("d", areaPackets);

    packetsPath.exit().remove();

    const bytesPath = graphGroup.selectAll(".area-bytes").data([data]);

    bytesPath.enter()
      .append("path")
      .attr("class", "area-bytes")
      .merge(bytesPath)
      .transition()
      .duration(500)
      .attr("fill", "rgba(151,71,255,0.7)")
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
      <div className={style.body} id="packetBox">
        <h2 className={style.title}>Receive Packet</h2>
        <svg ref={rxsvgRef}></svg>
        <button className={style.helpBtn} onClick={() => { setHelperVisibleR(!helperVisibleR) }}><IoMdHelpCircleOutline /></button>
        <div className={style.helper} style={{ display: helperVisibleR ? "flex" : "none" }} onClick={() => { setHelperVisibleR(!helperVisibleR) }}>
          <p className={style.help}>패킷(Packet)은 인터넷을 통해 데이터를 주고받을 때 쪼개지는 작은 조각입니다.</p> <p className={style.help}>Packet은 택배상자로 비유 가능하며, 큰 데이터를를 보내려면, 작은 상자(Packet)로 나누어어서 보내야 합니다.</p>
          <p className={style.help}>Transimit Packet(TX, Upload)은 Packet의 송신량을 나타내며 내가 데이터를 보낼 때 수치가 증가합니다.</p>
        </div>
      </div>
      <div className={style.body}>
        <h2 className={style.title}>Transmit Packet</h2>
        {<svg ref={txsvgRef}></svg>}
        <button className={style.helpBtn} onClick={() => { setHelperVisibleT(!helperVisibleT) }}><IoMdHelpCircleOutline /></button>
        <div className={style.helper} style={{ display: helperVisibleT ? "flex" : "none" }} onClick={() => { setHelperVisibleT(!helperVisibleT) }}>
          <p className={style.help}>패킷(Packet)은 인터넷을 통해 데이터를 주고받을 때 쪼개지는 작은 조각입니다.</p> <p className={style.help}>Packet은 택배상자로 비유 가능합니다.</p>
          <p className={style.help}>Receive Packet(RX, Download)은 패킷의 수신량을 나타내며 내가 데이터를 받을 때 수치가 증가합니다.</p>

        </div>
      </div>
    </div>
  );
}

export default BoardPacket;