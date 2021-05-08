require("dotenv").config();
const { DateTime, Interval } = require("luxon");
const { tap, fetch, transform, parse } = require("vandelay");
const fs = require("fs");

const startDate = new Date("2021-02-15 00:00:00");

const calcInterval = (start, end, intervalBy) => {
  if (!start) throw new Error("Please provide a min date");
  if (!end) throw new Error("Please provide a max date");
  if (!intervalBy) throw new Error("Please provide an interval");

  const d1 = DateTime.fromJSDate(new Date(start));
  const d2 = DateTime.fromJSDate(new Date(end));
  const interval = Interval.fromDateTimes(d1, d2);
  return Math.ceil(interval.length(intervalBy));
};

const length = calcInterval("2021-02-15", "2021-04-14", "day");

const baseDate = DateTime.fromJSDate(new Date(startDate));
let counter = 0;

const fileName = "./plausible_analytics.json";
if (!fs.existsSync(fileName)) {
  return fs.writeFileSync(fileName, "");
}

Array(length + 1)
  .fill({})
  .map((_, i) => {
    const date = baseDate.plus({
      day: counter,
    });
    counter++;
    const isoDate = date.toISODate();
    fetch({
      url: `https://plausible.io/api/v1/stats/aggregate?site_id=lostcreekdesigns.co&period=day&date=${isoDate}&metrics=visitors,pageviews,bounce_rate,visit_duration`,
      parser: parse("json", { selector: "*" }),
      headers: {
        Authorization: `Bearer ${process.env.PLAUSIBLE_TOKEN}`,
      },
    })
      .pipe(
        transform(async (row) => {
          return {
            date: date.toString(),
            bounce_rate: row.bounce_rate.value / 100,
            pageviews: row.pageviews.value,
            visit_duration: row.visit_duration.value,
            visitors: row.visitors.value,
          };
          // const external = await otherApi(row.field);
          // return {
          //   ...row,
          //   external,
          // };
        })
      )
      .pipe(
        tap(async (row, meta) => {
          // send row to an external api, db, or whatever!
          const existing = fs.readFileSync(fileName, "utf-8");

          if (!existing) {
            const data = [row];
            fs.writeFileSync(fileName, JSON.stringify(data));
          } else {
            fs.writeFileSync(fileName, "");
            const data = JSON.parse(existing);
            data.push(row);
            fs.writeFileSync(fileName, JSON.stringify(data));
          }

          // if (meta.row === 0) {

          // }
        })
      );
  });
