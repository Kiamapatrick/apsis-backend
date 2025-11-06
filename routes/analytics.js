const express = require("express");
const router = express.Router();

const Client = require("../models/clients");
const User = require("../models/users");
const Message = require("../models/messages");

// Your analytics route
const groupByDate = (items, field = "createdAt") => {
  return items.reduce((acc, item) => {
    const date = new Date(item[field]).toISOString().split("T")[0]; // YYYY-MM-DD
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});
};
const formatLocalDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-CA'); 
};

router.get("/trends", async (req, res) => {
  try {
        const messageTrends = await Message.aggregate([
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                  timezone: "+03:00", // <-- Local timezone
                },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);

        const userTrends = await User.aggregate([
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                  timezone: "+03:00", // <-- Local timezone
                },
              },
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ]);


    const messageData = {};
    messageTrends.forEach((item) => (messageData[item._id] = item.count));
    const userData = {};
    userTrends.forEach((item) => (userData[item._id] = item.count));

    res.json({ messageTrends: messageData, userTrends: userData });
  } catch (err) {
    console.error("Analytics trends error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ read: false });
    const readMessages = await Message.countDocuments({ read: true }); 

    res.json({
      totalClients,
      totalUsers,
      totalMessages,
      unreadMessages,
      readMessages, 
    });
  } catch (err) {
    console.error("Analytics fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
