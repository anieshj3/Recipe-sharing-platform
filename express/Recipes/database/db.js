const mongoose = require("mongoose");

// ======================================================
// MONGODB CONNECTION
// ======================================================

mongoose.connect("mongodb://127.0.0.1:27017/my_recipe");

// ======================================================
// DATABASE CONNECTION
// ======================================================

const db = mongoose.connection;

// Connection error
db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

// Successfully connected
db.once("open", () => {
    console.log("Connected to MongoDB");
});

// Export database connection
module.exports = db;