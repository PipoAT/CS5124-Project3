// Load character dialogue data (assuming format: {character, season, episode, words})
d3.csv('data/sample_transcripts.csv').then(data => {
  const seasonSelect = d3.select('#seasonSelect');
  const chartDiv = d3.select('#chart');

  data.forEach(d => {
    d.season = +d.season;
    d.episode = +d.episode;
    d.words = +d.words;
  });

  const seasons = Array.from(new Set(data.map(d => d.season))).sort((a, b) => a - b);
  seasons.forEach(season => {
    seasonSelect.append('option').attr('value', season).text(`Season ${season}`);
  });

  seasonSelect.on('change', () => {
    drawChart(seasonSelect.property('value'));
  });

  function drawChart(selectedSeason) {
    const filtered = selectedSeason === 'all' ? data : data.filter(d => d.season === +selectedSeason);

    // Aggregate by character
    const grouped = d3.rollups(
      filtered,
      v => ({
        totalWords: d3.sum(v, d => d.words),
        episodeCount: new Set(v.map(d => `${d.season}-${d.episode}`)).size
      }),
      d => d.character
    );

    const sorted = grouped.sort((a, b) => b[1].totalWords - a[1].totalWords);

    chartDiv.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 200 };
    const width = 1000 - margin.left - margin.right;
    const height = sorted.length * 30;

    const svg = chartDiv.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(sorted, d => d[1].totalWords)])
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(sorted.map(d => d[0]))
      .range([0, height])
      .padding(0.1);

    svg.append('g')
      .call(d3.axisLeft(y));

    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5));

    svg.selectAll('.bar')
      .data(sorted)
      .enter().append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => y(d[0]))
      .attr('width', d => x(d[1].totalWords))
      .attr('height', y.bandwidth());

    svg.selectAll('.label')
      .data(sorted)
      .enter().append('text')
      .attr('x', d => x(d[1].totalWords) + 5)
      .attr('y', d => y(d[0]) + y.bandwidth() / 2 + 4)
      .text(d => `${d[1].totalWords} words, ${d[1].episodeCount} episodes`)
      .style('font-size', '12px');
  }

  drawChart('all');
});