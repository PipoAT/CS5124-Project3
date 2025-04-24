export default function renderShowArcDiagram(container, data) {
    const width = 800;
    const height = 400;

    d3.select(container).select("svg").remove(); // Remove existing SVG if it exists

    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const nodes = data.nodes;
    const links = data.links;

    const xScale = d3.scalePoint()
        .domain(nodes.map(d => d.id))
        .range([50, width - 50]);

    // Draw links (arcs)
    svg.selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("d", d => {
            const startX = xScale(d.source);
            const endX = xScale(d.target);
            const midY = height / 2;
            const radius = Math.abs(endX - startX) / 2;
            return `M${startX},${midY} A${radius},${radius} 0 0,1 ${endX},${midY}`;
        })
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5);

    // Draw nodes
    svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.id))
        .attr("cy", height / 2)
        .attr("r", 5)
        .attr("fill", "orange");

    // Add labels
    svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.id))
        .attr("y", height / 2 + 20)
        .attr("text-anchor", "middle")
        .text(d => d.label)
        .attr("font-size", "10px")
        .attr("fill", "black");
}