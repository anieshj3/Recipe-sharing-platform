var express = require("express");
var router = express.Router();

const Admin = require("../models/adminModel");

/* ===========================
   User Pages
=========================== */

router.get("/", (req, res) => {
    res.render("index", { title: "Recipe Sharing Platform" });
});

router.get("/login", (req, res) => {
    res.render("login", { title: "Login" });
});

router.get("/signup", (req, res) => {
    res.render("signup", { title: "Sign Up" });
});

router.get("/forgotPassword", (req, res) => {
    res.render("forgotPassword", { title: "Forgot Password" });
});

router.get("/resetPassword", (req, res) => {
    res.render("resetPassword", { title: "Reset Password" });
});

router.get("/changePassword", (req, res) => {
    res.render("changePassword", { title: "Change Password" });
});

router.get("/dashboard", (req, res) => {
    res.render("dashboard", { title: "Dashboard" });
});

router.get("/profile", (req, res) => {
    res.render("profile", { title: "Profile" });
});

router.get("/editProfile", (req, res) => {
    res.render("editProfile", { title: "Edit Profile" });
});

/* ===========================
   Admin Pages
=========================== */

router.get("/adminLogin", (req, res) => {
    res.render("adminLogin", { title: "Admin Login" });
});

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

router.get("/adminDashboard", (req, res) => {
    res.render("adminDashboard", { title: "Admin Dashboard" });
});

router.get("/userList", (req, res) => {
    res.render("userList", { title: "User List" });
});

router.get("/userManagement", (req, res) => {
    res.render("userManagement", { title: "User Management" });
});

router.get("/adminRecipeList", (req, res) => {
    res.render("adminRecipeList", { title: "Recipe List" });
});

router.get("/adminRecipeView", (req, res) => {
    res.render("adminRecipeView", { title: "Recipe Details" });
});

router.get("/mostViewed", (req, res) => {
    res.render("mostViewed", { title: "Most Viewed Recipes" });
});

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