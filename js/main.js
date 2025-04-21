const margin = {top: 20, right: 30, bottom: 50, left: 60},
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

const svg = d3.select("#barChart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const stopWords = new Set(["the", "and", "you", "that", "was", "for", "with", "have", "this", "but", "are", "not", "from", "they", "she", "his", "her", "it's", "we", "your"]);

d3.csv("transcripts.csv").then(data => {
  const seasonSelect = d3.select("#season");
  const charSelect = d3.select("#character");
  const seasons = Array.from(new Set(data.map(d => d.Season))).sort((a, b) => +a - +b);
  const characters = Array.from(new Set(data.map(d => d.Character))).sort();

  seasonSelect.selectAll("option")
    .data(["All"].concat(seasons))
    .enter().append("option")
    .text(d => `Season ${d}`);

  charSelect.selectAll("option")
    .data(characters)
    .enter().append("option")
    .text(d => d);

  function updateVisualization(selectedSeason) {
    const filtered = selectedSeason === "All" ? data : data.filter(d => d.Season === selectedSeason);

    const grouped = d3.rollups(filtered,
      v => ({
        totalWords: d3.sum(v, d => d.Words.split(" ").length),
        episodes: new Set(v.map(d => d.Episode)).size
      }),
      d => d.Character
    );

    const top = grouped.sort((a, b) => b[1].totalWords - a[1].totalWords).slice(0, 10);

    const x = d3.scaleBand()
      .domain(top.map(d => d[0]))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(top, d => d[1].totalWords)]).nice()
      .range([height, 0]);

    svg.selectAll(".bar").remove();
    svg.selectAll(".axis").remove();

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.selectAll(".bar")
      .data(top)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d[0]))
      .attr("y", d => y(d[1].totalWords))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d[1].totalWords));
  }

  function drawWordCloud(selectedCharacter, selectedSeason) {
    const filtered = selectedSeason === "All" ? data : data.filter(d => d.Season === selectedSeason);
    const charLines = filtered.filter(d => d.Character === selectedCharacter);
    const wordCounts = {};

    charLines.forEach(d => {
      const words = d.Words.toLowerCase().replace(/[.,!?']/g, '').split(/\s+/);
      words.forEach(w => {
        if (!stopWords.has(w) && w.length > 2) {
          wordCounts[w] = (wordCounts[w] || 0) + 1;
        }
      });
    });

    const wordsArray = Object.entries(wordCounts).map(([text, size]) => ({text, size})).slice(0, 100);

    d3.select("#wordCloud").selectAll("svg").remove();

    const wcWidth = 800, wcHeight = 400;
    const layout = d3.layout.cloud()
      .size([wcWidth, wcHeight])
      .words(wordsArray)
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font("Impact")
      .fontSize(d => Math.sqrt(d.size) * 8)
      .on("end", draw);

    layout.start();

    function draw(words) {
      d3.select("#wordCloud")
        .append("svg")
        .attr("width", wcWidth)
        .attr("height", wcHeight)
        .append("g")
        .attr("transform", `translate(${wcWidth / 2},${wcHeight / 2})`)
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .attr("class", "word")
        .style("font-size", d => `${d.size}px`)
        .style("fill", () => d3.schemeCategory10[Math.floor(Math.random() * 10)])
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
        .text(d => d.text);
    }
  }

  seasonSelect.on("change", function () {
    const s = this.value.replace("Season ", "");
    updateVisualization(s);
    drawWordCloud(charSelect.node().value, s);
  });

  charSelect.on("change", function () {
    const s = seasonSelect.node().value.replace("Season ", "");
    drawWordCloud(this.value, s);
  });

  updateVisualization("All");
  drawWordCloud(characters[0], "All");
});