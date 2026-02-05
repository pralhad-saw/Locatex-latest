// utils/csv.js
const { stringify } = require("csv-stringify/sync");

function generateItemCSV(items) {
  const data = items.map(item => ({
    "Item ID": item._id,
    "Title": item.title,
    "Type": item.type,
    "Status": item.status,
    "Location": item.location,
    "Posted By": item.postedBy ? item.postedBy.username : "Unknown",
    "Contact": item.contact,
    "Date Posted": item.createdAt.toISOString().substring(0,10)
  }));

  return stringify(data, { header: true });
}

module.exports = { generateItemCSV };
