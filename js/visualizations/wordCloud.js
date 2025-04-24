
function renderCharacterWordCloud(selector, words, options = {}) {
    const defaultOptions = {
        width: 500,
        height: 500,
        fontSizeRange: [10, 50],
        fontFamily: "sans-serif",
        colors: d3.schemeCategory10,
        ...options,
    };

    d3.select(`${selector}`).select("svg").remove();

    const svg = d3
        .select(selector)
        .append("svg")
        .attr("width", defaultOptions.width)
        .attr("height", defaultOptions.height)

    const layout = d3.layout.cloud()
        .size([defaultOptions.width, defaultOptions.height])
        .words(
            words.map((word) => ({
                text: word.text,
                size: word.size,
            }))
        )
        .padding(5)
        .rotate(() => (Math.random() > 0.5 ? 0 : 90))
        .font(defaultOptions.fontFamily)
        .fontSize((d) => d.size)
        .on("end", draw);

    layout.start();

    function draw(words) {
        const color = d3.scaleOrdinal(defaultOptions.colors);
        svg.append("g")
            .attr(
                "transform",
                `translate(${defaultOptions.width / 2}, ${defaultOptions.height / 2})`
            )
            .selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .style("font-family", defaultOptions.fontFamily)
            .style("font-size", (d) => `${d.size}px`)
            .style("fill", (d) => color(d.text))
            .attr("transform", (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
            .text((d) => d.text);
    }
}

export default renderCharacterWordCloud;