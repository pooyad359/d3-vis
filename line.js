const svg = d3.select("#line-plot");
svg.style("background-color", "#00000000");
const width = +svg.attr("width");
const height = +svg.attr("height");
url = "http://localhost:8000/csv/weather";

barChart = (data) => {
  // Settings
  const xValue = (d) => d.time;
  const yValue = (d) => d.AirTemperature;
  const xTitle = "Date";
  const yTitle = "Air Temperature (C)";
  const plotTitle = "Temperature";
  const markerSize = 2;
  const margin = { top: 40, botom: 60, left: 100, right: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.botom;

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([innerHeight, 0])
    .nice();

  // Render
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // y-Axis
  yAxis = d3.axisLeft(yScale).tickPadding(10);
  yAxisG = g.append("g").call(yAxis); // Add axis
  yAxisG
    .append("text")
    .attr("transform", `rotate(-90)`)
    .attr("y", "-3rem")
    .attr("x", "-15%")
    .attr("class", "axis-title")
    .attr("fill", "black")
    .text(yTitle);

  // x-Axis

  const xAxis = d3.axisBottom(xScale).tickPadding(10);
  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);
  xAxisG
    .append("text")
    .attr("y", "3rem")
    .attr("class", "axis-title")
    .attr("x", "40%")
    .attr("fill", "black")
    .text(xTitle);

  // Create line
  lineGenerator = d3
    .line()
    .x((d) => xScale(xValue(d)))
    .y((d) => yScale(yValue(d)))
    .curve(d3.curveBasis);
  g.append("path").attr("d", lineGenerator(data)).attr("class", "plot-line");

  // Create markers
  // g.selectAll("circle")
  //   .data(data)
  //   .enter()
  //   .append("circle")
  //   .attr("cy", (d) => yScale(yValue(d)))
  //   .attr("cx", (d) => xScale(xValue(d)))
  //   .attr("r", markerSize)
  //   .attr("class", "scatter-points");

  // Add Title
  g.append("text")
    .attr("y", "-1rem")
    .attr("font-size", "2rem")
    .attr("x", "25%")
    .text(plotTitle);
};

fetch(url)
  .then((resp) => resp.json())
  .then((data) => {
    data.forEach((row) => {
      row.time = new Date(row.time);
      row.AtmosphericPressure = +row.AtmosphericPressure || 0;
      row.WindDirection = +row.WindDirection || 0;
      row.WindSpeed = +row.WindSpeed || 0;
      row.Gust = +row.Gust || 0;
      row.AirTemperature = +row.AirTemperature || 0;
      row.SeaTemperature = +row.SeaTemperature || 0;
    });
    data.map((row) => {
      console.log(row.time);
    });
    barChart(data.slice(0, 12 * 7));
  });
