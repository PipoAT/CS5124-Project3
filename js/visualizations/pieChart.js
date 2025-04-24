export default function renderShowPieChart(data, elementId) {
    // Set dimensions and radius
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Create an SVG container
    const svg = d3.select(`#${elementId}`)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create a color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create a pie generator
    const pie = d3.pie()
        .value(d => d.value);

    // Create an arc generator
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    // Bind data and create pie chart
    const arcs = svg.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label));

    // Add labels
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .text(d => d.data.label);
}