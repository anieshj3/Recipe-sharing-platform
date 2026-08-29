import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "../css/RecipeDetails.css";

function RecipeDetails() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(location.state?.recipe || null);
    const [loading, setLoading] = useState(!location.state?.recipe);
    const [errorMessage, setErrorMessage] = useState("");

    // =====================================================
    // DEFAULT IMAGE
    // =====================================================

    const defaultImage =
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85";

    // =====================================================
    // GET IMAGE URL
    // =====================================================

    const getImageUrl = (image) => {
        if (!image || !image.trim()) {
            return defaultImage;
        }

        const imageUrl = image.trim();

        // Direct URL
        if (
            imageUrl.startsWith("http://") ||
            imageUrl.startsWith("https://")
        ) {
            return imageUrl;
        }

        // Backend uploaded image
        if (imageUrl.startsWith("/")) {
            return `http://localhost:5000${imageUrl}`;
        }

        return `http://localhost:5000/${imageUrl}`;
    };

    // =====================================================
    // FETCH RECIPE
    // =====================================================

    useEffect(() => {
        // If recipe was already passed through Link state,
        // no need to call API again.
        if (location.state?.recipe) {
            setRecipe(location.state.recipe);
            setLoading(false);
            return;
        }

        const fetchRecipe = async () => {
            try {
                setLoading(true);
                setErrorMessage("");

                const token = localStorage.getItem("token");

                if (!token) {
                    setErrorMessage("Please login first.");
                    navigate("/login");
                    return;
                }

                const response = await axios.get(
                    `http://localhost:5000/api/recipes/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log("Recipe Details Response:", response.data);

                const recipeData =
                    response.data?.recipe ||
                    response.data;

                setRecipe(recipeData);

            } catch (error) {
                console.error(
                    "Recipe Details Error:",
                    error
                );

                setErrorMessage(
                    error.response?.data?.message ||
                    "Unable to load recipe."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();

    }, [id, location.state, navigate]);

    // =====================================================
    // IMAGE ERROR
    // =====================================================

    const handleImageError = (event) => {
        event.target.onerror = null;
        event.target.src = defaultImage;
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="recipe-details-page">
                <div className="details-message">
                    <div className="details-spinner"></div>
                    <h2>Loading recipe...</h2>
                </div>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (errorMessage || !recipe) {
        return (
            <div className="recipe-details-page">
                <div className="details-message">
                    <div className="details-error-icon">
                        🍽️
                    </div>

                    <h2>
                        {errorMessage || "Recipe not found."}
                    </h2>

                    <Link to="/recipes">
                        <button className="details-back-btn">
                            ← Back to Recipes
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    // =====================================================
    // RECIPE DATA
    // =====================================================

    const ingredients = Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : [];

    const steps = Array.isArray(recipe.steps)
        ? recipe.steps
        : [];

    const creatorName =
        recipe.userId?.name ||
        recipe.userId?.username ||
        "Recipe Creator";

    const creatorEmail =
        recipe.userId?.email ||
        "No email available";

    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (
        <div className="recipe-details-page">

            {/* =================================================
                MAIN CONTAINER
            ================================================= */}

            <div className="recipe-details-container">

                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="details-left">

                    {/* BACK BUTTON */}

                    <Link
                        to="/recipes"
                        className="details-back-link"
                    >
                        ← Back to My Recipes
                    </Link>


                    {/* =================================================
                        TOP RECIPE INFORMATION
                    ================================================= */}

                    <div className="recipe-main-card">

                        {/* IMAGE */}

                        <div className="details-image-container">

                            <img
                                src={getImageUrl(recipe.image)}
                                alt={
                                    recipe.recipeName ||
                                    "Recipe"
                                }
                                className="details-recipe-image"
                                onError={handleImageError}
                            />

                        </div>


                        {/* RECIPE INFORMATION */}

                        <div className="details-info">

                            <div className="recipe-label">
                                🍴 RECIPE
                            </div>


                            <h1>
                                {recipe.recipeName ||
                                    "Untitled Recipe"}
                            </h1>


                            {/* CATEGORY */}

                            <div className="details-category">
                                {recipe.category ||
                                    "Recipe"}
                            </div>


                            {/* INFO ITEMS */}

                            <div className="recipe-meta">

                                {/* COOKING TIME */}

                                <div className="meta-item">

                                    <div className="meta-icon orange">
                                        ⏱️
                                    </div>

                                    <div>
                                        <span>
                                            Cooking Time
                                        </span>

                                        <strong>
                                            {recipe.cookingTime
                                                ? `${recipe.cookingTime} minutes`
                                                : "N/A"}
                                        </strong>
                                    </div>

                                </div>


                                {/* DINING TIME */}

                                <div className="meta-item">

                                    <div className="meta-icon purple">
                                        🍴
                                    </div>

                                    <div>
                                        <span>
                                            Dining Time
                                        </span>

                                        <strong>
                                            {recipe.diningTime ||
                                                "Any time"}
                                        </strong>
                                    </div>

                                </div>


                                {/* DIFFICULTY */}

                                <div className="meta-item">

                                    <div className="meta-icon green">
                                        📊
                                    </div>

                                    <div>
                                        <span>
                                            Difficulty
                                        </span>

                                        <strong
                                            className={`difficulty-value ${
                                                recipe.difficulty
                                                    ?.toLowerCase()
                                            }`}
                                        >
                                            {recipe.difficulty ||
                                                "N/A"}
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                CREATED BY
                            ================================================= */}

                            <div className="created-by">

                                <h3>
                                    Created By
                                </h3>

                                <div className="creator-details">

                                    <div className="creator-avatar">
                                        👨‍🍳
                                    </div>

                                    <div>

                                        <strong>
                                            {creatorName}
                                        </strong>

                                        <span>
                                            {creatorEmail}
                                        </span>

                                    </div>

                                </div>


                                {/* CREATED DATE */}

                                {recipe.createdAt && (
                                    <div className="created-date">
                                        📅 Created On:{" "}
                                        {new Date(
                                            recipe.createdAt
                                        ).toLocaleDateString(
                                            "en-GB",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            }
                                        )}
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        INGREDIENTS
                    ================================================= */}

                    <section className="ingredients-section">

                        <div className="section-title">

                            <div className="section-title-icon">
                                🛒
                            </div>

                            <div>
                                <h2>
                                    Ingredients
                                </h2>

                                <p>
                                    All the ingredients you need
                                </p>
                            </div>

                        </div>


                        <div className="ingredients-grid">

                            {ingredients.length > 0 ? (

                                ingredients.map(
                                    (ingredient, index) => (

                                        <div
                                            className="ingredient-item"
                                            key={index}
                                        >

                                            <span className="ingredient-check">
                                                ✓
                                            </span>

                                            <span>
                                                {ingredient}
                                            </span>

                                        </div>

                                    )
                                )

                            ) : (

                                <p className="empty-text">
                                    No ingredients available.
                                </p>

                            )}

                        </div>

                    </section>

                </div>


                {/* =================================================
                    RIGHT SIDE - PREPARATION
                ================================================= */}

                <div className="details-right">

                    <section className="preparation-section">

                        {/* HEADER */}

                        <div className="preparation-header">

                            <div className="preparation-icon">
                                👨‍🍳
                            </div>

                            <div>

                                <h2>
                                    Preparation Steps
                                </h2>

                                <p>
                                    Follow these steps
                                </p>

                            </div>

                        </div>


                        {/* STEPS */}

                        <div className="steps-container">

                            {steps.length > 0 ? (

                                steps.map(
                                    (step, index) => (

                                        <div
                                            className="step-item"
                                            key={index}
                                        >

                                            {/* NUMBER */}

                                            <div className="step-number">
                                                {index + 1}
                                            </div>


                                            {/* CONTENT */}

                                            <div className="step-content">

                                                <h3>
                                                    Step{" "}
                                                    {index + 1}
                                                </h3>

                                                <p>
                                                    {step}
                                                </p>

                                            </div>

                                        </div>

                                    )
                                )

                            ) : (

                                <div className="empty-steps">
                                    No preparation steps available.
                                </div>

                            )}

                        </div>

                    </section>

                </div>

            </div>

        </div>
    );
}

export default RecipeDetails;