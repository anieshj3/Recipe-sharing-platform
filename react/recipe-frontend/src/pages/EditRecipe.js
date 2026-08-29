import React, { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";
import axios from "axios";
import "../css/EditRecipe.css";

function EditRecipe() {

    const navigate = useNavigate();
    const { id } = useParams();

    // ==========================================
    // STATES
    // ==========================================

    const [recipeName, setRecipeName] = useState("");
    const [category, setCategory] = useState("");
    const [cookingTime, setCookingTime] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [diningTime, setDiningTime] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [steps, setSteps] = useState("");
    const [image, setImage] = useState("");

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    // ==========================================
    // GET RECIPE BY ID
    // ==========================================

    useEffect(() => {

        const getRecipe = async () => {

            const token = localStorage.getItem("token");

            if (!token) {

                alert("Please login first.");

                navigate("/login");

                return;
            }

            try {

                const response = await axios.get(
                    `http://localhost:5000/api/recipe/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log(
                    "Recipe response:",
                    response.data
                );

                const recipe = response.data.recipe;

                if (!recipe) {

                    setErrorMessage(
                        "Recipe not found."
                    );

                    return;
                }

                // ==================================
                // SET RECIPE DATA
                // ==================================

                setRecipeName(
                    recipe.recipeName || ""
                );

                setCategory(
                    recipe.category || ""
                );

                setCookingTime(
                    recipe.cookingTime || ""
                );

                setDifficulty(
                    recipe.difficulty || ""
                );

                setDiningTime(
                    recipe.diningTime || ""
                );

                // Convert array to string
                setIngredients(
                    Array.isArray(recipe.ingredients)
                        ? recipe.ingredients.join(", ")
                        : recipe.ingredients || ""
                );

                // Convert array to multiline string
                setSteps(
                    Array.isArray(recipe.steps)
                        ? recipe.steps.join("\n")
                        : recipe.steps || ""
                );

                setImage(
                    recipe.image || ""
                );

            } catch (error) {

                console.error(
                    "Error fetching recipe:",
                    error
                );

                // ==================================
                // TOKEN EXPIRED
                // ==================================

                if (
                    error.response?.status === 401
                ) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    alert(
                        "Your session has expired. Please login again."
                    );

                    navigate("/login");

                    return;
                }

                setErrorMessage(
                    error.response?.data?.message ||
                    "Unable to load recipe."
                );

            } finally {

                setLoading(false);

            }

        };

        getRecipe();

    }, [id, navigate]);


    // ==========================================
    // UPDATE RECIPE
    // ==========================================

    const updateRecipe = async (e) => {

        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {

            alert("Please login first.");

            navigate("/login");

            return;
        }

        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !recipeName.trim() ||
            !category.trim() ||
            !cookingTime ||
            !difficulty ||
            !ingredients.trim() ||
            !steps.trim()
        ) {

            alert(
                "Please fill all required fields."
            );

            return;
        }

        // ==========================================
        // CONVERT INGREDIENTS
        // ==========================================

        const ingredientsArray = ingredients
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item !== "");

        // ==========================================
        // CONVERT STEPS
        // ==========================================

        const stepsArray = steps
            .split("\n")
            .map((step) => step.trim())
            .filter((step) => step !== "");

        // ==========================================
        // CHECK ARRAYS
        // ==========================================

        if (ingredientsArray.length === 0) {

            alert(
                "Please enter at least one ingredient."
            );

            return;
        }

        if (stepsArray.length === 0) {

            alert(
                "Please enter at least one preparation step."
            );

            return;
        }

        // ==========================================
        // DATA TO BACKEND
        // ==========================================

        const updatedRecipe = {

            recipeName: recipeName.trim(),

            category: category.trim(),

            cookingTime: Number(cookingTime),

            difficulty: difficulty,

            diningTime: diningTime,

            ingredients: ingredientsArray,

            steps: stepsArray,

            image: image.trim()

        };

        try {

            const response = await axios.put(
                `http://localhost:5000/api/updaterecipe/${id}`,
                updatedRecipe,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "Update response:",
                response.data
            );

            alert(
                "Recipe Updated Successfully!"
            );

            navigate("/myrecipes");

        } catch (error) {

            console.error(
                "Error updating recipe:",
                error
            );

            // ==================================
            // TOKEN EXPIRED
            // ==================================

            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                alert(
                    "Your session has expired. Please login again."
                );

                navigate("/login");

                return;
            }

            // ==================================
            // NOT OWNER
            // ==================================

            if (
                error.response?.status === 403
            ) {

                alert(
                    error.response?.data?.message ||
                    "You are not allowed to update this recipe."
                );

                navigate("/myrecipes");

                return;
            }

            alert(
                error.response?.data?.message ||
                "Unable to update recipe."
            );

        }

    };


    // ==========================================
    // DELETE RECIPE
    // ==========================================

    const deleteRecipe = async () => {

        const token = localStorage.getItem("token");

        if (!token) {

            alert("Please login first.");

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

            const response = await axios.delete(
                `http://localhost:5000/api/deleterecipe/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "Delete response:",
                response.data
            );

            alert(
                "Recipe Deleted Successfully!"
            );

            navigate("/myrecipes");

        } catch (error) {

            console.error(
                "Error deleting recipe:",
                error
            );

            // ==================================
            // TOKEN EXPIRED
            // ==================================

            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                alert(
                    "Your session has expired. Please login again."
                );

                navigate("/login");

                return;
            }

            // ==================================
            // NOT OWNER
            // ==================================

            if (
                error.response?.status === 403
            ) {

                alert(
                    error.response?.data?.message ||
                    "You are not allowed to delete this recipe."
                );

                navigate("/myrecipes");

                return;
            }

            alert(
                error.response?.data?.message ||
                "Unable to delete recipe."
            );

        }

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="edit-recipe">

                <h2>
                    Loading recipe...
                </h2>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (errorMessage) {

        return (

            <div className="not-found">

                <h1>
                    Recipe Not Found!
                </h1>

                <p>
                    {errorMessage}
                </p>

                <button
                    onClick={() =>
                        navigate("/myrecipes")
                    }
                >
                    ← Back to My Recipes
                </button>

            </div>

        );

    }


    // ==========================================
    // EDIT RECIPE PAGE
    // ==========================================

    return (

        <div className="edit-recipe">

            <h1>
                Edit Recipe
            </h1>


            <form onSubmit={updateRecipe}>

                {/* ==================================
                    RECIPE NAME
                =================================== */}

                <label>
                    Recipe Name
                </label>

                <input
                    type="text"
                    value={recipeName}
                    onChange={(event) =>
                        setRecipeName(
                            event.target.value
                        )
                    }
                />


                {/* ==================================
                    CATEGORY
                =================================== */}

                <label>
                    Category
                </label>

                <input
                    type="text"
                    value={category}
                    onChange={(event) =>
                        setCategory(
                            event.target.value
                        )
                    }
                />


                {/* ==================================
                    COOKING TIME
                =================================== */}

                <label>
                    Cooking Time (Minutes)
                </label>

                <input
                    type="number"
                    min="1"
                    value={cookingTime}
                    onChange={(event) =>
                        setCookingTime(
                            event.target.value
                        )
                    }
                />


                {/* ==================================
                    DINING TIME
                =================================== */}

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
                        Select Dining Time
                    </option>

                    <option value="Breakfast">
                        Breakfast
                    </option>

                    <option value="Lunch">
                        Lunch
                    </option>

                    <option value="Dinner">
                        Dinner
                    </option>

                    <option value="Snack">
                        Snack
                    </option>

                </select>


                {/* ==================================
                    DIFFICULTY
                =================================== */}

                <label>
                    Difficulty Level
                </label>

                <div className="difficulty">

                    <label>

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

                        Easy

                    </label>


                    <label>

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

                        Medium

                    </label>


                    <label>

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

                        Hard

                    </label>

                </div>


                {/* ==================================
                    INGREDIENTS
                =================================== */}

                <label>
                    Ingredients
                </label>

                <textarea
                    rows="6"
                    value={ingredients}
                    placeholder="Example: Chicken, Rice, Onion, Salt"
                    onChange={(event) =>
                        setIngredients(
                            event.target.value
                        )
                    }
                />


                {/* ==================================
                    PREPARATION STEPS
                =================================== */}

                <label>
                    Preparation Steps
                </label>

                <textarea
                    rows="8"
                    value={steps}
                    placeholder={
                        "Enter each step on a new line.\nExample:\nWash the rice\nCut the vegetables\nCook the rice"
                    }
                    onChange={(event) =>
                        setSteps(
                            event.target.value
                        )
                    }
                />


                {/* ==================================
                    IMAGE
                =================================== */}

                <label>
                    Recipe Image URL
                </label>

                <input
                    type="text"
                    placeholder="Enter image URL"
                    value={image}
                    onChange={(event) =>
                        setImage(
                            event.target.value
                        )
                    }
                />


                {/* ==================================
                    BUTTONS
                =================================== */}

                <div className="buttons">

                    <button
                        type="submit"
                        className="update-btn"
                    >
                        Update Recipe
                    </button>


                    <button
                        type="button"
                        className="delete-btn"
                        onClick={deleteRecipe}
                    >
                        Delete Recipe
                    </button>


                    <button
                        type="button"
                        className="cancel-btn"
                        onClick={() =>
                            navigate("/myrecipes")
                        }
                    >
                        Cancel
                    </button>

                </div>

            </form>

        </div>

    );

}

export default EditRecipe;