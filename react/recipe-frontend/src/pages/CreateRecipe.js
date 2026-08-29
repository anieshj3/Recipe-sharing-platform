import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/CreateRecipe.css";

function CreateRecipe() {

    const [recipeName, setRecipeName] = useState("");
    const [category, setCategory] = useState("");
    const [cookingTime, setCookingTime] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [diningTime, setDiningTime] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [steps, setSteps] = useState("");
    const [image, setImage] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // ==================================================
    // DEFAULT IMAGE
    // ==================================================

    const defaultImage =
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85";

    // ==================================================
    // IMAGE ERROR
    // ==================================================

    const handleImageError = (event) => {

        console.log("Recipe image failed to load");

        event.target.onerror = null;

        event.target.src = defaultImage;
    };

    // ==================================================
    // CREATE RECIPE
    // ==================================================

    const addRecipe = async (event) => {

        event.preventDefault();

        setErrorMessage("");

        const token = localStorage.getItem("token");

        // ==================================================
        // CHECK LOGIN
        // ==================================================

        if (!token) {

            setErrorMessage("Please login first.");

            navigate("/login");

            return;
        }

        // ==================================================
        // VALIDATION
        // ==================================================

        if (!recipeName.trim()) {

            setErrorMessage("Please enter recipe name.");

            return;
        }

        if (!category.trim()) {

            setErrorMessage("Please enter category.");

            return;
        }

        if (!cookingTime) {

            setErrorMessage("Please enter cooking time.");

            return;
        }

        if (!difficulty) {

            setErrorMessage("Please select difficulty.");

            return;
        }

        if (!ingredients.trim()) {

            setErrorMessage("Please enter ingredients.");

            return;
        }

        if (!steps.trim()) {

            setErrorMessage("Please enter preparation steps.");

            return;
        }

        try {

            setLoading(true);

            // ==================================================
            // INGREDIENTS
            // ==================================================

            const ingredientsArray = ingredients
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item !== "");

            // ==================================================
            // STEPS
            // ==================================================

            const stepsArray = steps
                .split("\n")
                .map((step) => step.trim())
                .filter((step) => step !== "");

            // ==================================================
            // IMAGE URL
            // ==================================================

            const imageUrl = image.trim();

            // ==================================================
            // RECIPE DATA
            // ==================================================

            const recipe = {

                recipeName: recipeName.trim(),

                category: category.trim(),

                cookingTime: Number(cookingTime),

                difficulty: difficulty,

                diningTime: diningTime.trim(),

                ingredients: ingredientsArray,

                steps: stepsArray,

                // IMPORTANT:
                // Save only the actual URL
                image: imageUrl

            };

            console.log(
                "Recipe being sent:",
                recipe
            );

            // ==================================================
            // CREATE RECIPE API
            // ==================================================

            const response = await axios.post(

                "http://localhost:5000/api/createrecipe",

                recipe,

                {
                    headers: {

                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json"

                    }
                }

            );

            console.log(
                "Create Recipe Response:",
                response.data
            );

            alert(
                "Recipe created successfully! 🍽️"
            );

            // ==================================================
            // CLEAR FORM
            // ==================================================

            setRecipeName("");
            setCategory("");
            setCookingTime("");
            setDifficulty("");
            setDiningTime("");
            setIngredients("");
            setSteps("");
            setImage("");

            // ==================================================
            // GO TO MY RECIPES
            // ==================================================

            navigate("/myrecipes");

        } catch (error) {

            console.error(
                "Create Recipe Error:",
                error
            );

            // ==================================================
            // BACKEND ERROR
            // ==================================================

            if (error.response) {

                console.log(
                    "Backend Error:",
                    error.response.data
                );

                // TOKEN EXPIRED
                if (
                    error.response.status === 401
                ) {

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                    setErrorMessage(
                        "Your session has expired. Please login again."
                    );

                    navigate("/login");

                    return;
                }

                setErrorMessage(

                    error.response.data?.message ||

                    "Unable to create recipe."

                );

            }

            // ==================================================
            // SERVER NOT RUNNING
            // ==================================================

            else if (error.request) {

                setErrorMessage(
                    "Unable to connect to backend. Make sure the backend server is running on port 5000."
                );

            }

            // ==================================================
            // OTHER ERROR
            // ==================================================

            else {

                setErrorMessage(
                    "Something went wrong. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }

    };

    // ==================================================
    // PAGE
    // ==================================================

    return (

        <div className="create-page">

            {/* HEADER */}

            <div className="create-header">

                <div>

                    <span className="small-title">
                        RECIPE SHARE
                    </span>

                    <h1>
                        Create Your Recipe 🍴
                    </h1>

                    <p>
                        Share your favourite dish with
                        the recipe community.
                    </p>

                </div>

                <button
                    type="button"
                    className="back-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </div>


            {/* ERROR */}

            {errorMessage && (

                <div className="error-box">

                    ⚠️ {errorMessage}

                </div>

            )}


            {/* FORM */}

            <form
                className="recipe-form"
                onSubmit={addRecipe}
            >

                {/* ==================================================
                    LEFT SIDE
                ================================================== */}

                <div className="form-left">

                    {/* RECIPE INFORMATION */}

                    <section className="form-section">

                        <div className="section-heading">

                            <span>🍽️</span>

                            <div>

                                <h2>
                                    Recipe Information
                                </h2>

                                <p>
                                    Tell us about your dish
                                </p>

                            </div>

                        </div>


                        {/* RECIPE NAME */}

                        <div className="form-group">

                            <label>
                                Recipe Name
                                <span>*</span>
                            </label>

                            <input
                                type="text"
                                placeholder="Example: Chicken Biryani"
                                value={recipeName}
                                onChange={(event) =>
                                    setRecipeName(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* CATEGORY */}

                        <div className="form-group">

                            <label>
                                Category
                                <span>*</span>
                            </label>

                            <input
                                type="text"
                                placeholder="Example: Indian, Chinese, Dessert"
                                value={category}
                                onChange={(event) =>
                                    setCategory(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        {/* TIME */}

                        <div className="two-column">

                            <div className="form-group">

                                <label>
                                    Cooking Time
                                    <span>*</span>
                                </label>

                                <div className="input-icon">

                                    <span>
                                        ⏱️
                                    </span>

                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Minutes"
                                        value={cookingTime}
                                        onChange={(event) =>
                                            setCookingTime(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label>
                                    Dining Time
                                </label>

                                <select
                                    value={diningTime}
                                    onChange={(event) =>
                                        setDiningTime(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select time
                                    </option>

                                    <option value="Breakfast">
                                        🌅 Breakfast
                                    </option>

                                    <option value="Lunch">
                                        ☀️ Lunch
                                    </option>

                                    <option value="Dinner">
                                        🌙 Dinner
                                    </option>

                                    <option value="Snack">
                                        🍪 Snack
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* DIFFICULTY */}

                        <div className="form-group">

                            <label>
                                Difficulty Level
                                <span>*</span>
                            </label>

                            <div className="difficulty-options">

                                {/* EASY */}

                                <label
                                    className={
                                        difficulty === "Easy"
                                            ? "difficulty-card active easy"
                                            : "difficulty-card"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="difficulty"
                                        value="Easy"
                                        checked={
                                            difficulty === "Easy"
                                        }
                                        onChange={(event) =>
                                            setDifficulty(
                                                event.target.value
                                            )
                                        }
                                    />

                                    <span className="difficulty-icon">
                                        🟢
                                    </span>

                                    <span>

                                        <strong>
                                            Easy
                                        </strong>

                                        <small>
                                            Quick & simple
                                        </small>

                                    </span>

                                </label>


                                {/* MEDIUM */}

                                <label
                                    className={
                                        difficulty === "Medium"
                                            ? "difficulty-card active medium"
                                            : "difficulty-card"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="difficulty"
                                        value="Medium"
                                        checked={
                                            difficulty === "Medium"
                                        }
                                        onChange={(event) =>
                                            setDifficulty(
                                                event.target.value
                                            )
                                        }
                                    />

                                    <span className="difficulty-icon">
                                        🟡
                                    </span>

                                    <span>

                                        <strong>
                                            Medium
                                        </strong>

                                        <small>
                                            Requires some skill
                                        </small>

                                    </span>

                                </label>


                                {/* HARD */}

                                <label
                                    className={
                                        difficulty === "Hard"
                                            ? "difficulty-card active hard"
                                            : "difficulty-card"
                                    }
                                >

                                    <input
                                        type="radio"
                                        name="difficulty"
                                        value="Hard"
                                        checked={
                                            difficulty === "Hard"
                                        }
                                        onChange={(event) =>
                                            setDifficulty(
                                                event.target.value
                                            )
                                        }
                                    />

                                    <span className="difficulty-icon">
                                        🔴
                                    </span>

                                    <span>

                                        <strong>
                                            Hard
                                        </strong>

                                        <small>
                                            For experienced cooks
                                        </small>

                                    </span>

                                </label>

                            </div>

                        </div>

                    </section>


                    {/* INGREDIENTS */}

                    <section className="form-section">

                        <div className="section-heading">

                            <span>
                                🥕
                            </span>

                            <div>

                                <h2>
                                    Ingredients
                                </h2>

                                <p>
                                    Add all ingredients used
                                </p>

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Ingredients
                                <span>*</span>
                            </label>

                            <textarea
                                rows="6"
                                placeholder="Chicken, Rice, Onion, Tomato, Ginger, Garlic, Salt..."
                                value={ingredients}
                                onChange={(event) =>
                                    setIngredients(
                                        event.target.value
                                    )
                                }
                            />

                            <small className="helper-text">
                                Separate each ingredient with a comma.
                            </small>

                        </div>

                    </section>


                    {/* PREPARATION */}

                    <section className="form-section">

                        <div className="section-heading">

                            <span>
                                👨‍🍳
                            </span>

                            <div>

                                <h2>
                                    Preparation Steps
                                </h2>

                                <p>
                                    Explain how to prepare the dish
                                </p>

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Cooking Instructions
                                <span>*</span>
                            </label>

                            <textarea
                                rows="9"
                                placeholder={
                                    "Step 1: Wash the rice\n" +
                                    "Step 2: Cut the vegetables\n" +
                                    "Step 3: Heat the pan\n" +
                                    "Step 4: Add the ingredients\n" +
                                    "Step 5: Cook and serve"
                                }
                                value={steps}
                                onChange={(event) =>
                                    setSteps(
                                        event.target.value
                                    )
                                }
                            />

                            <small className="helper-text">
                                Write each preparation step on a new line.
                            </small>

                        </div>

                    </section>

                </div>


                {/* ==================================================
                    RIGHT SIDE
                ================================================== */}

                <div className="form-right">

                    {/* IMAGE */}

                    <section className="image-section">

                        <div className="section-heading">

                            <span>
                                📸
                            </span>

                            <div>

                                <h2>
                                    Recipe Image
                                </h2>

                                <p>
                                    Add a beautiful photo
                                </p>

                            </div>

                        </div>


                        {/* IMAGE PREVIEW */}

                        <div className="image-preview">

                            <img
                                src={
                                    image.trim()
                                        ? image.trim()
                                        : defaultImage
                                }
                                alt="Recipe preview"
                                onError={handleImageError}
                            />

                        </div>


                        {/* IMAGE URL */}

                        <div className="form-group">

                            <label>
                                Image URL
                            </label>

                            <input
                                type="url"
                                placeholder="https://images.unsplash.com/..."
                                value={image}
                                onChange={(event) =>
                                    setImage(
                                        event.target.value
                                    )
                                }
                            />

                            <small className="helper-text">

                                Paste a direct image URL.

                            </small>

                        </div>

                    </section>


                    {/* TIPS */}

                    <section className="tips-box">

                        <h3>
                            💡 Recipe Tips
                        </h3>

                        <ul>

                            <li>
                                Use a clear and attractive recipe image.
                            </li>

                            <li>
                                Use a direct image URL.
                            </li>

                            <li>
                                Add ingredients separated by commas.
                            </li>

                            <li>
                                Write each preparation step on a new line.
                            </li>

                        </ul>

                    </section>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "⏳ Creating Recipe..."
                            : "🍽️ Publish Recipe"
                        }

                    </button>


                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>
    );
}

export default CreateRecipe;