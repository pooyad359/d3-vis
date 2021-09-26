const svg = d3.select("#scatter-plot");
svg.style("background-color", "#00000000");
const width = +svg.attr("width");
const height = +svg.attr("height");
url = "http://localhost:8000/csv/auto-mpg";

barChart = (data) => {
  // Settings
  xValue = (d) => d.mpg;
  yValue = (d) => d.horsepower;
  xTitle = "MPG";
  yTitle = "Horsepower";
  plotTitle = "Horsepower vs MPG";

  const margin = { top: 40, botom: 60, left: 100, right: 20 };
  innerWidth = width - margin.left - margin.right;
  innerHeight = height - margin.top - margin.botom;

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, yValue))
    .range([0, innerHeight]);

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

  g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cy", (d) => yScale(yValue(d)))
    .attr("cx", (d) => xScale(xValue(d)))
    .attr("r", 3)
    .attr("class", "scatter-points");

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
      row.mpg = +row.mpg;
      row.cylinders = +row.cylinders;
      row.displacement = +row.displacement;
      row.horsepower = +row.horsepower;
      row.weight = +row.weight;
      row.acceleration = +row.acceleration;
      row.model_year = +row.model_year;
      row.origin = +row.origin;
    });
    barChart(data);
  });
