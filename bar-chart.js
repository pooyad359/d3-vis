const svg = d3.select("#population-bar-chart");
svg.style("background-color", "#cccccc");
const width = +svg.attr("width");
const height = +svg.attr("height");
url = "http://localhost:8000/csv/pop";

barChart = (data) => {
  const margin = { top: 20, botom: 20, left: 100, right: 20 };
  innerWidth = width - margin.left - margin.right;
  innerHeight = height - margin.top - margin.botom;
  xValue = (d) => d.Country;
  yValue = (d) => d.Population;
  console.log(d3.max(data, yValue));
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, yValue) * 1.1])
    .range([0, innerWidth]);

  const yScale = d3
    .scaleBand()
    .domain(data.map(xValue))
    .range([0, innerHeight])
    .padding(0.1);

  // Render
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // y-Axis
  g.append("g")
    .call(d3.axisLeft(yScale)) // Add axis
    .selectAll(".domain, .tick line")
    .remove(); // remove ticks

  // x-Axis
  const xAxisTickFormat = (number) =>
    d3.format(".2s")(number).replace("G", "B");
  const xAxis = d3.axisBottom(xScale).tickFormat(xAxisTickFormat);
  g.append("g").call(xAxis).attr("transform", `translate(0,${innerHeight})`);

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (d) => yScale(xValue(d)))
    .attr("width", (d) => xScale(yValue(d)))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");
};

fetch(url)
  .then((resp) => resp.json())
  .then((data) => {
    data.forEach((row) => {
      row.Population = +row.Population;
    });
    barChart(data);
  });
