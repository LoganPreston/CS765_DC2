//file options
//  browser data: "https://raw.githubusercontent.com/LoganPreston/data/main/browser-ww-monthly-201910-202110.csv"
//  OS data: https://raw.githubusercontent.com/LoganPreston/data/main/os_combined-ww-monthly-201910-202110.csv
//  Search engine data: https://raw.githubusercontent.com/LoganPreston/data/main/search_engine-ww-monthly-201910-202110.csv
let filePath =
  "https://raw.githubusercontent.com/LoganPreston/data/main/browser-ww-monthly-201910-202110.csv";

function runGenSmallGraph() {
  //sanity, remove any graph that exists currently.
  d3.select("#graph svg").remove();

  // set the dimensions and margins of the graph
  let margin = { top: 10, right: 250, bottom: 50, left: 250 },
    width = 128,
    height = 128;

  //hover for later
  let hover = d3
    .select("#graph")
    .append("div")
    .attr("class", "hover")
    .style("opacity", 0);

  // append the svg object to the body of the page
  let svg = setupSVG(margin, width, height);

  // Parse the Data and plot
  d3.csv(filePath).then(function (data) {
    //need to aggregate small % into Other, color encoding and stacking uses this later. Header info
    let subgroups = aggregateGroups(data, 5);

    // X axis groups
    let groups = getGroups(data);

    //Large should allow any and all groupings, smaller will restrict to 6 total.
    let color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"]);

    // Add X axis
    let x = d3.scaleBand().domain(groups).range([0, width]).padding([-0.2]);
    let xDom = x.domain();
    let xLabels = [
      xDom[0],
      xDom[Math.floor(xDom.length / 2)],
      xDom[xDom.length - 1],
    ];

    // Add Y axis - lock to 0-100, assume 100% for data set.
    let y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    let yLabels = d3.range(0, 101, 100 / 2);

    labelAxes(svg, height, x, xLabels, y, yLabels);

    //stack by major contributors, rather than all of them
    let stackedData = d3.stack().keys(subgroups)(data);

    // draw bars
    let firstColHeader = Object.keys(data[0])[0];
    drawBars(svg, stackedData, firstColHeader, color, x, y);

    //add hover effects for interaction
    svg
      .selectAll("rect")
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration("50").attr("opacity", ".75");
        //show the hover
        hover.transition().duration(50).style("opacity", 1);
        let val = Math.round((d[1] - d[0]) * 100) / 100;
        let browser = getKeyByValue(d.data, val);
        hover
          .html(browser + ": " + val)
          .style("left", event.screenX - 25 + "px")
          .style("top", event.screenY - 75 + "px");
      })
      .on("mouseout", function (d, i) {
        d3.select(this).transition().duration("50").attr("opacity", "1");
        //Makes the new div appear on hover:
        hover.transition().duration(50).style("opacity", 0);
      });
  });
}

function runGenMedGraph() {
  //sanity, remove any graph that exists currently.
  d3.select("#graph svg").remove();
  // set the dimensions and margins of the graph
  let margin = { top: 10, right: 250, bottom: 50, left: 250 },
    width = 256,
    height = 256;

  // append the svg object to the body of the page
  let svg = setupSVG(margin, width, height);

  // Parse the Data
  d3.csv(filePath).then(function (data) {
    //need to aggregate small % into Other, color encoding and stacking uses this later. Header info
    let subgroups = aggregateGroups(data);

    // X axis groups
    let groups = getGroups(data);

    //Large should allow any and all groupings, smaller will restrict to 6 total.
    let color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"]);

    // Add X axis
    let x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
    let xLabels = x.domain().filter((element, index) => {
      return index % 4 === 0;
    });

    // Add Y axis - lock to 0-100, assume 100% for data set. TODO update range to be dynamic.
    let y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    let yLabels = d3.range(0, 101, 100 / 5);

    //add axes to graph, then adjust for this size graph
    labelAxes(svg, height, x, xLabels, y, yLabels);
    svg.selectAll("text").style("font-size", "12px");
    svg
      .selectAll("#xAxis text")
      .style("text-anchor", "end")
      .attr("dx", "-.75em")
      .attr("dy", ".07em")
      .attr("transform", "rotate(-45)");

    //stack by major contributors, rather than all of them
    let stackedData = d3.stack().keys(subgroups)(data);

    // draw bars
    let firstColHeader = Object.keys(data[0])[0];
    drawBars(svg, stackedData, firstColHeader, color, x, y);
    //pull the legend in
    addLegend(svg, width, color, subgroups);
  });
}

function runGenLargeGraph() {
  //sanity, remove any graph that exists currently.
  d3.select("#graph svg").remove();
  // set the dimensions and margins of the graph
  let margin = { top: 10, right: 250, bottom: 100, left: 250 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  let svg = setupSVG(margin, width, height);
  // Parse the Data. Gets fresh copy of data each time to avoid updates from other two fns.
  d3.csv(filePath).then(function (data) {
    // Color encoding uses this later, header row.
    let subgroups = data.columns.slice(1);

    // X axis groups
    let groups = getGroups(data);

    // specify x axis and label
    let x = d3.scaleBand().domain(groups).range([0, width]).padding([0.4]);
    let xLabels = x.domain().filter((element, index) => {
      return index % 2 === 0;
    });

    // specify y axis and label. lock to 0-100, assume 100% for data set.
    let y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    let yLabels = d3.range(0, 101, 100 / 10);

    //add axes to graph, then adjust for this size graph
    labelAxes(svg, height, x, xLabels, y, yLabels);
    svg.selectAll("text").style("font-size", "12px");
    svg
      .selectAll("#xAxis text")
      .style("text-anchor", "end")
      .attr("dx", "-.75em")
      .attr("dy", ".07em")
      .attr("transform", "rotate(-45)");

    //Large should allow any and all groupings, smaller will restrict to 6 total.
    let color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range([
        "#a6cee3",
        "#1f78b4",
        "#b2df8a",
        "#33a02c",
        "#fb9a99",
        "#e31a1c",
        "#fdbf6f",
        "#ff7f00",
        "#cab2d6",
        "#6a3d9a",
        "#ffff99",
        "#b15928",
      ]);

    //stack by subgroup
    let stackedData = d3.stack().keys(subgroups)(data);

    // draw bars
    let firstColHeader = Object.keys(data[0])[0];
    drawBars(svg, stackedData, firstColHeader, color, x, y);

    //Add legend - note we pass subgroups, which is everything
    addLegend(svg, width, color, subgroups);
  });
}

//get the key from the value, opposite way as normal
function getKeyByValue(object, value) {
  value = String(value);
  return Object.keys(object).find((key) => object[key] === value);
}

//identify the groups in data, first column data
function getGroups(data) {
  let firstColHeader = Object.keys(data[0])[0];
  let groups = d3.map(data, function (d) {
    return d[firstColHeader];
  });
  return groups;
}

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

//aggregation of the groups, mutates the passed object
function aggregateGroups(data, maxColors) {
  let largeGroups = new Set();
  const thresh = 5;
  for (let i = 0; i < data.length; i++) {
    obj = data[i];
    obj["Other"] = Number(obj["Other"]);

    //skip first row and last row
    keys = Object.keys(obj);
    for (let j = 1; j < keys.length - 1; j++) {
      let keyVal = keys[j];
      let contribution = Number(obj[keyVal]);
      //group it if Other is small and this is a small contributor, or if it's a very small contributor
      //TODO evaluate if contribution < obj["Other"] makes sense
      if (
        (contribution < thresh && obj["Other"] < thresh) ||
        contribution < thresh / 2
      ) {
        obj["Other"] += contribution;
        obj[keyVal] = 0;
      }
      //if it's big enough, add this group to the returned set.
      else {
        largeGroups.add(keyVal);
      }
    }

    obj["Other"] = String(Math.round(obj["Other"] * 100) / 100);
  }
  if (Number(obj["Other"]) > 0) largeGroups.add("Other");
  return largeGroups;
}

//draw bars in the SVG using the given data and axes
function drawBars(svg, stackedData, firstColHeader, color, x, y) {
  svg
    .append("g")
    .selectAll("g")
    // Enter in the stack data, iterate over groupings (i.e X axis)
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", function (d) {
      if (d.key === "Other") return "#444444";
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

function labelAxes(svg, height, x, xLabels, y, yLabels) {
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
    .selectAll("mydots")
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
      if (d === "Other") return "#444444";
      return color(d);
    });

  // names for the squares
  svg
    .selectAll("mylabels")
    .data(bigGroups)
    .enter()
    .append("text")
    .attr("x", width + legendSize * 4)
    .attr("y", function (d, i) {
      return startPos + i * padding + legendSize / 2;
    })
    .style("fill", function (d) {
      if (d === "Other") return "#444444";
      return color(d);
    })
    .text((d) => {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}
