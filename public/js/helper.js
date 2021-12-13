/**
 *
 * @param {Object} object - object to get key from
 * @param {Value} value - val of obj[key]
 * @returns key corresponding to value in obj
 */
function getKeyByValue(object, value) {
  value = String(value);
  return Object.keys(object).find((key) => object[key] === value);
}

/**
 * Identify the groups in the data, from the first column, return array of groups for xAxis label
 * @param {*} data - Parse CSV with D3 style. Object of objects that hold each row of data-
 * @returns first column groups, which should represent the X axis on a graph
 */
function getGroups(data) {
  let firstColHeader = Object.keys(data[0])[0];
  let groups = d3.map(data, function (d) {
    return d[firstColHeader];
  });
  return groups;
}

/**
 * aggregation of the groups, mutates the passed object. Returns a set of the aggregated group names
 * @param {*} data - Data to aggregate. Parse CSV with D3 style. Object of objects that hold each row of data
 * @param {Number} thresh - threshold to aggregate to. Groups with less than half this value will be fully aggregated.
 *                          Groups under this value, but more than half of it, will be aggregated if the other group
 *                          is less than this value.
 * @returns Set of aggregated group names
 */
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

/**
 * update the slider value to what it was dragged to. Just displays the dragged value
 * @param {String} sliderId ID of the slider to update
 * @param {String} labelId ID of the label for the slider to update
 */
function updateSliderVal(sliderId, labelId) {
  let slider = document.getElementById(sliderId);
  let label = document.getElementById(labelId);
  label.innerHTML = slider.value;
}

/**
 * update the slider to some constant value. Show on the label as well
 * @param {Number} value value to update the slider and label to
 * @param {String} sliderId ID of the slider to update
 * @param {String} labelId ID of the label for the slider to update
 */
function updateSliderValConst(value, sliderId, labelId) {
  let slider = document.getElementById(sliderId);
  let label = document.getElementById(labelId);

  slider.value = value;
  label.innerHTML = value;
}

/**
 * MAIN DRIVER this is called by buttons and slider.
 *  Picks which graph to display based on slider setting
 *  Picks the filePath based on user selection
 */
function genGraph(sliderId) {
  const filePath = getFilePath();
  let size = Number(document.getElementById(sliderId).value);
  if (size > 375) {
    runGenLargeGraph(filePath, size);
  } else if (size > 215) {
    runGenMedGraph(filePath, size);
  } else if (size > 150) {
    runGenSmallGraph(filePath, size);
  } else {
    runGenTinyGraph(filePath, size);
  }
}

/**
 * Identify the filePath based on which radio button is selected
 * @returns: String of the filepath to the data stored in csv
 */
function getFilePath() {
  const buttons = document.getElementsByClassName("radio button");
  //safety. this is the default.
  let filePath =
    "https://raw.githubusercontent.com/LoganPreston/CS765_DC2/main/browser-ww-monthly-201910-202110.csv";

  for (let i = 0; i < buttons.length; i++) {
    if (!buttons[i].checked) continue;

    let dataName = buttons[i].id;
    //browser data
    if (dataName === "browser") {
      filePath =
        "https://raw.githubusercontent.com/LoganPreston/CS765_DC2/main/browser-ww-monthly-201910-202110.csv";
      break;
    }
    //operating system data
    else if (dataName === "os") {
      filePath =
        "https://raw.githubusercontent.com/LoganPreston/CS765_DC2/main/os_combined-ww-monthly-201910-202110.csv";
      break;
    }
    //search engine data. Kind of boring since google dominates
    else if (dataName === "searchEngine") {
      filePath =
        "https://raw.githubusercontent.com/LoganPreston/CS765_DC2/main/search_engine-ww-monthly-201910-202110.csv";
      break;
    }
  }
  return filePath;
}
