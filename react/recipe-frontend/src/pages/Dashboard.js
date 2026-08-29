import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/Dashboard.css";

function Dashboard() {

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    // ==================================================
    // IMAGE FALLBACKS
    // ==================================================

    const fallbackImages = [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=90",
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=90"
    ];

    // ==================================================
    // GET IMAGE URL
    // ==================================================

    const getImageUrl = (image, index = 0) => {

        if (!image || image.trim() === "") {
            return fallbackImages[index % fallbackImages.length];
        }

        // Complete URL
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        // Backend image path
        if (image.startsWith("/")) {
            return `http://localhost:5000${image}`;
        }

        return `http://localhost:5000/${image}`;
    };

    // ==================================================
    // IMAGE ERROR
    // ==================================================

    const handleImageError = (event, index) => {

        event.currentTarget.onerror = null;

        event.currentTarget.src =
            fallbackImages[index % fallbackImages.length];
    };

    // ==================================================
    // GET RECIPES
    // ==================================================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        axios
            .get(
                "http://localhost:5000/api/recipes",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((response) => {

                console.log(
                    "Dashboard Recipes:",
                    response.data
                );

                setRecipes(
                    response.data?.recipes || []
                );

                setLoading(false);

            })
            .catch((error) => {

                console.error(
                    "Dashboard Error:",
                    error
                );

                setLoading(false);

                if (error.response?.status === 401) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");

                    return;
                }

                if (error.response) {

                    setErrorMessage(
                        error.response.data?.message ||
                        "Unable to load recipes."
                    );

                } else if (error.request) {

                    setErrorMessage(
                        "Unable to connect to backend. Please make sure the backend is running on port 5000."
                    );

                } else {

                    setErrorMessage(
                        "Something went wrong."
                    );

                }

            });

    }, [navigate]);

    // ==================================================
    // LOGOUT
    // ==================================================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (

            <div className="dashboard-loading">

                <div className="loading-spinner"></div>

                <h2>
                    Loading Dashboard...
                </h2>

            </div>
        );
    }

    // ==================================================
    // UNIQUE USERS
    // ==================================================

    const uniqueUsers = new Set(

        recipes
            .map(
                (recipe) =>
                    recipe.userId?._id
            )
            .filter(Boolean)

    ).size;

    // ==================================================
    // DASHBOARD
    // ==================================================

    return (

        <div className="dashboard">

            {/* ==================================================
                NAVBAR
            ================================================== */}

            <header className="dashboard-navbar">

                <Link
                    to="/dashboard"
                    className="dashboard-logo"
                >

                    <div className="logo-icon">
                        🍴
                    </div>

                    <div className="logo-text">

                        <span>
                            Recipe
                        </span>

                        <strong>
                            Hub
                        </strong>

                    </div>

                </Link>

                <nav className="dashboard-nav">

                    <Link
                        to="/dashboard"
                        className="nav-link active"
                    >
                        <span>⌂</span>
                        Home
                    </Link>

                    <Link
                        to="/recipeList"
                        className="nav-link"
                    >
                        <span>🍽️</span>
                        Recipes
                    </Link>

                    <Link
                        to="/createRecipe"
                        className="nav-link"
                    >
                        <span>＋</span>
                        Add Recipe
                    </Link>

                    <Link
                        to="/myrecipes"
                        className="nav-link"
                    >
                        <span>📖</span>
                        My Recipes
                    </Link>

                    <Link
                        to="/profile"
                        className="nav-link"
                    >
                        <span>👤</span>
                        Profile
                    </Link>

                </nav>

                <div className="navbar-right">

                    <Link
                        to="/changePassword"
                        className="settings-btn"
                        title="Change Password"
                    >
                        ⚙️
                    </Link>

                    <button
                        type="button"
                        className="logout-btn"
                        onClick={logout}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </header>

            {/* ==================================================
                ERROR
            ================================================== */}

            {errorMessage && (

                <div className="dashboard-error">

                    <span>
                        ⚠️ {errorMessage}
                    </span>

                    <button
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        Try Again
                    </button>

                </div>
            )}

            {/* ==================================================
                HERO
            ================================================== */}

            <section className="dashboard-hero">

                <div className="hero-content">

                    <span className="hero-tag">
                        🍴 RECIPE COMMUNITY
                    </span>

                    <h1>
                        Welcome Back 👋
                    </h1>

                    <p>
                        Discover delicious recipes, create
                        your own dishes and share them with
                        the RecipeHub community.
                    </p>

                    <div className="hero-buttons">

                        <Link to="/recipeList">

                            <button className="primary-action">
                                🍽️ Explore Recipes
                            </button>

                        </Link>

                        <Link to="/createRecipe">

                            <button className="secondary-action">
                                ＋ Create Recipe
                            </button>

                        </Link>

                    </div>

                </div>

                <div className="hero-food">

                    <div className="food-circle">
                        🍲
                    </div>

                    <div className="floating-food food-one">
                        🍕
                    </div>

                    <div className="floating-food food-two">
                        🥗
                    </div>

                    <div className="floating-food food-three">
                        🍰
                    </div>

                </div>

            </section>

            {/* ==================================================
                STATISTICS
            ================================================== */}

            <section className="statistics">

                <div className="stat-card">

                    <div className="stat-icon orange">
                        🍽️
                    </div>

                    <div className="stat-info">

                        <span>
                            Total Recipes
                        </span>

                        <h2>
                            {recipes.length}
                        </h2>

                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon green">
                        👨‍🍳
                    </div>

                    <div className="stat-info">

                        <span>
                            Recipe Creators
                        </span>

                        <h2>
                            {uniqueUsers}
                        </h2>

                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon red">
                        ❤️
                    </div>

                    <div className="stat-info">

                        <span>
                            Favorites
                        </span>

                        <h2>
                            0
                        </h2>

                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon blue">
                        👁️
                    </div>

                    <div className="stat-info">

                        <span>
                            Views
                        </span>

                        <h2>
                            0
                        </h2>

                    </div>

                </div>

            </section>

            {/* ==================================================
                LATEST RECIPES
            ================================================== */}

            <section className="latest-section">

                <div className="section-heading">

                    <div>

                        <span className="section-label">
                            DISCOVER
                        </span>

                        <h2>
                            Latest Recipes
                        </h2>

                        <p>
                            Fresh recipes shared by our community
                        </p>

                    </div>

                    <Link
                        to="/recipeList"
                        className="view-all"
                    >
                        View All →
                    </Link>

                </div>

                {recipes.length > 0 ? (

                    <div className="recipe-container">

                        {recipes
                            .slice(0, 3)
                            .map((recipe, index) => (

                                <div
                                    className="recipe-card"
                                    key={recipe._id}
                                >

                                    {/* =========================
                                        CLEAR RECIPE IMAGE
                                    ========================== */}

                                    <div className="recipe-image">

                                        <img
                                            src={getImageUrl(
                                                recipe.image,
                                                index
                                            )}
                                            alt={
                                                recipe.recipeName ||
                                                "Recipe"
                                            }
                                            loading="lazy"
                                            onError={(event) =>
                                                handleImageError(
                                                    event,
                                                    index
                                                )
                                            }
                                        />

                                        <div className="image-overlay"></div>

                                        <span className="image-category">

                                            {recipe.category ||
                                                "Recipe"}

                                        </span>

                                    </div>

                                    {/* =========================
                                        RECIPE CONTENT
                                    ========================== */}

                                    <div className="recipe-content">

                                        <h3>
                                            {recipe.recipeName ||
                                                "Untitled Recipe"}
                                        </h3>

                                        <div className="recipe-details">

                                            <span>
                                                ⏱️{" "}
                                                {recipe.cookingTime ||
                                                    0} mins
                                            </span>

                                            <span>
                                                ⭐{" "}
                                                {recipe.difficulty ||
                                                    "Easy"}
                                            </span>

                                        </div>

                                        {recipe.diningTime && (

                                            <div className="dining-time">
                                                🍴{" "}
                                                {recipe.diningTime}
                                            </div>

                                        )}

                                        <p className="recipe-author">

                                            👨‍🍳{" "}
                                            {recipe.userId?.name ||
                                                "Unknown"}

                                        </p>

                                        <Link
                                            to={`/recipe/${recipe._id}`}
                                            state={{
                                                recipe: recipe
                                            }}
                                            className="recipe-link"
                                        >

                                            <button className="view-btn">

                                                View Recipe

                                                <span>
                                                    →
                                                </span>

                                            </button>

                                        </Link>

                                    </div>

                                </div>

                            ))}

                    </div>

                ) : (

                    <div className="no-recipes">

                        <div className="empty-icon">
                            🍳
                        </div>

                        <h3>
                            No Recipes Yet
                        </h3>

                        <p>
                            Be the first person to share
                            a delicious recipe.
                        </p>

                        <Link to="/createRecipe">

                            <button className="add-btn">
                                ＋ Add First Recipe
                            </button>

                        </Link>

                    </div>

                )}

            </section>

            {/* ==================================================
                QUICK ACTIONS
            ================================================== */}

            <section className="quick-section">

                <div className="quick-heading">

                    <span>
                        QUICK ACCESS
                    </span>

                    <h2>
                        What would you like to do?
                    </h2>

                </div>

                <div className="quick-grid">

                    <Link
                        to="/recipeList"
                        className="quick-card"
                    >

                        <div className="quick-icon">
                            🍽️
                        </div>

                        <div>

                            <h3>
                                Browse Recipes
                            </h3>

                            <p>
                                Explore delicious recipes
                            </p>

                        </div>

                        <span className="quick-arrow">
                            →
                        </span>

                    </Link>

                    <Link
                        to="/createRecipe"
                        className="quick-card"
                    >

                        <div className="quick-icon">
                            ➕
                        </div>

                        <div>

                            <h3>
                                Create Recipe
                            </h3>

                            <p>
                                Share your favourite dish
                            </p>

                        </div>

                        <span className="quick-arrow">
                            →
                        </span>

                    </Link>

                    <Link
                        to="/myrecipes"
                        className="quick-card"
                    >

                        <div className="quick-icon">
                            📖
                        </div>

                        <div>

                            <h3>
                                My Recipes
                            </h3>

                            <p>
                                Manage your recipes
                            </p>

                        </div>

                        <span className="quick-arrow">
                            →
                        </span>

                    </Link>

                    <Link
                        to="/profile"
                        className="quick-card"
                    >

                        <div className="quick-icon">
                            👤
                        </div>

                        <div>

                            <h3>
                                My Profile
                            </h3>

                            <p>
                                Manage your account
                            </p>

                        </div>

                        <span className="quick-arrow">
                            →
                        </span>

                    </Link>

                </div>

            </section>

            {/* ==================================================
                FOOTER
            ================================================== */}

            <footer className="dashboard-footer">

                <div className="footer-logo">
                    🍴 RecipeHub
                </div>

                <p>
                    Discover • Cook • Share
                </p>

                <span>
                    © 2026 RecipeHub. All rights reserved.
                </span>

            </footer>

        </div>
    );
}

export default Dashboard;