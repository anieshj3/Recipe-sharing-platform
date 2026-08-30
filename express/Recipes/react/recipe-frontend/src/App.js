import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// ======================================================
// USER PAGES
// ======================================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import RecipeList from "./pages/RecipeList";
import RecipeDetails from "./pages/RecipeDetails";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";
import MyRecipes from "./pages/MyRecipes";

import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";

// ======================================================
// ADMIN PAGES
// ======================================================

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminRecipes from "./pages/AdminRecipes";

// ======================================================
// APP
// ======================================================

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ==================================================
                    USER HOME
                ================================================== */}

                <Route
                    path="/"
                    element={<Home />}
                />

                {/* ==================================================
                    USER AUTHENTICATION
                ================================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                {/* ==================================================
                    USER DASHBOARD
                ================================================== */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* ==================================================
                    USER RECIPES
                ================================================== */}

                <Route
                    path="/recipeList"
                    element={<RecipeList />}
                />

                <Route
                    path="/recipe/:id"
                    element={<RecipeDetails />}
                />

                <Route
                    path="/createRecipe"
                    element={<CreateRecipe />}
                />

                <Route
                    path="/editRecipe/:id"
                    element={<EditRecipe />}
                />

                <Route
                    path="/myrecipes"
                    element={<MyRecipes />}
                />

                {/* ==================================================
                    USER PROFILE
                ================================================== */}

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                {/* IMPORTANT:
                    Edit Profile requires the user ID
                */}

                <Route
                    path="/editProfile/:id"
                    element={<EditProfile />}
                />

                <Route
                    path="/changePassword"
                    element={<ChangePassword />}
                />

                {/* ==================================================
                    ADMIN LOGIN
                ================================================== */}

                <Route
                    path="/adminLogin"
                    element={<AdminLogin />}
                />

                {/* ==================================================
                    ADMIN DASHBOARD
                ================================================== */}

                <Route
                    path="/adminDashboard"
                    element={<AdminDashboard />}
                />

                {/* ==================================================
                    ADMIN USERS
                ================================================== */}

                <Route
                    path="/adminUsers"
                    element={<AdminUsers />}
                />

                {/* ==================================================
                    ADMIN RECIPES
                ================================================== */}

                <Route
                    path="/adminRecipes"
                    element={<AdminRecipes />}
                />

                {/* ==================================================
                    404 PAGE
                ================================================== */}

                <Route
                    path="*"
                    element={
                        <div
                            style={{
                                minHeight: "100vh",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                padding: "20px",
                                background: "#f8f9fc"
                            }}
                        >
                            <div
                                style={{
                                    background: "#ffffff",
                                    padding: "50px",
                                    borderRadius: "20px",
                                    boxShadow:
                                        "0 10px 30px rgba(0,0,0,0.08)"
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "60px",
                                        marginBottom: "15px"
                                    }}
                                >
                                    🔍
                                </div>

                                <h1
                                    style={{
                                        margin: "0 0 10px",
                                        color: "#1f2937"
                                    }}
                                >
                                    404 - Page Not Found
                                </h1>

                                <p
                                    style={{
                                        color: "#6b7280",
                                        marginBottom: "25px"
                                    }}
                                >
                                    The page you are looking for
                                    does not exist.
                                </p>

                                <button
                                    onClick={() =>
                                        window.history.back()
                                    }
                                    style={{
                                        border: "none",
                                        background: "#ff6b00",
                                        color: "#ffffff",
                                        padding: "12px 25px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "15px",
                                        fontWeight: "600"
                                    }}
                                >
                                    ← Go Back
                                </button>
                            </div>
                        </div>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;