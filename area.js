const svg = d3.select("#area-plot");
svg.style("background-color", "#00000000");
const width = window.innerWidth * 0.8;
const height = window.innerHeight * 0.8;
svg.attr("width", width).attr("height", height);
url = "http://localhost:8000/csv/weather";

areaChart = (data) => {
  // Settings
  const xValue = (d) => d.time;
  const yValue = (d) => d.AirTemperature;
  const xTitle = "Date";
  const yTitle = "Air Temperature (C)";
  const plotTitle = "Temperature";
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
  yAxis = d3.axisLeft(yScale).ticks(6).tickPadding(10);
  yAxisG = g.append("g").call(yAxis); // Add axis
  yAxisG
    .append("text")
    .attr("transform", `rotate(-90)`)
    .attr("y", "-3rem")
    .attr("x", -innerHeight / 2)
    .attr("class", "axis-title")
    .attr("fill", "black")
    .text(yTitle);

  // x-Axis
  const xAxis = d3.axisBottom(xScale).ticks(6).tickPadding(10);
  const xAxisG = g
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${innerHeight})`);
  xAxisG
    .append("text")
    .attr("y", "3.5rem")
    .attr("class", "axis-title")
    .attr("x", innerWidth / 2)
    .attr("fill", "black")
    .text(xTitle);

  // Create line
  areaGenerator = d3
    .area()
    .x((d) => xScale(xValue(d)))
    .y1((d) => yScale(yValue(d)))
    .y0(innerHeight)
    .curve(d3.curveBasis);
  g.append("path").attr("d", areaGenerator(data)).attr("class", "plot-line");

  // Add Title
  g.append("text")
    .attr("y", "-1rem")
    .attr("font-size", "2rem")
    .attr("x", innerWidth / 2)
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
    areaChart(data.slice(0, 12 * 14));
  });
