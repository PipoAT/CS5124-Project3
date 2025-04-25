export default function renderShowPieChart(data, elementId) {
    // Remove existing SVG if it exists
    d3.select(`#${elementId}`).select("svg").remove();

    // Set dimensions and radius
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Create an SVG container
    const svg = d3.select(`#${elementId}`)
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
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

    // Create a tooltip
    const tooltip = d3.select(`#${elementId}`)
        .append("div")
        .style("position", "absolute")
        .style("background", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("box-shadow", "0px 2px 5px rgba(0, 0, 0, 0.3)")
        .style("opacity", 0)
        .style("transition", "opacity 0.3s ease");

    // Bind data and create pie chart
    const arcs = svg.selectAll("arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label))
        .on("mouseover", function (event, d) {
            d3.select(this)
                .attr("fill", d3.rgb(color(d.data.label)).darker(1)); // Darken the color on hover
            tooltip.style("opacity", 1)
                .html(`Label: ${d.data.label}<br>Value: ${d.data.value}`)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY + 10}px`);
        })
        .on("mousemove", (event) => {
            tooltip.style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY + 10}px`);
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .attr("fill", color(d.data.label)); // Reset to original color
            tooltip.style("opacity", 0);
        });

    // Add labels
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .attr("pointer-events", "none") // Make text non-selectable
        .style("z-index", 1) // Adjust the z-index
        .text(d => d.data.value >= 100 ? d.data.label : ""); // Show label only if value is greater than or equal to 100
}