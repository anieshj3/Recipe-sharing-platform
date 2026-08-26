var express = require("express");
var router = express.Router();

const Admin = require("../models/adminModel");/* ===========================
   User Pages
=========================== */

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/forgotPassword", (req, res) => {
    res.render("forgotPassword");
});

router.get("/resetPassword", (req, res) => {
    res.render("resetPassword");
});

router.get("/changePassword", (req, res) => {
    res.render("changePassword");
});

router.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

router.get("/profile", (req, res) => {
    res.render("profile");
});

router.get("/editProfile", (req, res) => {
    res.render("editProfile");
});

/* ===========================
   Admin Pages
=========================== */

// Admin Login Page
router.get("/adminLogin", (req, res) => {
    res.render("adminLogin");
});

// Admin Login API
router.post("/adminlogin", async (req, res) => {

    const { email, password } = req.body;

    try {

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).send("Invalid Email or Password");
        }

        if (admin.password !== password) {
            return res.status(401).send("Invalid Email or Password");
        }

        return res.redirect("/adminDashboard");

    } catch (error) {

        console.log(error);

        return res.status(500).send("Internal Server Error");

    }

});

// Admin Dashboard
router.get("/adminDashboard", (req, res) => {
    res.render("adminDashboard");
});

// User List
router.get("/userList", (req, res) => {
    res.render("userList");
});

// User Management
router.get("/userManagement", (req, res) => {
    res.render("userManagement");
});

// Recipe List
router.get("/adminRecipeList", (req, res) => {
    res.render("adminRecipeList");
});

// Recipe Details
router.get("/adminRecipeView", (req, res) => {
    res.render("adminRecipeView");
});

// Most Viewed Recipes
router.get("/mostViewed", (req, res) => {
    res.render("mostViewed");
});

// Logout
router.get("/logout", (req, res) => {
    res.redirect("/adminLogin");
});

/* ===========================
   Create Default Admin
=========================== */

router.get("/createAdmin", async (req, res) => {

    try {

        const adminExists = await Admin.findOne({
            email: "aniesh@gmail.com"
        });

        if (adminExists) {
            return res.send("Admin already exists");
        }

        const newAdmin = new Admin({

            name: "Admin",

            email: "aniesh@gmail.com",

            password: "aniesh123"

        });

        await newAdmin.save();

        res.send("Admin Created Successfully");

    } catch (error) {

        console.log(error);

        res.status(500).send("Internal Server Error");

    }

});

module.exports = router;