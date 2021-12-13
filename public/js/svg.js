/**
 * setup and return svg
 * @param {Object} margin - Object of {Left:Number, Right:Number, Top:Number, Bottom:Number}
 * @param {Number} width - Width of the SVG
 * @param {Number} height - Height of the SVG
 * @returns an SVG with height, and width as defined by passed values
 */
function setupSVG(margin, width, height) {
  return d3
    .select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

/**
 * draw bars in the SVG using the given data and axes
 * @param {SVG} svg - svg object to draw in
 * @param {*} stackedData - data in stacked form from d3. data.stacked()
 * @param {String} firstColHeader - Header for the first column of data (xAxis)
 * @param {Object} color - D3 Object with a range of categorical color mappings
 * @param {Domain} x - X domain setup from D3
 * @param {Domain} y - Y domain setup from D3
 */
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

/**
 * Label axes on the svg. Mutates SVG, doesn't return it.
 * @param {SVG} svg - SVG to update
 * @param {Number} height - height of the SVG, used to appropriately update x axis
 * @param {Domain} x - X domain setup from D3
 * @param {Array[String]} xLabels - labels for the xAxis.
 * @param {Domain} y - Y domain setup from D3
 * @param {Array[String]} yLabels - labels for the yAxis. Must pass it.
 */
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

/**
 * Add a legend to a given SVG. Mutates SVG, doesn't return new.
 * @param {SVG} svg - SVG object to update
 * @param {Number} width - width of the SVG. Provides offset for legend
 * @param {Object} color - D3 Object with a range of categorical color mappings
 * @param {Array[String]} bigGroups - array of strings for the main groups in the data
 * @param {Number} padding - padding between the legend values
 * @param {Number} legendSize - size of the squares for the colors in the legend.
 */
function addLegend(svg, width, color, bigGroups, padding, legendSize) {
  //legend
  // Add one dot in the legend for each name.
  const startPos = 0;

  // squares for each major color
  svg
    .selectAll("dots")
    .data(bigGroups)
    .enter()
    .append("rect")
    .attr("x", width + legendSize * 2)
    .attr("y", function (element, index) {
      return startPos + index * padding;
    })
    .attr("width", legendSize)
    .attr("height", legendSize)
    .style("fill", function (element) {
      return color(element);
    });

  // names for the squares
  svg
    .selectAll("labels")
    .data(bigGroups)
    .enter()
    .append("text")
    .attr("x", width + legendSize * 4)
    .attr("y", function (element, index) {
      return startPos + index * padding + legendSize;
    })
    .style("fill", function (element) {
      return color(element);
    })
    .text((element) => {
      return element;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}

/**
 * Setup the a hover div object for interaction.
 * @returns a transparent div within the graph item.
 */
function setupHover() {
  return d3
    .select("#graph")
    .append("div")
    .attr("class", "hover")
    .attr("id", "hover")
    .style("opacity", 0);
}

/**
 * Add functionality to the hover to make it opaque, show the user which bar it represents
 * and the data contained in the bar
 * @param {SVG} svg - SVG to update this hover on
 * @param {Hover} hover - hover object. See setupHover()
 * @param {String} firstColHeader - header for the first column of data, used to populate the hover.
 */
function addHover(svg, hover, firstColHeader) {
  svg
    .selectAll("rect")
    .on("mouseover", function (event, d) {
      //dim the bar
      d3.select(this).transition().duration("50").attr("opacity", ".75");
      //show the hover
      hover.transition().duration(50).style("opacity", "1");
      let val = Math.round((d[1] - d[0]) * 100) / 100;
      let browser = getKeyByValue(d.data, val);
      hover
        .html(browser + ": " + val + "<br>" + d.data[firstColHeader])
        .style("left", event.screenX - 25 + "px")
        .style("top", event.screenY - 75 + "px");
    })
    .on("mouseout", function (d, i) {
      //revert the bar, then disappear the hover
      d3.select(this).transition().duration("50").attr("opacity", "1");
      hover.transition().duration("50").style("opacity", "0");
    });
}
