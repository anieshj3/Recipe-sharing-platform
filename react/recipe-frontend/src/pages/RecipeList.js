import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../css/RecipeList.css";

function RecipeList() {
    const [search, setSearch] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // =====================================================
    // DEFAULT FOOD IMAGES
    // =====================================================

    const foodImages = [
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",

        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85",

        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85",

        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=85",

        "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?auto=format&fit=crop&w=900&q=85",

        "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=900&q=85",

        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85",

        "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=85",

        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85"
    ];

    // =====================================================
    // GET RECIPES
    // =====================================================

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setErrorMessage("Please login first.");
            setLoading(false);
            return;
        }

        const fetchRecipes = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const response = await axios.get(
                    "http://localhost:5000/api/recipes",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log(
                    "Recipe API Response:",
                    response.data
                );

                // Support both:
                // { recipes: [...] }
                // and direct [...]
                const recipeData = Array.isArray(response.data)
                    ? response.data
                    : response.data?.recipes || [];

                setRecipes(recipeData);

            } catch (error) {
                console.error(
                    "Recipe Fetch Error:",
                    error
                );

                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    setErrorMessage(
                        "Your session has expired. Please login again."
                    );

                    return;
                }

                setErrorMessage(
                    error.response?.data?.message ||
                    "Unable to fetch recipes."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();

    }, []);

    // =====================================================
    // GET IMAGE URL
    // =====================================================

    const getImageUrl = (recipe, index) => {
        if (!recipe?.image || !recipe.image.trim()) {
            return foodImages[index % foodImages.length];
        }

        const image = recipe.image.trim();

        // Direct image URL
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        // Backend uploaded image
        if (image.startsWith("/")) {
            return `http://localhost:5000${image}`;
        }

        // Backend image without /
        return `http://localhost:5000/${image}`;
    };

    // =====================================================
    // SEARCH FILTER
    // =====================================================

    const filteredRecipes = recipes.filter((recipe) => {
        const searchText = search.trim().toLowerCase();

        if (!searchText) {
            return true;
        }

        return (
            (recipe.recipeName || "")
                .toLowerCase()
                .includes(searchText) ||

            (recipe.category || "")
                .toLowerCase()
                .includes(searchText) ||

            (recipe.difficulty || "")
                .toLowerCase()
                .includes(searchText) ||

            (recipe.diningTime || "")
                .toLowerCase()
                .includes(searchText)
        );
    });

    // =====================================================
    // LOADING PAGE
    // =====================================================

    if (loading) {
        return (
            <div className="recipe-page">

                <div className="message-box">

                    <div className="spinner"></div>

                    <h2>
                        Loading recipes...
                    </h2>

                    <p>
                        Please wait while we fetch the recipes.
                    </p>

                </div>

            </div>
        );
    }

    // =====================================================
    // ERROR PAGE
    // =====================================================

    if (errorMessage) {
        return (
            <div className="recipe-page">

                <div className="message-box">

                    <div className="message-icon">
                        🍽️
                    </div>

                    <h2>
                        {errorMessage}
                    </h2>

                    {errorMessage.includes(
                        "login"
                    ) ? (

                        <Link to="/login">
                            <button className="back-btn">
                                Go to Login
                            </button>
                        </Link>

                    ) : (

                        <Link to="/dashboard">
                            <button className="back-btn">
                                ← Back to Dashboard
                            </button>
                        </Link>

                    )}

                </div>

            </div>
        );
    }

    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (
        <div className="recipe-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="recipe-header">

                <div>

                    <span className="header-small">
                        🍴 RECIPE COMMUNITY
                    </span>

                    <h1>
                        Discover Delicious Recipes
                    </h1>

                    <p>
                        Find your favourite dishes and start cooking.
                    </p>

                </div>

                <Link to="/dashboard">
                    <button className="dashboard-btn">
                        ← Dashboard
                    </button>
                </Link>

            </header>


            {/* =================================================
                SEARCH AREA
            ================================================= */}

            <section className="search-area">

                <div className="search-wrapper">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search recipes or categories..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                    {search && (
                        <button
                            type="button"
                            className="clear-btn"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ×
                        </button>
                    )}

                </div>


                <div className="recipe-total">

                    <strong>
                        {filteredRecipes.length}
                    </strong>

                    <span>
                        {filteredRecipes.length === 1
                            ? " Recipe"
                            : " Recipes"}
                    </span>

                </div>

            </section>


            {/* =================================================
                RECIPE GRID
            ================================================= */}

            {filteredRecipes.length > 0 ? (

                <section className="recipe-grid">

                    {filteredRecipes.map(
                        (recipe, index) => {

                            const imageUrl =
                                getImageUrl(
                                    recipe,
                                    index
                                );

                            return (
                                <div
                                    className="recipe-card"
                                    key={
                                        recipe._id ||
                                        index
                                    }
                                >

                                    {/* =================================================
                                        IMAGE
                                    ================================================= */}

                                    <div className="recipe-image-box">

                                        <img
                                            src={imageUrl}
                                            alt={
                                                recipe.recipeName ||
                                                "Recipe"
                                            }
                                            className="recipe-image"
                                            onError={(event) => {
                                                event.target.onerror =
                                                    null;

                                                event.target.src =
                                                    foodImages[
                                                        index %
                                                        foodImages.length
                                                    ];
                                            }}
                                        />


                                        {/* CATEGORY */}

                                        <span className="category">
                                            {recipe.category ||
                                                "Recipe"}
                                        </span>


                                        {/* HEART */}

                                        <button
                                            type="button"
                                            className="heart-btn"
                                            aria-label="Favourite recipe"
                                        >
                                            ♡
                                        </button>

                                    </div>


                                    {/* =================================================
                                        RECIPE CONTENT
                                    ================================================= */}

                                    <div className="recipe-content">

                                        {/* TITLE */}

                                        <h2>
                                            {recipe.recipeName ||
                                                "Untitled Recipe"}
                                        </h2>


                                        {/* =================================================
                                            COOKING TIME + DIFFICULTY
                                        ================================================= */}

                                        <div className="info-row">

                                            {/* COOKING TIME */}

                                            <div className="info">

                                                <span className="info-icon">
                                                    ⏱️
                                                </span>

                                                <div>

                                                    <small>
                                                        Cooking Time
                                                    </small>

                                                    <strong>
                                                        {recipe.cookingTime
                                                            ? `${recipe.cookingTime} mins`
                                                            : "N/A"}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* DIFFICULTY */}

                                            <div className="info">

                                                <span className="info-icon">
                                                    👨‍🍳
                                                </span>

                                                <div>

                                                    <small>
                                                        Difficulty
                                                    </small>

                                                    <strong>
                                                        {recipe.difficulty ||
                                                            "N/A"}
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            DINING TIME
                                        ================================================= */}

                                        <div className="extra-info">

                                            <span>
                                                🍽️
                                            </span>

                                            <div>

                                                <small>
                                                    Dining Time
                                                </small>

                                                <strong>
                                                    {recipe.diningTime ||
                                                        "Any time"}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            BOTTOM SECTION
                                        ================================================= */}

                                        <div className="bottom-section">

                                            {/* CREATOR */}

                                            <div className="creator">

                                                <div className="creator-icon">
                                                    👨‍🍳
                                                </div>

                                                <div>

                                                    <small>
                                                        Created by
                                                    </small>

                                                    <strong>
                                                        {recipe.userId?.name ||
                                                            recipe.userId?.username ||
                                                            "Unknown"}
                                                    </strong>

                                                </div>

                                            </div>


                                            {/* VIEW RECIPE */}

                                            <Link
                                                to={`/recipe/${recipe._id}`}
                                                state={{
                                                    recipe: recipe
                                                }}
                                                className="view-recipe-link"
                                            >

                                                <button
                                                    type="button"
                                                    className="view-btn"
                                                >
                                                    View Recipe
                                                    <span>
                                                        →
                                                    </span>
                                                </button>

                                            </Link>

                                        </div>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </section>

            ) : (

                /* =================================================
                   NO RECIPES
                ================================================= */

                <div className="no-recipes">

                    <div className="no-recipes-icon">
                        🍳
                    </div>

                    <h2>
                        No Recipes Found
                    </h2>

                    <p>
                        {search
                            ? `No recipes found for "${search}".`
                            : "There are no recipes available yet."
                        }
                    </p>


                    {search ? (

                        <button
                            type="button"
                            className="view-btn"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            Clear Search
                        </button>

                    ) : (

                        <Link to="/createRecipe">

                            <button
                                type="button"
                                className="view-btn"
                            >
                                + Add Recipe
                            </button>

                        </Link>

                    )}

                </div>

            )}

        </div>
    );
}

export default RecipeList;
