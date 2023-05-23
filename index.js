var puppeteer = require('puppeteer');
var moment = require('moment');

let synopticResults = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  var accumulatedData = [];
  // Array for debugging
  // var dataWithIDs = [];
  var startDate = moment('2020-09-01');
  var endDate = moment('2020-09-04');

  // Loop through the date in range marked by startDate and endDate
  for (let x = moment(startDate); x.isBefore(endDate); x.add(1, 'days')) {
    var day = x.get('date');
    var month = x.get('month') + 1;
    var year = x.get('year');
    // For now ids are in descending order (inverted)
    var count = endDate.diff(x, 'days');

    await page.goto(
      `https://meteomodel.pl/dane/historyczne-dane-pomiarowe/?data=${year}-${month}-${day}&rodzaj=pl&imgwid=351160424&ord=asc`
    );

    const result = await page.evaluate(
      (ID, YEAR) => {
        var table = document.querySelector('#tablepl');
        var array = new Array();
        var data = [];

        // Loops through table until it matches the given cities
        for (i = 2; i <= table.rows.length - 1; i++) {
          var city = table.rows[i].cells[0].innerText;
          if (city == 'KROSNO' || city == 'OPOLE') {
            array.push(city);
            var degrees = table.rows[i].cells[1].innerText;
            var snowCover = table.rows[i].cells[16].innerText;
            // Template string to convert id into string
            data.push({
              year: {
                current: YEAR,
                city: {
                  city,
                  degrees,
                  snow: snowCover,
                  id: `${ID}`,
                },
              },
            });
          }
        }

        return data;
      },
      count,
      year
    );
    accumulatedData.push(result);
    // console.log(year, month, day);
    console.log(count);
  }
  await browser.close();

  // Instead of this synopticResults can return accumulatedData array and then other function can access it in the same way
  // Function responsible for accessing scraped data
  accumulatedData.map((element) => {
    var objArr = element;
    objArr.map((item) => {
      var results = item.year;
      console.log(results);
    });
  });
  // return accumulatedData;
};
synopticResults();

// JSON description
// var data = [
//   year1: {
//     city1: {
//       avgTemp: '...',
//       avgSnowCover: '...',
//     },
//     city2: {
//       avgTemp: '...',
//       avgSnowCover: '...',
//     },
//   },
//   year2: {
//     city1: {
//       avgTemp: '...',
//       avgSnowCover: '...',
//     },
//     city2: {
//       avgTemp: '...',
//       avgSnowCover: '...',
//     },
//   },
// ];
