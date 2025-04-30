// visualizations/arcDiagram.js
import showData from "../data_structures/showInteractions.js";

export default function renderShowArcDiagram(container) {
  const { nodes, links } = showData;
  const width = 800, height = 400;

  // —————————————————————————
  // 1) Compute total interaction weight per character
  const weightById = {};
  links.forEach(l => {
    weightById[l.source] = (weightById[l.source] || 0) + l.value;
    weightById[l.target] = (weightById[l.target] || 0) + l.value;
  });

  // 2) Pick top 12 characters by weight
  const topIds = Object.entries(weightById)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(d => d[0]);

  // 3) Filter nodes & links down to those top IDs
  const filteredNodes = nodes.filter(n => topIds.includes(n.id));
  const filteredLinks = links.filter(
    l => topIds.includes(l.source) && topIds.includes(l.target)
  );

  // clear previous drawing
  d3.select(container).select("svg").remove();
  d3.select(container).select("div.tooltip").remove();

  // create SVG
  const svg = d3.select(container)
    .append("svg")
      .attr("width", width)
      .attr("height", height);

  // x scale uses filteredNodes
  const xScale = d3.scalePoint()
    .domain(filteredNodes.map(d => d.id))
    .range([50, width - 50]);

  // draw arcs based on filteredLinks
  svg.selectAll("path.link")
    .data(filteredLinks)
    .enter()
    .append("path")
      .attr("class", "link")
      .attr("d", d => {
        const x1 = xScale(d.source), x2 = xScale(d.target), y = height / 2;
        const r = Math.abs(x2 - x1) / 2;
        return `M${x1},${y} A${r},${r} 0 0,1 ${x2},${y}`;
      })
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", d => 1 + d.value / 20);

  // tooltip div
  const tooltip = d3.select(container)
    .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .style("opacity", 0);

  // draw nodes for filteredNodes
  svg.selectAll("circle.node")
    .data(filteredNodes)
    .enter()
    .append("circle")
      .attr("class", "node")
      .attr("cx", d => xScale(d.id))
      .attr("cy", height / 2)
      .attr("r", 5)
      .attr("fill", "orange")
    .on("mouseover", (e, d) => {
      d3.select(e.currentTarget).attr("fill", "red");
      tooltip
        .style("opacity", 1)
        .html(`<strong>${d.label}</strong>`)
        .style("left", `${e.pageX + 10}px`)
        .style("top", `${e.pageY + 10}px`);
    })
    .on("mousemove", e => {
      tooltip
        .style("left", `${e.pageX + 10}px`)
        .style("top", `${e.pageY + 10}px`);
    })
    .on("mouseout", e => {
      d3.select(e.currentTarget).attr("fill", "orange");
      tooltip.style("opacity", 0);
    });

  // stagger labels under nodes
  svg.selectAll("text.label")
    .data(filteredNodes)
    .enter()
    .append("text")
      .attr("class", "label")
      .attr("x", d => xScale(d.id))
      .attr("y", (d, i) => height / 2 + (i % 2 === 0 ? 20 : 35))
      .attr("text-anchor", "middle")
      .text(d => d.label)
      .attr("font-size", "10px")
      .attr("fill", "black");
}
