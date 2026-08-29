const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");

// ======================================================
// JWT SECRET
// ======================================================

const JWT_SECRET =
    process.env.JWT_SECRET || "recipehub_secret_key";


// ======================================================
// AUTHENTICATION MIDDLEWARE
// ======================================================

const authenticateUser = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required."
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format."
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing."
            });
        }

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        const userId =
            decoded.id ||
            decoded.userId ||
            decoded._id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token."
            });
        }

        if (
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid user ID."
            });
        }

        const user =
            await User.findById(userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found."
            });
        }

        req.user = user;
        req.userId = user._id;

        next();

    } catch (error) {

        console.error(
            "Authentication Error:",
            error
        );

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};


// ======================================================
// SIGNUP
// POST /api/signupapi
// ======================================================

router.post(
    "/signupapi",
    async (req, res) => {

        try {

            const {
                name,
                email,
                password,
                passwordConf
            } = req.body;

            // ------------------------------------------
            // VALIDATION
            // ------------------------------------------

            if (
                !name ||
                !email ||
                !password
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Please fill all required fields."
                });
            }

            if (name.trim().length < 2) {

                return res.status(400).json({
                    success: false,
                    message: "Name must contain at least 2 characters."
                });
            }

            if (password.length < 6) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Password must be at least 6 characters."
                });
            }

            // ------------------------------------------
            // PASSWORD CONFIRMATION
            // ------------------------------------------

            // Your current React Signup sends only
            // password, so passwordConf is optional here.
            //
            // If it is sent, check it.

            if (
                passwordConf &&
                password !== passwordConf
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Passwords do not match."
                });
            }

            // ------------------------------------------
            // EMAIL VALIDATION
            // ------------------------------------------

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailPattern.test(
                    email.trim()
                )
            ) {

                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid email address."
                });
            }

            // ------------------------------------------
            // CHECK EXISTING USER
            // ------------------------------------------

            const normalizedEmail =
                email
                    .toLowerCase()
                    .trim();

            const existingUser =
                await User.findOne({
                    email: normalizedEmail
                });

            if (existingUser) {

                return res.status(409).json({
                    success: false,
                    message: "Email already registered."
                });
            }

            // ------------------------------------------
            // HASH PASSWORD
            // ------------------------------------------

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            // ------------------------------------------
            // CREATE USER
            // ------------------------------------------

            const user =
                await User.create({

                    name: name.trim(),

                    email: normalizedEmail,

                    password: hashedPassword,

                    bio: "",

                    gender: "Other",

                    profileImage: ""

                });

            // ------------------------------------------
            // RESPONSE
            // ------------------------------------------

            return res.status(201).json({

                success: true,

                message:
                    "Registration successful.",

                user: {

                    _id: user._id,

                    name: user.name,

                    email: user.email,

                    bio: user.bio || "",

                    gender: user.gender || "Other",

                    profileImage:
                        user.profileImage || ""

                }

            });

        } catch (error) {

            console.error(
                "Signup Error:",
                error
            );

            // Duplicate email protection
            if (error.code === 11000) {

                return res.status(409).json({
                    success: false,
                    message: "Email already registered."
                });
            }

            return res.status(500).json({

                success: false,

                message:
                    "Unable to register user."

            });
        }
    }
);


// ======================================================
// LOGIN
// POST /api/loginapi
// ======================================================

router.post(
    "/loginapi",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;

            // ------------------------------------------
            // VALIDATION
            // ------------------------------------------

            if (
                !email ||
                !password
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email and password are required."

                });
            }

            // ------------------------------------------
            // FIND USER
            // ------------------------------------------

            const user =
                await User.findOne({

                    email:
                        email
                            .toLowerCase()
                            .trim()

                });

            if (!user) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password."

                });
            }

            // ------------------------------------------
            // CHECK PASSWORD
            // ------------------------------------------

            const passwordMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!passwordMatch) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password."

                });
            }

            // ------------------------------------------
            // CREATE JWT
            // ------------------------------------------

            const token =
                jwt.sign(

                    {
                        id: user._id
                    },

                    JWT_SECRET,

                    {
                        expiresIn: "7d"
                    }
                );

            // ------------------------------------------
            // RESPONSE
            // ------------------------------------------

            return res.json({

                success: true,

                message:
                    "Login successful.",

                token: token,

                user: {

                    _id: user._id,

                    name: user.name,

                    email: user.email,

                    bio:
                        user.bio || "",

                    gender:
                        user.gender || "Other",

                    profileImage:
                        user.profileImage || ""

                }

            });

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to login."

            });
        }
    }
);


// ======================================================
// GET ALL RECIPES
// GET /api/recipes
// ======================================================

router.get(
    "/recipes",
    authenticateUser,
    async (req, res) => {

        try {

            const recipes =
                await Recipe.find()
                    .populate(
                        "userId",
                        "name email"
                    )
                    .sort({
                        createdAt: -1
                    });

            return res.json({

                success: true,

                recipes: recipes

            });

        } catch (error) {

            console.error(
                "Get Recipes Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to fetch recipes."

            });
        }
    }
);


// ======================================================
// GET MY RECIPES
// GET /api/myrecipes
// ======================================================

router.get(
    "/myrecipes",
    authenticateUser,
    async (req, res) => {

        try {

            const recipes =
                await Recipe.find({
                    userId: req.userId
                })
                    .populate(
                        "userId",
                        "name email"
                    )
                    .sort({
                        createdAt: -1
                    });

            return res.json({

                success: true,

                recipes: recipes

            });

        } catch (error) {

            console.error(
                "Get My Recipes Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to fetch your recipes."

            });
        }
    }
);


// ======================================================
// CREATE RECIPE
// POST /api/createrecipe
// ======================================================

router.post(
    "/createrecipe",
    authenticateUser,
    async (req, res) => {

        try {

            const {
                recipeName,
                category,
                cookingTime,
                difficulty,
                diningTime,
                ingredients,
                steps,
                image
            } = req.body;

            // ------------------------------------------
            // VALIDATION
            // ------------------------------------------

            if (
                !recipeName ||
                !category ||
                !cookingTime ||
                !difficulty ||
                !ingredients ||
                !steps
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please fill all required recipe fields."

                });
            }

            // ------------------------------------------
            // INGREDIENTS
            // ------------------------------------------

            let ingredientsArray = [];

            if (Array.isArray(ingredients)) {

                ingredientsArray =
                    ingredients
                        .map(item =>
                            String(item).trim()
                        )
                        .filter(Boolean);

            } else {

                ingredientsArray =
                    String(ingredients)
                        .split(",")
                        .map(item =>
                            item.trim()
                        )
                        .filter(Boolean);
            }

            // ------------------------------------------
            // STEPS
            // ------------------------------------------

            let stepsArray = [];

            if (Array.isArray(steps)) {

                stepsArray =
                    steps
                        .map(step =>
                            String(step).trim()
                        )
                        .filter(Boolean);

            } else {

                stepsArray =
                    String(steps)
                        .split("\n")
                        .map(step =>
                            step.trim()
                        )
                        .filter(Boolean);
            }

            // ------------------------------------------
            // CREATE RECIPE
            // ------------------------------------------

            const newRecipe =
                await Recipe.create({

                    recipeName:
                        recipeName.trim(),

                    category:
                        category.trim(),

                    cookingTime:
                        Number(cookingTime),

                    difficulty:
                        difficulty,

                    diningTime:
                        diningTime || "",

                    ingredients:
                        ingredientsArray,

                    steps:
                        stepsArray,

                    image:
                        image
                            ? image.trim()
                            : "",

                    userId:
                        req.userId
                });

            // ------------------------------------------
            // POPULATE USER
            // ------------------------------------------

            const populatedRecipe =
                await Recipe.findById(
                    newRecipe._id
                ).populate(
                    "userId",
                    "name email"
                );

            return res.status(201).json({

                success: true,

                message:
                    "Recipe created successfully.",

                recipe:
                    populatedRecipe

            });

        } catch (error) {

            console.error(
                "Create Recipe Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Unable to create recipe."

            });
        }
    }
);


// ======================================================
// GET SINGLE RECIPE
// GET /api/recipe/:id
// ======================================================

router.get(
    "/recipe/:id",
    authenticateUser,
    async (req, res) => {

        try {

            const { id } =
                req.params;

            if (
                !mongoose.Types.ObjectId.isValid(id)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid recipe ID."

                });
            }

            const recipe =
                await Recipe.findById(id)
                    .populate(
                        "userId",
                        "name email"
                    );

            if (!recipe) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Recipe not found."

                });
            }

            return res.json({

                success: true,

                recipe: recipe

            });

        } catch (error) {

            console.error(
                "Get Recipe Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to fetch recipe."

            });
        }
    }
);


// ======================================================
// UPDATE RECIPE
// PUT /api/editrecipe/:id
// ======================================================

router.put(
    "/editrecipe/:id",
    authenticateUser,
    async (req, res) => {

        try {

            const { id } =
                req.params;

            if (
                !mongoose.Types.ObjectId.isValid(id)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid recipe ID."

                });
            }

            const recipe =
                await Recipe.findById(id);

            if (!recipe) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Recipe not found."

                });
            }

            // ------------------------------------------
            // OWNER CHECK
            // ------------------------------------------

            if (
                recipe.userId.toString() !==
                req.userId.toString()
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "You can only edit your own recipes."

                });
            }

            const {
                recipeName,
                category,
                cookingTime,
                difficulty,
                diningTime,
                ingredients,
                steps,
                image
            } = req.body;

            // ------------------------------------------
            // UPDATE FIELDS
            // ------------------------------------------

            if (
                recipeName !== undefined
            ) {

                recipe.recipeName =
                    recipeName.trim();

            }

            if (
                category !== undefined
            ) {

                recipe.category =
                    category.trim();

            }

            if (
                cookingTime !== undefined
            ) {

                recipe.cookingTime =
                    Number(cookingTime);

            }

            if (
                difficulty !== undefined
            ) {

                recipe.difficulty =
                    difficulty;

            }

            if (
                diningTime !== undefined
            ) {

                recipe.diningTime =
                    diningTime;

            }

            if (
                ingredients !== undefined
            ) {

                recipe.ingredients =
                    Array.isArray(
                        ingredients
                    )
                        ? ingredients
                        : String(
                            ingredients
                        )
                            .split(",")
                            .map(item =>
                                item.trim()
                            )
                            .filter(Boolean);
            }

            if (
                steps !== undefined
            ) {

                recipe.steps =
                    Array.isArray(
                        steps
                    )
                        ? steps
                        : String(
                            steps
                        )
                            .split("\n")
                            .map(step =>
                                step.trim()
                            )
                            .filter(Boolean);
            }

            if (
                image !== undefined
            ) {

                recipe.image =
                    image.trim();

            }

            await recipe.save();

            // ------------------------------------------
            // POPULATE
            // ------------------------------------------

            const updatedRecipe =
                await Recipe.findById(id)
                    .populate(
                        "userId",
                        "name email"
                    );

            return res.json({

                success: true,

                message:
                    "Recipe updated successfully.",

                recipe:
                    updatedRecipe

            });

        } catch (error) {

            console.error(
                "Update Recipe Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to update recipe."

            });
        }
    }
);


// ======================================================
// DELETE RECIPE
// DELETE /api/deleterecipe/:id
// ======================================================

router.delete(
    "/deleterecipe/:id",
    authenticateUser,
    async (req, res) => {

        try {

            const { id } =
                req.params;

            if (
                !mongoose.Types.ObjectId.isValid(id)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid recipe ID."

                });
            }

            const recipe =
                await Recipe.findById(id);

            if (!recipe) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Recipe not found."

                });
            }

            // ------------------------------------------
            // OWNER CHECK
            // ------------------------------------------

            if (
                recipe.userId.toString() !==
                req.userId.toString()
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "You can only delete your own recipes."

                });
            }

            await Recipe.findByIdAndDelete(id);

            return res.json({

                success: true,

                message:
                    "Recipe deleted successfully."

            });

        } catch (error) {

            console.error(
                "Delete Recipe Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to delete recipe."

            });
        }
    }
);


// ======================================================
// GET PROFILE
// GET /api/profile
// ======================================================

router.get(
    "/profile",
    authenticateUser,
    async (req, res) => {

        try {

            const user =
                await User.findById(
                    req.userId
                ).select("-password");

            if (!user) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found."

                });
            }

            return res.json({

                success: true,

                user: user

            });

        } catch (error) {

            console.error(
                "Profile Error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Unable to fetch profile."

            });
        }
    }
);


// ======================================================
// UPDATE PROFILE
// PUT /api/updateprofile/:id
// ======================================================

router.put(
    "/updateprofile/:id",
    authenticateUser,
    async (req, res) => {

        try {

            const { id } =
                req.params;

            // ------------------------------------------
            // CHECK ID
            // ------------------------------------------

            if (
                !mongoose.Types.ObjectId.isValid(id)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid user ID."

                });
            }

            // ------------------------------------------
            // CHECK USER IS UPDATING HIS OWN PROFILE
            // ------------------------------------------

            if (
                req.userId.toString() !==
                id.toString()
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "You can only update your own profile."

                });
            }

            // ------------------------------------------
            // GET DATA
            // ------------------------------------------

            const {
                name,
                email,
                bio,
                gender,
                profileImage
            } = req.body;

            // ------------------------------------------
            // VALIDATION
            // ------------------------------------------

            if (!name || !name.trim()) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name is required."

                });
            }

            if (!email || !email.trim()) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email is required."

                });
            }

            // ------------------------------------------
            // EMAIL FORMAT
            // ------------------------------------------

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailPattern.test(
                    email.trim()
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter a valid email address."

                });
            }

            const normalizedEmail =
                email
                    .toLowerCase()
                    .trim();

            // ------------------------------------------
            // CHECK EMAIL USED BY ANOTHER USER
            // ------------------------------------------

            const existingUser =
                await User.findOne({

                    email:
                        normalizedEmail,

                    _id: {
                        $ne: id
                    }

                });

            if (existingUser) {

                return res.status(409).json({

                    success: false,

                    message:
                        "This email is already used by another account."

                });
            }

            // ------------------------------------------
            // UPDATE USER
            // ------------------------------------------

            const updatedUser =
                await User.findByIdAndUpdate(

                    id,

                    {
                        name:
                            name.trim(),

                        email:
                            normalizedEmail,

                        bio:
                            bio
                                ? bio.trim()
                                : "",

                        gender:
                            gender || "Other",

                        profileImage:
                            profileImage
                                ? profileImage.trim()
                                : ""
                    },

                    {
                        new: true,

                        runValidators: true
                    }

                ).select("-password");

            // ------------------------------------------
            // USER NOT FOUND
            // ------------------------------------------

            if (!updatedUser) {

                return res.status(404).json({

                    success: false,

                    message:
                        "User not found."

                });
            }

            // ------------------------------------------
            // RESPONSE
            // ------------------------------------------

            return res.json({

                success: true,

                message:
                    "Profile updated successfully.",

                user:
                    updatedUser

            });

        } catch (error) {

            console.error(
                "Update Profile Error:",
                error
            );

            // Duplicate email
            if (error.code === 11000) {

                return res.status(409).json({

                    success: false,

                    message:
                        "This email is already registered."

                });
            }

            return res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Unable to update profile."

            });
        }
    }
);


// ======================================================
// LOGOUT
// POST /api/logout
// ======================================================

router.post(
    "/logout",
    authenticateUser,
    async (req, res) => {

        return res.json({

            success: true,

            message:
                "Logged out successfully."

        });
    }
);


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;