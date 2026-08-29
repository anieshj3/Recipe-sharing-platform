const mongoose = require("mongoose");

// ======================================================
// MONGODB CONNECTION
// ======================================================

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// ======================================================
// DATABASE CONNECTION
// ======================================================

const db = mongoose.connection;

db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

// Export database connection
module.exports = db;