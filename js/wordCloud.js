class renderCharacterWordCloud {
    constructor(selector, words, options = {}) {
        this.selector = selector;
        this.words = words;
        this.options = {
            width: options.width || 500,
            height: options.height || 500,
            fontSizeRange: options.fontSizeRange || [10, 50],
            fontFamily: options.fontFamily || "sans-serif",
            colors: options.colors || d3.schemeCategory10,
            ...options,
        };
        this.init();
    };

    init() {
        this.svg = d3
            .select(this.selector)
            .append("svg")
            .attr("width", this.options.width)
            .attr("height", this.options.height);

        this.render();
    }

    render() {
        const layout = cloud()
            .size([this.options.width, this.options.height])
            .words(
                this.words.map((word) => ({
                    text: word.text,
                    size: word.size,
                }))
            )
            .padding(5)
            .rotate(() => (Math.random() > 0.5 ? 0 : 90))
            .font(this.options.fontFamily)
            .fontSize((d) => d.size)
            .on("end", (words) => this.draw(words));

        layout.start();
    }

    draw(words) {
        const color = d3.scaleOrdinal(this.options.colors);

        this.svg
            .append("g")
            .attr(
                "transform",
                `translate(${this.options.width / 2}, ${this.options.height / 2})`
            )
            .selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .style("font-family", this.options.fontFamily)
            .style("font-size", (d) => `${d.size}px`)
            .style("fill", (d, i) => color(i))
            .style("fill", (d, i) => color(i)) // 'd' is used in the next line, so no changes needed
            .attr("transform", (d) => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
            .text((d) => d.text);
    }
}