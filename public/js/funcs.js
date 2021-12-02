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
  let svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Parse the Data
  d3.csv(
    "https://raw.githubusercontent.com/LoganPreston/data/main/browser-ww-monthly-201910-202110.csv"
  ).then(function (data) {
    //need to aggregate small % into Other
    for (let i = 0; i < data.length; i++) {
      obj = data[i];
      obj["Other"] = Number(obj["Other"]);

      //skip first row and last row
      keys = Object.keys(obj);
      for (let j = 1; j < keys.length - 1; j++) {
        let keyVal = keys[j];
        if (Number(obj[keyVal]) < 5) {
          obj["Other"] += Number(obj[keyVal]);
          obj[keyVal] = 0;
        }
      }
      obj["Other"] = String(Math.round(obj["Other"] * 100) / 100);
    }

    // Color encoding uses this later, header row.
    let subgroups = data.columns.slice(1);

    // X axis groups
    let groups = d3.map(data, function (d) {
      return d.Month;
    });

    // Add X axis
    let x = d3.scaleBand().domain(groups).range([0, width]).padding([-0.2]);
    let xDom = x.domain();
    let xLabels = [
      xDom[0],
      xDom[Math.floor(xDom.length / 2)],
      xDom[xDom.length - 1],
    ];
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0).tickValues(xLabels));

    // Add Y axis - lock to 0-100, assume 100% for data set.
    let y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y).tickValues(d3.range(0, 101, 100 / 2)));

    //Large should allow any and all groupings, smaller will restrict to 6 total.
    let color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"]);

    //stack by subgroup
    let stackedData = d3.stack().keys(subgroups)(data);

    // draw bars
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
        return x(d.data.Month);
      })
      .attr("y", function (d) {
        return y(d[1]);
      })
      .attr("height", function (d) {
        return y(d[0]) - y(d[1]);
      })
      .attr("width", x.bandwidth())
      //Adding hover effects in
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
  let svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Parse the Data
  d3.csv(
    "https://raw.githubusercontent.com/LoganPreston/data/main/browser-ww-monthly-201910-202110.csv"
  ).then(function (data) {
    //need to aggregate small % into Other
    for (let i = 0; i < data.length; i++) {
      obj = data[i];
      obj["Other"] = Number(obj["Other"]);

      //skip first row and last row
      keys = Object.keys(obj);
      for (let j = 1; j < keys.length - 1; j++) {
        let keyVal = keys[j];
        if (Number(obj[keyVal]) < 5) {
          obj["Other"] += Number(obj[keyVal]);
          obj[keyVal] = 0;
        }
      }
      obj["Other"] = String(obj["Other"]);
    }

    // Color encoding uses this later, header row.
    let subgroups = data.columns.slice(1);

    // X axis groups
    let groups = d3.map(data, function (d) {
      return d.Month;
    });

    // Add X axis

    let x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
    let xLabels = x.domain().filter((element, index) => {
      return index % 4 === 0;
    });
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0).tickValues(xLabels))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.75em")
      .attr("dy", ".07em")
      .attr("transform", "rotate(-45)");

    // Add Y axis - lock to 0-100, assume 100% for data set. TODO update range to be dynamic.
    let y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y).tickValues(d3.range(0, 101, 100 / 5)));

    //Large should allow any and all groupings, smaller will restrict to 6 total.
    let color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00"]);

    //stack by subgroup
    let stackedData = d3.stack().keys(subgroups)(data);

    // draw bars
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
        return x(d.data.Month);
      })
      .attr("y", function (d) {
        return y(d[1]);
      })
      .attr("height", function (d) {
        return y(d[0]) - y(d[1]);
      })
      .attr("width", x.bandwidth());
  });
}

function runGenLargeGraph() {
  //sanity, remove any graph that exists currently.
  d3.select("#graph svg").remove();
  // set the dimensions and margins of the graph
  let margin = { top: 10, right: 250, bottom: 100, left: 250 },
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  let svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Parse the Data
  d3.csv(
    "https://raw.githubusercontent.com/LoganPreston/data/main/browser-ww-monthly-201910-202110.csv"
  ).then(function (data) {
    // Color encoding uses this later, header row.
    let subgroups = data.columns.slice(1);

    // X axis groups
    let groups = d3.map(data, function (d) {
      return d.Month;
    });

    // Add X axis
    let x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);
    let xLabels = x.domain().filter((element, index) => {
      return index % 2 === 0;
    });
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0).tickValues(xLabels))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.75em")
      .attr("dy", ".07em")
      .attr("transform", "rotate(-45)")
      .style("font-size", "12px");

    // Add Y axis - lock to 0-100, assume 100% for data set.
    let y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y)).style("font-size", "12px");

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

    //stack by subgroup
    let stackedData = d3.stack().keys(subgroups)(data);

    // draw bars
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
        return x(d.data.Month);
      })
      .attr("y", function (d) {
        return y(d[1]);
      })
      .attr("height", function (d) {
        return y(d[0]) - y(d[1]);
      })
      .attr("width", x.bandwidth());
  });
}

function getKeyByValue(object, value) {
  value = String(value);
  return Object.keys(object).find((key) => object[key] === value);
}
