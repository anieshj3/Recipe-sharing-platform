const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");

const router = express.Router();

// ======================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ======================================================

const verifyAdmin = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Admin token is required"
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin token"
            });
        }

        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (error, decoded) => {

                if (error) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid or expired admin token"
                    });
                }

                if (decoded.role !== "admin") {
                    return res.status(403).json({
                        success: false,
                        message: "Admin access required"
                    });
                }

                req.adminId = decoded.adminId;

                next();
            }
        );

    } catch (error) {

        console.log(
            "Admin Authentication Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};


// ======================================================
// ADMIN SIGNUP
// ======================================================
// POST /api/admin/signup
// ======================================================

router.post("/signup", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        // --------------------------------------------------
        // CHECK REQUIRED FIELDS
        // --------------------------------------------------

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }


        // --------------------------------------------------
        // CHECK PASSWORD LENGTH
        // --------------------------------------------------

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }


        // --------------------------------------------------
        // CLEAN EMAIL
        // --------------------------------------------------

        const cleanEmail = email
            .trim()
            .toLowerCase();


        // --------------------------------------------------
        // CHECK EXISTING ADMIN
        // --------------------------------------------------

        const existingAdmin = await Admin.findOne({
            email: cleanEmail
        });


        if (existingAdmin) {

            return res.status(400).json({
                success: false,
                message: "Admin already exists"
            });
        }


        // --------------------------------------------------
        // HASH PASSWORD
        // --------------------------------------------------

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // --------------------------------------------------
        // CREATE ADMIN
        // --------------------------------------------------

        const admin = new Admin({

            name: name.trim(),

            email: cleanEmail,

            password: hashedPassword,

            role: "admin",

            status: "Active"

        });


        await admin.save();


        // --------------------------------------------------
        // RESPONSE
        // --------------------------------------------------

        return res.status(201).json({

            success: true,

            message: "Admin created successfully"

        });


    } catch (error) {

        console.log(
            "Admin Signup Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Server Error",

            error: error.message

        });
    }

});


// ======================================================
// ADMIN LOGIN
// ======================================================
// POST /api/admin/login
// ======================================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // --------------------------------------------------
        // CHECK REQUIRED FIELDS
        // --------------------------------------------------

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and password are required"

            });
        }


        // --------------------------------------------------
        // CLEAN EMAIL
        // --------------------------------------------------

        const cleanEmail = email
            .trim()
            .toLowerCase();


        // --------------------------------------------------
        // FIND ADMIN
        // --------------------------------------------------

        const admin = await Admin.findOne({
            email: cleanEmail
        });


        if (!admin) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password"

            });
        }


        // --------------------------------------------------
        // CHECK PASSWORD
        // --------------------------------------------------

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );


        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password"

            });
        }


        // --------------------------------------------------
        // CHECK ADMIN STATUS
        // --------------------------------------------------

        if (admin.status !== "Active") {

            return res.status(403).json({

                success: false,

                message: "Admin account is not active"

            });
        }


        // --------------------------------------------------
        // CREATE JWT TOKEN
        // --------------------------------------------------

        const token = jwt.sign(

            {
                adminId: admin._id,
                role: "admin"
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1h"
            }

        );


        // --------------------------------------------------
        // SEND RESPONSE
        // --------------------------------------------------

        return res.status(200).json({

            success: true,

            message: "Admin Login Successful",

            token: token,

            admin: {

                id: admin._id,

                name: admin.name,

                email: admin.email,

                role: admin.role,

                status: admin.status

            }

        });


    } catch (error) {

        console.log(
            "Admin Login Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Server Error",

            error: error.message

        });
    }

});


// ======================================================
// ADMIN DASHBOARD
// ======================================================
// GET /api/admin/dashboard
// ======================================================

router.get(
    "/dashboard",
    verifyAdmin,
    async (req, res) => {

        try {

            const totalUsers =
                await User.countDocuments();

            const totalRecipes =
                await Recipe.countDocuments();

            const totalAdmins =
                await Admin.countDocuments();

            const activeUsers =
                await User.countDocuments({
                    status: "Active"
                });


            return res.status(200).json({

                success: true,

                statistics: {

                    totalUsers: totalUsers,

                    totalRecipes: totalRecipes,

                    totalAdmins: totalAdmins,

                    activeUsers: activeUsers

                }

            });


        } catch (error) {

            console.log(
                "Admin Dashboard Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message: "Server Error",

                error: error.message

            });
        }

    }
);


// ======================================================
// GET ALL USERS
// ======================================================
// GET /api/admin/users
// ======================================================

router.get(
    "/users",
    verifyAdmin,
    async (req, res) => {

        try {

            const users = await User
                .find()
                .select("-password")
                .sort({
                    createdAt: -1
                });


            return res.status(200).json({

                success: true,

                totalUsers: users.length,

                users: users

            });


        } catch (error) {

            console.log(
                "Get Users Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message: "Server Error",

                error: error.message

            });
        }

    }
);


// ======================================================
// GET ALL RECIPES
// ======================================================
// GET /api/admin/recipes
// ======================================================

router.get(
    "/recipes",
    verifyAdmin,
    async (req, res) => {

        try {

            const recipes = await Recipe
                .find()
                .populate(
                    "userId",
                    "name email"
                )
                .sort({
                    createdAt: -1
                });


            return res.status(200).json({

                success: true,

                totalRecipes: recipes.length,

                recipes: recipes

            });


        } catch (error) {

            console.log(
                "Get Recipes Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message: "Server Error",

                error: error.message

            });
        }

    }
);


// ======================================================
// DELETE USER
// ======================================================
// DELETE /api/admin/users/:id
// ======================================================

router.delete(
    "/users/:id",
    verifyAdmin,
    async (req, res) => {

        try {

            const userId = req.params.id;


            const user = await User.findById(
                userId
            );


            if (!user) {

                return res.status(404).json({

                    success: false,

                    message: "User not found"

                });
            }


            // Delete user's recipes

            await Recipe.deleteMany({
                userId: userId
            });


            // Delete user

            await User.findByIdAndDelete(
                userId
            );


            return res.status(200).json({

                success: true,

                message: "User deleted successfully"

            });


        } catch (error) {

            console.log(
                "Delete User Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message: "Server Error",

                error: error.message

            });
        }

    }
);


// ======================================================
// DELETE RECIPE
// ======================================================
// DELETE /api/admin/recipes/:id
// ======================================================

router.delete(
    "/recipes/:id",
    verifyAdmin,
    async (req, res) => {

        try {

            const recipeId = req.params.id;


            const recipe = await Recipe.findById(
                recipeId
            );


            if (!recipe) {

                return res.status(404).json({

                    success: false,

                    message: "Recipe not found"

                });
            }


            await Recipe.findByIdAndDelete(
                recipeId
            );


            return res.status(200).json({

                success: true,

                message: "Recipe deleted successfully"

            });


        } catch (error) {

            console.log(
                "Delete Recipe Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message: "Server Error",

                error: error.message

            });
        }

    }
);


// ======================================================
// ADMIN PROFILE
// ======================================================
// GET /api/admin/profile
// ======================================================

router.get(
    "/profile",
    verifyAdmin,
    async (req, res) => {

        try {

            const admin = await Admin
                .findById(req.adminId)
                .select("-password");


            if (!admin) {

                return res.status(404).json({

                    success: false,

                    message: "Admin not found"

                });
            }


            return res.status(200).json({

                success: true,

                admin: admin

            });


        } catch (error) {

            console.log(
                "Admin Profile Error:",
                error
            );


            return res.status(500).json({

                success: false,

                message: "Server Error",

                error: error.message

            });
        }

    }
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;