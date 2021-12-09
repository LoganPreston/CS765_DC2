//setup and return svg
function setupSVG(margin, width, height) {
  return d3
    .select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

//draw bars in the SVG using the given data and axes
function addBars(svg, stackedData, firstColHeader, color, x, y) {
  svg
    .append("g")
    .selectAll("g")
    // Enter in the stack data, iterate over groupings (i.e X axis)
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", function (d) {
      return color(d.key);
    })
    .selectAll("rect")
    // enter a second time, iterate over subgroupings (i.e. Color encodings, the stack)
    .data(function (d) {
      return d;
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.data[firstColHeader]);
    })
    .attr("y", function (d) {
      return y(d[1]);
    })
    .attr("height", function (d) {
      return y(d[0]) - y(d[1]);
    })
    .attr("width", x.bandwidth());
}

//Label axes on the svg
function addAxes(svg, height, x, xLabels, y, yLabels) {
  //handle y label first, then adjust placement and place x labels
  svg
    .append("g")
    .attr("id", "yAxis")
    .call(d3.axisLeft(y).tickValues(yLabels))
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("id", "xAxis")
    .call(d3.axisBottom(x).tickSizeOuter(0).tickValues(xLabels));
}

function addLegend(svg, width, color, bigGroups) {
  //legend
  // Add one dot in the legend for each name.
  let startPos = 0,
    padding = 25,
    legendSize = 10;

  // squares for each major color
  svg
    .selectAll("dots")
    .data(bigGroups)
    .enter()
    .append("rect")
    .attr("x", width + legendSize * 2)
    .attr("y", function (d, i) {
      return startPos + i * padding;
    })
    .attr("width", legendSize)
    .attr("height", legendSize)
    .style("fill", function (d) {
      return color(d);
    });

  // names for the squares
  svg
    .selectAll("labels")
    .data(bigGroups)
    .enter()
    .append("text")
    .attr("x", width + legendSize * 4)
    .attr("y", function (d, i) {
      return startPos + i * padding + legendSize;
    })
    .style("fill", function (d) {
      return color(d);
    })
    .text((d) => {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}