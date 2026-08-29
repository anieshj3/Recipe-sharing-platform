import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/MyRecipes.css";

function MyRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    // =====================================================
    // FALLBACK FOOD IMAGES
    // =====================================================

    const fallbackImages = [
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=80"
    ];

    // =====================================================
    // GET IMAGE URL
    // =====================================================

    const getImageUrl = (image, index) => {
        // No image
        if (!image || !image.trim()) {
            return fallbackImages[index % fallbackImages.length];
        }

        const imageValue = image.trim();

        // Full external URL
        if (
            imageValue.startsWith("http://") ||
            imageValue.startsWith("https://")
        ) {
            return imageValue;
        }

        // Backend image path
        if (imageValue.startsWith("/")) {
            return `http://localhost:5000${imageValue}`;
        }

        // Backend image path without /
        return `http://localhost:5000/${imageValue}`;
    };

    // =====================================================
    // IMAGE ERROR HANDLER
    // =====================================================

    const handleImageError = (event, index) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src =
            fallbackImages[index % fallbackImages.length];
    };

    // =====================================================
    // GET MY RECIPES
    // =====================================================

    useEffect(() => {
        const getMyRecipes = async () => {
            const token = localStorage.getItem("token");

            // Check login
            if (!token) {
                setLoading(false);
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:5000/api/myrecipes",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log("My Recipes Response:", response.data);

                // Handle different backend response formats
                let recipeData = [];

                if (Array.isArray(response.data)) {
                    recipeData = response.data;
                } else if (Array.isArray(response.data?.recipes)) {
                    recipeData = response.data.recipes;
                } else if (Array.isArray(response.data?.data)) {
                    recipeData = response.data.data;
                }

                setRecipes(recipeData);

            } catch (error) {
                console.error("MY RECIPES ERROR:", error);

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
                    "Unable to load your recipes."
                );

            } finally {
                setLoading(false);
            }
        };

        getMyRecipes();
    }, [navigate]);

    // =====================================================
    // DELETE RECIPE
    // =====================================================

    const deleteRecipe = async (id) => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this recipe?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/api/deleterecipe/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Remove deleted recipe from UI
            setRecipes((previousRecipes) =>
                previousRecipes.filter(
                    (recipe) => recipe._id !== id
                )
            );

            alert("Recipe deleted successfully.");

        } catch (error) {
            console.error("DELETE RECIPE ERROR:", error);

            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");
                return;
            }

            alert(
                error.response?.data?.message ||
                "Unable to delete recipe."
            );
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="my-recipes-page">

                <div className="loading-box">

                    <div className="loading-spinner"></div>

                    <h2>
                        Loading Your Recipes...
                    </h2>

                    <p>
                        Please wait a moment
                    </p>

                </div>

            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (errorMessage) {
        return (
            <div className="my-recipes-page">

                <div className="error-box">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {errorMessage}
                    </p>

                    <div className="error-actions">

                        <Link to="/dashboard">
                            <button className="back-btn">
                                ← Dashboard
                            </button>
                        </Link>

                        <button
                            className="retry-btn"
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Try Again
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (
        <div className="my-recipes-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="my-recipes-header">

                <div className="header-left">

                    <Link
                        to="/dashboard"
                        className="back-home"
                    >
                        ← Dashboard
                    </Link>

                    <div>

                        <span className="small-heading">
                            YOUR COLLECTION
                        </span>

                        <h1>
                            My Recipes
                        </h1>

                        <p>
                            Manage all the delicious
                            recipes you've created.
                        </p>

                    </div>

                </div>

                <Link to="/createRecipe">

                    <button className="create-recipe-btn">
                        <span>＋</span>
                        Create Recipe
                    </button>

                </Link>

            </header>

            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="recipe-summary">

                <div className="summary-item">

                    <span className="summary-icon">
                        🍽️
                    </span>

                    <div>

                        <strong>
                            {recipes.length}
                        </strong>

                        <small>
                            Total Recipes
                        </small>

                    </div>

                </div>

                <div className="summary-item">

                    <span className="summary-icon">
                        👨‍🍳
                    </span>

                    <div>

                        <strong>
                            Your Kitchen
                        </strong>

                        <small>
                            Personal Collection
                        </small>

                    </div>

                </div>

                <div className="summary-item">

                    <span className="summary-icon">
                        ❤️
                    </span>

                    <div>

                        <strong>
                            Cook & Share
                        </strong>

                        <small>
                            Made with Love
                        </small>

                    </div>

                </div>

            </div>

            {/* =================================================
                RECIPES
            ================================================= */}

            {recipes.length > 0 ? (

                <section className="recipes-section">

                    <div className="section-heading">

                        <div>

                            <h2>
                                Your Recipes
                            </h2>

                            <p>
                                Click on a recipe to view
                                all its details.
                            </p>

                        </div>

                        <span className="recipe-count">

                            {recipes.length}{" "}

                            {recipes.length === 1
                                ? "Recipe"
                                : "Recipes"}

                        </span>

                    </div>

                    {/* =================================================
                        RECIPE GRID
                    ================================================= */}

                    <div className="my-recipe-grid">

                        {recipes.map((recipe, index) => (

                            <article
                                className="my-recipe-card"
                                key={recipe._id}
                            >

                                {/* IMAGE */}

                                <div className="recipe-image-wrapper">

                                    <img
                                        src={getImageUrl(
                                            recipe.image,
                                            index
                                        )}
                                        alt={
                                            recipe.recipeName ||
                                            "Recipe"
                                        }
                                        onError={(event) =>
                                            handleImageError(
                                                event,
                                                index
                                            )
                                        }
                                    />

                                    <span className="category-badge">
                                        {recipe.category ||
                                            "Recipe"}
                                    </span>

                                </div>

                                {/* CONTENT */}

                                <div className="recipe-card-body">

                                    <h3>
                                        {recipe.recipeName ||
                                            "Untitled Recipe"}
                                    </h3>

                                    {/* META */}

                                    <div className="recipe-meta">

                                        <span>
                                            ⏱️{" "}
                                            {recipe.cookingTime ||
                                                "--"}{" "}
                                            mins
                                        </span>

                                        <span>
                                            👨‍🍳{" "}
                                            {recipe.difficulty ||
                                                "Easy"}
                                        </span>

                                    </div>

                                    {/* DINING TIME */}

                                    {recipe.diningTime && (

                                        <div className="dining-time">

                                            🍴 Best for{" "}

                                            <strong>
                                                {recipe.diningTime}
                                            </strong>

                                        </div>

                                    )}

                                    {/* INGREDIENT COUNT */}

                                    <div className="ingredient-info">

                                        🥕{" "}

                                        {Array.isArray(
                                            recipe.ingredients
                                        )
                                            ? recipe.ingredients.length
                                            : 0}{" "}

                                        ingredients

                                    </div>

                                    <div className="card-divider"></div>

                                    {/* ACTIONS */}

                                    <div className="recipe-actions">

                                        {/* VIEW RECIPE */}

                                        <Link
                                            to={`/recipe/${recipe._id}`}
                                            state={{
                                                recipe: recipe
                                            }}
                                            className="view-link"
                                        >
                                            View Recipe →
                                        </Link>

                                        <div className="small-actions">

                                            {/* EDIT */}

                                            <Link
                                                to={`/editRecipe/${recipe._id}`}
                                                state={{
                                                    recipe: recipe
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    className="edit-btn"
                                                    title="Edit Recipe"
                                                >
                                                    ✏️
                                                </button>
                                            </Link>

                                            {/* DELETE */}

                                            <button
                                                type="button"
                                                className="delete-btn"
                                                title="Delete Recipe"
                                                onClick={() =>
                                                    deleteRecipe(
                                                        recipe._id
                                                    )
                                                }
                                            >
                                                🗑️
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            </article>

                        ))}

                    </div>

                </section>

            ) : (

                /* =================================================
                   EMPTY STATE
                ================================================= */

                <section className="empty-state">

                    <div className="empty-image">
                        🍳
                    </div>

                    <h2>
                        Your Recipe Book is Empty
                    </h2>

                    <p>
                        You haven't created any recipes
                        yet. Start sharing your favourite
                        dishes with the community!
                    </p>

                    <Link to="/createRecipe">

                        <button className="empty-create-btn">
                            ＋ Create Your First Recipe
                        </button>

                    </Link>

                </section>

            )}

        </div>
    );
}

export default MyRecipes;