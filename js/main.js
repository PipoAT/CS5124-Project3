// Load character dialogue data (assuming format: {character, season, episode, words})
d3.csv('transcripts.csv').then(data => {
  const seasonSelect = d3.select('#seasonSelect');
  const chartDiv = d3.select('#chart');

  // Get unique seasons and populate dropdown
  const seasons = Array.from(new Set(data.map(d => d.season))).sort();
  seasons.forEach(season => {
    seasonSelect.append('option').attr('value', season).text(`Season ${season}`);
  });

  seasonSelect.on('change', () => {
    drawChart(seasonSelect.property('value'));
  });

  function drawChart(selectedSeason) {
    const filtered = selectedSeason === 'all' ? data : data.filter(d => d.season === selectedSeason);
    const grouped = d3.rollups(filtered, v => d3.sum(v, d => +d.words), d => d.character);
    
    // Sort descending by word count
    const sorted = grouped.sort((a, b) => b[1] - a[1]);
    chartDiv.selectAll('*').remove(); // Clear chart

    const margin = { top: 20, right: 30, bottom: 40, left: 150 };
    const width = 900 - margin.left - margin.right;
    const height = sorted.length * 30;

    const svg = chartDiv.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
      .domain([0, d3.max(sorted, d => d[1])])
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
      .attr('width', d => x(d[1]))
      .attr('height', y.bandwidth());
  }

  drawChart('all'); // initial draw
});
