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

//aggregation of the groups, mutates the passed object
function aggregateGroups(data, thresh) {
  let largeGroups = new Set();

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
      //TODO another aggregation strategy - aggregate until groups = num groups you have
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
