function renderCharacterLineChart(data, elementId) {
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear any existing content
    d3.select(elementId).selectAll("*").remove();

    const svg = d3.select(elementId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scalePoint()
        .domain(data.map(d => d.label))
        .range([0, width])
        .padding(0.5);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);

    const line = d3.line()
        .x(d => x(d.label))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX); // smooth line

    // X Axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Line path
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Circles on data points with tooltips
    const tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("background", "rgba(0,0,0,0.75)")
        .style("color", "#fff")
        .style("padding", "6px 8px")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.label))
        .attr("cy", d => y(d.value))
        .attr("r", 4)
        .attr("fill", "orange")
        .on("mouseover", function(event, d) {
            this.setAttribute("fill", "green");
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`<strong>${d.label}</strong><br/>Lines: ${d.value}`);
        })
        .on("mousemove", function(event) {
            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            this.setAttribute("fill", "orange");
            tooltip.transition().duration(200).style("opacity", 0);
        });
}

export default renderCharacterLineChart;