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
  let margin = { top: 50, right: 250, bottom: 50, left: 250 },
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

    //Large should allow any and all groupings, smaller will restrict to 6 total.
    let color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range([
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#444444",
      ]);

    // X axis groups
    let groups = getGroups(data);

    // X and Y axis setup, then add to plot
    let x = d3.scaleBand().domain(groups).range([0, width]).padding([-0.2]);
    let xDom = x.domain();
    let xLabels = [
      xDom[0],
      xDom[Math.floor(xDom.length / 2)],
      xDom[xDom.length - 1],
    ];
    let y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    let yLabels = d3.range(0, 101, 100 / 2);
    addAxes(svg, height, x, xLabels, y, yLabels);

    // draw bars. stack by major contributors
    let firstColHeader = Object.keys(data[0])[0];
    let stackedData = d3.stack().keys(subgroups)(data);
    addBars(svg, stackedData, firstColHeader, color, x, y);

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
  let margin = { top: 50, right: 250, bottom: 50, left: 250 },
    width = 256,
    height = 256;

  // append the svg object to the body of the page
  let svg = setupSVG(margin, width, height);

  // Parse the Data
  d3.csv(filePath).then(function (data) {
    //need to aggregate small % into Other, color encoding and stacking uses this later. Header info
    let subgroups = aggregateGroups(data, 3);

    //Large should allow any and all groupings, smaller will restrict to 6 total.
    let color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range([
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#a65628",
        "#f781bf",
        "#999999",
      ]);

    // X axis groups
    let groups = getGroups(data);

    // X and Y axis setup
    let x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
    let xLabels = x.domain().filter((element, index) => {
      return index % 4 === 0;
    });
    let y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    let yLabels = d3.range(0, 101, 100 / 5);

    //add axes and style them
    addAxes(svg, height, x, xLabels, y, yLabels);
    svg.selectAll("text").style("font-size", "12px");
    svg
      .selectAll("#xAxis text")
      .style("text-anchor", "end")
      .attr("dx", "-.75em")
      .attr("dy", ".07em")
      .attr("transform", "rotate(-45)");

    // draw bars. Stack by major contributors
    let firstColHeader = Object.keys(data[0])[0];
    let stackedData = d3.stack().keys(subgroups)(data);
    addBars(svg, stackedData, firstColHeader, color, x, y);

    //pull the legend in
    addLegend(svg, width, color, subgroups);
  });
}

function runGenLargeGraph() {
  //sanity, remove any graph that exists currently.
  d3.select("#graph svg").remove();

  // set the dimensions and margins of the graph
  let margin = { top: 50, right: 250, bottom: 100, left: 250 },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  let svg = setupSVG(margin, width, height);

  // Parse the Data. Gets fresh copy of data each time to avoid updates from other two fns.
  d3.csv(filePath).then(function (data) {
    // Color encoding uses this later, header row.
    let subgroups = aggregateGroups(data, 1);

    //Large should allow any and all groupings, though colors are still limited to 12
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
        "#b15928",
        "#999999",
      ]);

    // X axis groups
    let groups = getGroups(data);

    // specify x axis and y axis
    let x = d3.scaleBand().domain(groups).range([0, width]).padding([0.4]);
    let xLabels = x.domain().filter((element, index) => {
      return index % 2 === 0;
    });
    let y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    let yLabels = d3.range(0, 101, 100 / 10);

    //add axes to graph, then adjust for this size graph
    addAxes(svg, height, x, xLabels, y, yLabels);
    svg.selectAll("text").style("font-size", "12px");
    svg
      .selectAll("#xAxis text")
      .style("text-anchor", "end")
      .attr("dx", "-.75em")
      .attr("dy", ".07em")
      .attr("transform", "rotate(-45)");

    // draw bars. Stack, should keep most of them based on aggregation code
    let firstColHeader = Object.keys(data[0])[0];
    let stackedData = d3.stack().keys(subgroups)(data);
    addBars(svg, stackedData, firstColHeader, color, x, y);

    //Add legend - note we pass subgroups, which is everything
    addLegend(svg, width, color, subgroups);
  });
}
