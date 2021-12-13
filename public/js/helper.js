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

//aggregation of the groups, mutates the passed object. Returns a set of the aggregated group names
function aggregateGroups(data, thresh) {
  let largeGroups = new Set();

  for (let i = 0; i < data.length; i++) {
    obj = data[i];
    obj["Other"] = Number(obj["Other"]);

    //skip first row and last row (the x axis header and an other value)
    keys = Object.keys(obj);
    for (let j = 1; j < keys.length - 1; j++) {
      let key = keys[j];
      let val = Number(obj[key]);

      //group it if Other is small and this is a small contributor, or if it's a very small contributor
      if ((val < thresh && obj["Other"] < thresh) || val < thresh / 2) {
        obj["Other"] += val;
        obj[key] = 0;
      }
      //if it's big enough, add this group to the returned set.
      else {
        largeGroups.add(key);
      }
    }

    obj["Other"] = String(Math.round(obj["Other"] * 100) / 100);
  }
  if (Number(obj["Other"]) > 0) largeGroups.add("Other");
  return largeGroups;
}

function updateSliderVal(sliderId, labelId) {
  let slider = document.getElementById(sliderId);
  let label = document.getElementById(labelId);
  label.innerHTML = slider.value;
}

function updateSliderValConst(value, sliderId, labelId) {
  let slider = document.getElementById(sliderId);
  let label = document.getElementById(labelId);

  slider.value = value;
  label.innerHTML = value;
}

function genGraph(sliderId) {
  let size = Number(document.getElementById(sliderId).value);
  if (size > 375) {
    runGenLargeGraph(size);
  } else if (size > 200) {
    runGenMedGraph(size);
  } else if (size > 150) {
    runGenSmallGraph(size);
  } else {
    runGenTinyGraph(size);
  }
}
