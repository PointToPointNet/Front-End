import { useEffect, useState, useRef } from 'react';
import * as d3 from "d3";
interface DashBoardMainBoxProps {
    server: string,
    runtime: string,
    memory: string,
    cpu: string,
    disk: string,
    ping: string
}
const DashboardMainBox: React.FC<DashBoardMainBoxProps> = ({ server, runtime, memory, cpu, disk, ping }) => {
    const boxGraph = useRef<SVGSVGElement | null>(null);
    const [pingHistory, setPingHistory] = useState<number[]>([
        32.1, 33.6, 26.7, 33.3, 22.1, 25.9, 15.3, 44.2, 22.3, 11,
    ]);

    useEffect(() => {
        const newPing = parseFloat(ping);
        setPingHistory(prev => {
            const newHistory = [...prev, newPing];
            return newHistory.slice(-10);  // 최근 10개 데이터만 유지
        });
    }, [ping]);

    useEffect(() => {
        if (!boxGraph.current) return;

        // 기본 설정
        const width = 360;
        const height = 200;
        const margin = { top: 10, right: 50, bottom: 20, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // SVG 설정
        const svg = d3.select(boxGraph.current)
            .attr("width", width)
            .attr("height", height);

        svg.selectAll("*").remove();

        // 막대 그래프 데이터
        const barData = [
            { name: "CPU", value: parseFloat(cpu) },
            { name: "Memory", value: parseFloat(memory) },
            { name: "Disk", value: parseFloat(disk) }
        ];

        // 스케일 설정
        const xScaleBar = d3.scaleBand()
            .domain(barData.map(d => d.name))
            .range([0, innerWidth])
            .padding(0.4);

        const yScaleBar = d3.scaleLinear()
            .domain([0, 100])
            .range([innerHeight, 0]);

        const yScalePing = d3.scaleLinear()
            .domain([0, Math.max(...pingHistory, 80)])
            .range([innerHeight, 0]);

        // ping x축 스케일 수정 - 시간 기반
        const xScalePing = d3.scaleLinear()
            .domain([0, (pingHistory.length - 1)])  // 2초 간격으로 설정
            .range([15, innerWidth]);

        // 그래프 그룹 생성
        const graphGroup = svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // 막대 그래프 그리기
        graphGroup.selectAll(".bar")
            .data(barData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => xScaleBar(d.name) || 0)
            .attr("y", d => yScaleBar(d.value))
            .attr("width", xScaleBar.bandwidth())
            .attr("height", d => innerHeight - yScaleBar(d.value))
            .attr("fill", d => {
                const value = d.value;
                if (value < 50) return "rgba(74, 222, 128, 0.6)";
                if (value < 75) return "rgba(251, 191, 36, 0.6)";
                return "rgba(239, 68, 68, 0.6)";
            });

        // 막대 그래프 레이블
        graphGroup.selectAll(".bar-label")
            .data(barData)
            .enter()
            .append("text")
            .attr("class", "bar-label")
            .attr("x", d => (xScaleBar(d.name) || 0) + xScaleBar.bandwidth() / 2)
            .attr("y", d => yScaleBar(d.value) - 5)
            .attr("text-anchor", "middle")
            .text(d => `${d.name}`)
            .attr("fill", "white")
            .attr("font-size", "12px");

        // Ping 그래프 그리기
        if (pingHistory.length > 1) {
            const lineGenerator = d3.line<number>()
                .x((_, i) => xScalePing(i))  // 2초 간격
                .y(d => yScalePing(d))
                .curve(d3.curveMonotoneX);

            const areaGenerator = d3.area<number>()
                .x((_, i) => xScalePing(i))  // 2초 간격
                .y0(innerHeight)
                .y1(d => yScalePing(d))
                .curve(d3.curveMonotoneX);

            // 영역 추가
            graphGroup.append("path")
                .datum(pingHistory)
                .attr("class", "area")
                .attr("fill", "rgba(172, 235, 171, 0.1)")
                .attr("d", areaGenerator);

            // 선 추가
            graphGroup.append("path")
                .datum(pingHistory)
                .attr("class", "line-path")
                .attr("fill", "none")
                .attr("stroke", "#ACEBAB")
                .attr("stroke-width", 2)
                .attr("d", lineGenerator);

            // 현재 Ping 값 표시
            // graphGroup.append("text")
            //   .attr("x", innerWidth)
            //   .attr("y", yScalePing(pingHistory[pingHistory.length - 1]))
            //   .attr("dx", "0.5em")
            //   .attr("dy", "-0.5em")
            //   .attr("text-anchor", "start")
            //   .text(`${pingHistory[pingHistory.length - 1]}ms`)
            //   .attr("fill", "#4B5563")
            //   .attr("font-size", "12px");

            // ping x축 추가 (시간 표시)
            graphGroup.append("g")
                .attr("transform", `translate(0, ${innerHeight})`)
                .call(d3.axisBottom(xScalePing)
                    .ticks(5)  // 5개의 눈금만 표시
                    .tickFormat(d => `${d}`)  // 초 단위 표시
                );
        }

        // 왼쪽 y축 (퍼센트)
        graphGroup.append("g")
            .call(d3.axisLeft(yScaleBar).ticks(5).tickFormat(d => `${d}%`));

        // 오른쪽 y축 (ping)
        graphGroup.append("g")
            .attr("transform", `translate(${innerWidth}, 0)`)
            .call(d3.axisRight(yScalePing).ticks(5).tickFormat(d => `${d}ms`));

    }, [cpu, memory, disk, pingHistory]);

    const [runtimeText, setRuntimeText] = useState<string | null>(null);
    useEffect(() => {
        const hour = Math.floor(Number(runtime) / 60) % 24;
        const minute = Number(runtime) % 60;
        const days = Math.floor(Number(runtime) / (24 * 60));
        const runtimeText = `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute} ${days}days`;
        setRuntimeText(runtimeText);
    }, [runtime]);

    return (
        <div>
            <h2>{server}</h2>

            <svg ref={boxGraph}></svg>
            <h3 style={{textAlign: "right"}}>{runtimeText}</h3>
        </div>
    );
}

export default DashboardMainBox;