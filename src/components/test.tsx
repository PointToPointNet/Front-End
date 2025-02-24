const drawGraph = (
  svgRef: React.RefObject<SVGSVGElement>, 
  data: CpuData[]
) => {
  if (!svgRef.current || data.length === 0) return;

  const width = 530;
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
    .padding(0.2); // Add padding between bars

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value) || 100]) 
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

  // X-axis
  graphGroup.select(".x-axis").remove();
  graphGroup
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(
      d3.axisBottom(xScale).tickFormat((d, i) => data[+d]?.date)
    )
    .style("stroke", "#aaa");

  // Y-axis
  graphGroup.select(".y-axis").remove();
  graphGroup.append("g").attr("class", "y-axis").call(d3.axisLeft(yScale).ticks(10)).style("stroke", "#aaa");

  // Grid lines
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

  // Bar chart
  const bars = graphGroup.selectAll(".bar").data(data);
  
  bars
    .enter()
    .append("rect")
    .attr("class", "bar")
    .merge(bars)
    .transition()
    .duration(500)
    .attr("x", (_, i) => xScale(i.toString()) || 0)
    .attr("y", (d) => yScale(d.value))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => innerHeight - yScale(d.value))
    .attr("fill", colorValue + "90"); // Bar color

  bars.exit().remove();

  // Line generator for the line graph
  const lineGenerator = d3
    .line<CpuData>()
    .x((_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2) // Align line with bar centers
    .y((d) => yScale(d.value))
    .curve(d3.curveMonotoneX);

  // Line path for the line graph
  const linePath = graphGroup.selectAll(".line-path").data([data]);
  
  linePath
    .enter()
    .append("path")
    .attr("class", "line-path")
    .merge(linePath)
    .transition()
    .duration(500)
    .attr("fill", "none")
    .attr("stroke", colorValue + "90")
    .attr("stroke-width", 2)
    .attr("d", lineGenerator);

  linePath.exit().remove();

  // Data points for the line graph
  const points = graphGroup.selectAll(".data-point").data(data);
  
  points
    .enter()
    .append("circle")
    .attr("class", "data-point")
    .merge(points)
    .transition()
    .duration(500)
    .attr("cx", (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
    .attr("cy", (d) => yScale(d.value))
    .attr("r", 4)
    .attr("fill", colorValue);

  points.exit().remove();
};
