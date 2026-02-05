const cron = require("node-cron");
const Item = require("../models/Item");

cron.schedule("0 0 * * *", async () => { // runs daily at midnight
  const DAYS = 30;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - DAYS);

  await Item.updateMany(
    {
      status: { $in: ["available", "pending_claim"] },
      createdAt: { $lte: cutoff }
    },
    { $set: { status: "unclaimed", isContactVisible: false } }
  );

  console.log("Unclaimed items auto-updated");
});
