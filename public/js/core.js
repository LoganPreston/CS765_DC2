//file options
//  browser data: https://raw.githubusercontent.com/LoganPreston/CS765_DC2/main/browser-ww-monthly-201910-202110.csv";
//  OS data: https://raw.githubusercontent.com/LoganPreston/CS765_DC2/main/os_combined-ww-monthly-201910-202110.csv
//  Search engine data: https://raw.githubusercontent.com/LoganPreston/CS765_DC2/main/search_engine-ww-monthly-201910-202110.csv
//const filePath =
//"https://raw.githubusercontent.com/LoganPreston/CS765_DC2/main/browser-ww-monthly-201910-202110.csv";

function runGenTinyGraph(filePath, dimension) {
  //sanity, remove any graph that exists currently.
  d3.select("#graph svg").remove();
  d3.select("#hover").remove();

  // set the dimensions and margins of the graph
  const margin = { top: 50, right: 250, bottom: 100, left: 250 },
    width = dimension !== undefined ? dimension : 96,
    height = dimension !== undefined ? dimension : 96;

  //hover for later
  const hover = setupHover();

  // append the svg object to the body of the page
  const svg = setupSVG(margin, width, height);

  // Parse the Data and plot
  d3.csv(filePath).then(function (data) {
    //need to aggregate small % into Other, color encoding and stacking uses this later. Header info
    const subgroups = aggregateGroups(data, 5);

    //Small limited to 6 colors total
    const color = d3
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
    const groups = getGroups(data);

    // X and Y axis setup, then add to plot

    const x = d3.scaleBand().domain(groups).range([0, width]).padding([-0.2]);
    const xLabels = [
      groups[0],
      groups[Math.floor(groups.length / 2)],
      groups[groups.length - 1],
    ];
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    const yLabels = d3.range(0, 101, 50);
    addAxes(svg, height, x, xLabels, y, yLabels);

    // draw bars. stack by major contributors
    const firstColHeader = Object.keys(data[0])[0];
    const stackedData = d3.stack().keys(subgroups)(data);
    addBars(svg, stackedData, firstColHeader, color, x, y);

    //add hover effects for interaction
    addHover(svg, hover, firstColHeader);
    svg.selectAll("text").style("font-size", "10px");
    svg
      .selectAll("#xAxis text")
      .style("text-anchor", "end")
      .attr("dx", "-.35em")
      .attr("dy", ".35em")
      .attr("transform", "rotate(-22.5)");
  });
}

function runGenSmallGraph(filePath, dimension) {
  //sanity, remove any graph that exists currently.
  d3.select("#graph svg").remove();
  d3.select("#hover").remove();

  // set the dimensions and margins of the graph
  const margin = { top: 50, right: 250, bottom: 100, left: 250 },
    width = dimension !== undefined ? dimension : 170,
    height = dimension !== undefined ? dimension : 170;

  //hover for later
  const hover = setupHover();

  // append the svg object to the body of the page
  const svg = setupSVG(margin, width, height);

  // Parse the Data and plot
  d3.csv(filePath).then(function (data) {
    //need to aggregate small % into Other, color encoding and stacking uses this later. Header info
    const subgroups = aggregateGroups(data, 5);

    //Small limited to 6 colors total
    const color = d3
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
    const groups = getGroups(data);

    // X and Y axis setup, then add to plot
    const x = d3.scaleBand().domain(groups).range([0, width]).padding([-0.2]);
    const xLabels = groups.filter((element, index) => {
      return index % 6 === 0;
    });
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    const yLabels = d3.range(0, 101, 100 / 4);
    addAxes(svg, height, x, xLabels, y, yLabels);

    // draw bars. stack by major contributors
    const firstColHeader = Object.keys(data[0])[0];
    const stackedData = d3.stack().keys(subgroups)(data);
    addBars(svg, stackedData, firstColHeader, color, x, y);

    //add hover effects for interaction
    addHover(svg, hover, firstColHeader);
    addLegend(svg, width, color, subgroups, 15, 5);
    svg.selectAll("text").style("font-size", "10px");
    svg
      .selectAll("#xAxis text")
      .style("text-anchor", "end")
      .attr("dx", "-.35em")
      .attr("dy", ".35em")
      .attr("transform", "rotate(-22.5)");
  });
}

function runGenMedGraph(filePath, dimension) {
  //sanity, remove any graph that exists currently.
  d3.select("#graph svg").remove();
  d3.select("#hover").remove();

  // set the dimensions and margins of the graph
  const margin = { top: 50, right: 250, bottom: 100, left: 250 },
    width = dimension !== undefined ? dimension : 256,
    height = dimension !== undefined ? dimension : 256;

  // append the svg object to the body of the page
  const svg = setupSVG(margin, width, height);

  // Parse the Data
  d3.csv(filePath).then(function (data) {
    //need to aggregate small % into Other, color encoding and stacking uses this later. Header info
    const subgroups = aggregateGroups(data, 3);

    //Medium is limited to 8 colors
    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range([
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#a65628",
        "#fb9a99",
        "#999999",
      ]);

    // X axis groups
    const groups = getGroups(data);

    // X and Y axis setup
    const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
    const xLabels = groups.filter((element, index) => {
      return index % 4 === 0;
    });
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    const yLabels = d3.range(0, 101, 100 / 5);

    //add axes and style them
    addAxes(svg, height, x, xLabels, y, yLabels);
    svg
      .selectAll("#xAxis text")
      .style("text-anchor", "end")
      .attr("dx", "-.75em")
      .attr("dy", ".07em")
      .attr("transform", "rotate(-45)");

    // draw bars. Stack by major contributors
    const firstColHeader = Object.keys(data[0])[0];
    const stackedData = d3.stack().keys(subgroups)(data);
    addBars(svg, stackedData, firstColHeader, color, x, y);

    //pull the legend in
    addLegend(svg, width, color, subgroups, 20, 7.5);
    svg.selectAll("text").style("font-size", "12px");
  });
}

function runGenLargeGraph(filePath, dimension) {
  //sanity, remove any graph that exists currently.
  d3.select("#graph svg").remove();
  d3.select("#hover").remove();

  // set the dimensions and margins of the graph
  const margin = { top: 50, right: 250, bottom: 100, left: 250 },
    width = dimension !== undefined ? dimension : 512, //used to be 1000 - margin.left - margin.right
    height = dimension !== undefined ? dimension : 512; //used to be 600 - margin.top - margin.bottom

  // append the svg object to the body of the page
  const svg = setupSVG(margin, width, height);

  // Parse the Data. Gets fresh copy of data each time to avoid updates from other two fns.
  d3.csv(filePath).then(function (data) {
    // Color encoding uses this later, header row.
    const subgroups = aggregateGroups(data, 1);

    //Large should allow any and all groupings, though colors are still limited to 10
    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range([
        "#e31a1c",
        "#fb9a99",
        "#1f78b4",
        "#a6cee3",
        "#33a02c",
        "#b2df8a",
        "#6a3d9a",
        "#cab2d6",
        "#ff7f00",
        "#fdbf6f",
      ]);

    // X axis groups
    const groups = getGroups(data);

    // specify x axis and y axis
    const x = d3.scaleBand().domain(groups).range([0, width]).padding([0.3]);
    const xLabels = groups.filter((element, index) => {
      return index % 2 === 0;
    });
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    const yLabels = d3.range(0, 101, 100 / 10);

    //add axes to graph, then adjust for this size graph
    addAxes(svg, height, x, xLabels, y, yLabels);
    svg
      .selectAll("#xAxis text")
      .style("text-anchor", "end")
      .attr("dx", "-.75em")
      .attr("dy", ".07em")
      .attr("transform", "rotate(-45)");

    // draw bars. Stack, should keep most of them based on aggregation code
    const firstColHeader = Object.keys(data[0])[0];
    const stackedData = d3.stack().keys(subgroups)(data);
    addBars(svg, stackedData, firstColHeader, color, x, y);

    //Add legend - note we pass subgroups, which is everything
    addLegend(svg, width, color, subgroups, 25, 10);
    svg.selectAll("text").style("font-size", "16px");
  });
}
