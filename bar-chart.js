const svg = d3.select("svg");
svg.style("background-color", "#aaaaaa");
const width = +svg.attr("width");
const height = +svg.attr("height");
const radius = Math.min(width, height) / 2.5;
url =
  "https://datahub.io/JohnSnowLabs/population-figures-by-country/r/population-figures-by-country-csv.csv";
const g = svg
  .append("g")
  .attr("transform", `translate(${width / 2},${height / 2})`);

barChart = (data) => {
  xValue = (d) => d.country;
  yValue = (d) => d.population;
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, yValue)])
    .range([0, width * 0.9]);
  const yScale = d3.scaleBand().domain(data.map(xValue)).range([0, height]);
  console.log(data);
  console.log(xScale(1e9));
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (d) => yScale(xValue(d)))
    .attr("width", (d) => xScale(yValue(d)))
    .attr("height", yScale.bandwidth() - 5)
    .attr("fill", "777777");
};

d3.csv(url).then((data) => {
  data.forEach((row) => {
    row.country = row.Country;
    row.population = +row.Year_2016;
  });
  barChart(data.filter((d) => d.population > 1e8));
});
