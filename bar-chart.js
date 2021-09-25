const svg = d3.select("svg");
svg.style("background-color", "#aaaaaa");
const width = +svg.attr("width");
const height = +svg.attr("height");

url =
  "https://datahub.io/JohnSnowLabs/population-figures-by-country/r/population-figures-by-country-csv.csv";

barChart = (data) => {
  const margin = { top: 20, botom: 20, left: 100, right: 20 };
  innerWidth = width - margin.left - margin.right;
  innerHeight = height - margin.top - margin.botom;
  xValue = (d) => d.country;
  yValue = (d) => d.population;
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, yValue)])
    .range([0, innerWidth * 0.9]);
  const yScale = d3
    .scaleBand()
    .domain(data.map(xValue))
    .range([0, innerHeight])
    .padding(0.1);

  //   yAxis = d3.axisLeft(yScale);
  //   xAxis = d3.axisBottom(xScale);
  // Render
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  g.append("g").call(d3.axisLeft(yScale));
  g.append("g")
    .call(d3.axisBottom(xScale))
    .attr("transform", `translate(0,${innerHeight})`);

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("y", (d) => yScale(xValue(d)))
    .attr("width", (d) => xScale(yValue(d)))
    .attr("height", yScale.bandwidth())
    .attr("fill", "steelblue");
};

d3.csv(url).then((data) => {
  data.forEach((row) => {
    row.country = row.Country;
    row.population = +row.Year_2016;
  });
  barChart(data.filter((d) => d.population > 2e8));
});
