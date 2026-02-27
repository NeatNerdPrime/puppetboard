jQuery(function ($) {
  let url = "daily_reports_chart.json";
  let certname = $("#dailyReportsChart").data("certname");
  let days = parseInt($("#dailyReportsChart").data("days"));
  let defaultJSON = []

  for (let index = days-1; index >= 0; index--) {
    defaultJSON.push({
      day: moment().startOf('day').subtract(index, 'days').format('YYYY-MM-DD'),
      unchanged: 0,
      changed: 0,
      failed: 0
    })
  }

  // Get chart colors from CSS variables (supports dark mode)
  function getChartColors() {
    var style = getComputedStyle(document.documentElement);
    return {
      failed: style.getPropertyValue('--color-failed').trim() || "#AA4643",
      changed: style.getPropertyValue('--color-changed').trim() || "#4572A7",
      unchanged: style.getPropertyValue('--color-unchanged').trim() || "#89A54E",
    };
  }

  let chart = bb.generate({
    bindto: "#dailyReportsChart",
    data: {
      type: "bar",
      json: defaultJSON,
      keys: {
        x: "day",
        value: ["failed", "changed", "unchanged"],
      },
      groups: [["failed", "changed", "unchanged"]],
      colors: getChartColors(),
    },
    size: {
      height: 160,
    },
    axis: {
      x: {
        type: "category",
      },
    },
  });

  if (typeof certname !== typeof undefined && certname !== false) {
    // truncate /node/certname from URL, to determine path to json
    url =
      window.location.href.replace(/\/node\/[^/]+$/, "") +
      "/daily_reports_chart.json?certname=" +
      certname
  }

  $.getJSON(url, function(data) {
    chart.load({json: data.result})
  });
})
