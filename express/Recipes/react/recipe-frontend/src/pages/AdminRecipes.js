import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// CSS is inside src/css/
import "../css/AdminRecipes.css";

function AdminRecipes() {
    // ======================================================
    // STATES
    // ======================================================

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    // ======================================================
    // GET ADMIN TOKEN
    // ======================================================

    const adminToken = localStorage.getItem("adminToken");

    // ======================================================
    // LOAD RECIPES
    // ======================================================

    const loadRecipes = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            // Check admin login
            if (!adminToken) {
                navigate("/adminLogin");
                return;
            }

            // Axios configuration
            const config = {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            };

            // ==================================================
            // GET ALL RECIPES
            // ==================================================

            const response = await axios.get(
                "https://recipe-sharing-platform-2-nhqu.onrender.com/api/admin/recipes",
                config
            );

            console.log("Admin Recipes Response:", response.data);

            // ==================================================
            // SAVE RECIPES
            // ==================================================

            if (
                response.data &&
                Array.isArray(response.data.recipes)
            ) {
                setRecipes(response.data.recipes);
            } else {
                setRecipes([]);
            }

        } catch (error) {
            console.error("Admin Recipes Error:", error);

            // ==================================================
            // TOKEN EXPIRED / INVALID
            // ==================================================

            if (
                error.response &&
                (
                    error.response.status === 401 ||
                    error.response.status === 403
                )
            ) {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("admin");

                alert("Admin session expired. Please login again.");

                navigate("/adminLogin");
                return;
            }

            // ==================================================
            // BACKEND ERROR
            // ==================================================

            if (error.response) {
                setErrorMessage(
                    error.response.data?.message ||
                    "Unable to load recipes."
                );
            }

            // ==================================================
            // BACKEND NOT RUNNING
            // ==================================================

            else if (error.request) {
                setErrorMessage(
                    "Unable to connect to backend. Please make sure the server is running on port 5000."
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

    }, [adminToken, navigate]);

    // ======================================================
    // USE EFFECT
    // ======================================================

    useEffect(() => {
        loadRecipes();
    }, [loadRecipes]);

    // ======================================================
    // DELETE RECIPE
    // ======================================================

    const deleteRecipe = async (recipeId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this recipe?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            };

            // ==================================================
            // DELETE API
            // ==================================================

            await axios.delete(
                `https://recipe-sharing-platform-2-nhqu.onrender.com/api/admin/recipes/${recipeId}`,
                config
            );

            alert("Recipe deleted successfully.");

            // ==================================================
            // REMOVE RECIPE FROM SCREEN
            // ==================================================

            setRecipes((previousRecipes) =>
                previousRecipes.filter(
                    (recipe) => recipe._id !== recipeId
                )
            );

        } catch (error) {
            console.error("Delete Recipe Error:", error);

            // ==================================================
            // TOKEN ERROR
            // ==================================================

            if (
                error.response &&
                (
                    error.response.status === 401 ||
                    error.response.status === 403
                )
            ) {
                localStorage.removeItem("adminToken");
                localStorage.removeItem("admin");

                alert("Admin session expired. Please login again.");

                navigate("/adminLogin");
                return;
            }

            // ==================================================
            // DELETE ERROR
            // ==================================================

            alert(
                error.response?.data?.message ||
                "Unable to delete recipe."
            );
        }
    };

    // ======================================================
    // LOGOUT
    // ======================================================

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/adminLogin");
    };

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="admin-recipes-loading">
                <h2>Loading Recipes...</h2>
            </div>
        );
    }

    // ======================================================
    // PAGE
    // ======================================================

    return (
        <div className="admin-recipes-page">

            {/* ==================================================
                HEADER
            ================================================== */}

            <div className="admin-recipes-header">

                <div>
                    <h1>👨‍🍳 RecipeHub Admin</h1>

                    <p>
                        Manage all recipes
                    </p>
                </div>

                <button
                    className="admin-logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

            {/* ==================================================
                NAVIGATION
            ================================================== */}

            <div className="admin-recipes-navigation">

                <Link to="/adminDashboard">
                    <button>
                        📊 Dashboard
                    </button>
                </Link>

                <Link to="/adminUsers">
                    <button>
                        👥 Manage Users
                    </button>
                </Link>

                <Link to="/adminRecipes">
                    <button className="active">
                        🍴 Manage Recipes
                    </button>
                </Link>

            </div>

            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {errorMessage && (
                <div className="admin-recipes-error">
                    <strong>Error:</strong>{" "}
                    {errorMessage}
                </div>
            )}

            {/* ==================================================
                TITLE
            ================================================== */}

            <div className="admin-recipes-title">

                <div>
                    <h2>🍴 Manage Recipes</h2>

                    <p>
                        Total Recipes:{" "}
                        <strong>
                            {recipes.length}
                        </strong>
                    </p>
                </div>

            </div>

            {/* ==================================================
                NO RECIPES
            ================================================== */}

            {recipes.length === 0 ? (

                <div className="no-recipes">

                    <h2>🍽️ No Recipes Found</h2>

                    <p>
                        There are currently no recipes available.
                    </p>

                </div>

            ) : (

                /* ==================================================
                   RECIPES TABLE
                ================================================== */

                <div className="recipes-table-container">

                    <table className="recipes-table">

                        <thead>
                            <tr>

                                <th>
                                    Image
                                </th>

                                <th>
                                    Recipe Name
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Difficulty
                                </th>

                                <th>
                                    Dining Time
                                </th>

                                <th>
                                    Created By
                                </th>

                                <th>
                                    Action
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {recipes.map((recipe) => (

                                <tr key={recipe._id}>

                                    {/* IMAGE */}

                                    <td>

                                        {recipe.image ? (

                                            <img
                                                src={
                                                    recipe.image.startsWith("http")
                                                        ? recipe.image
                                                        : `https://recipe-sharing-platform-2-nhqu.onrender.com/${recipe.image}`
                                                }
                                                alt={
                                                    recipe.recipeName ||
                                                    "Recipe"
                                                }
                                                className="recipe-admin-image"
                                            />

                                        ) : (

                                            <div className="no-image">
                                                🍴
                                            </div>

                                        )}

                                    </td>

                                    {/* RECIPE NAME */}

                                    <td>
                                        <strong>
                                            {recipe.recipeName ||
                                                "N/A"}
                                        </strong>
                                    </td>

                                    {/* CATEGORY */}

                                    <td>
                                        {recipe.category ||
                                            "N/A"}
                                    </td>

                                    {/* DIFFICULTY */}

                                    <td>

                                        <span
                                            className={
                                                `difficulty-badge ${
                                                    recipe.difficulty
                                                        ?.toLowerCase() ||
                                                    "unknown"
                                                }`
                                            }
                                        >
                                            {recipe.difficulty ||
                                                "N/A"}
                                        </span>

                                    </td>

                                    {/* DINING TIME */}

                                    <td>
                                        {recipe.diningTime ||
                                            recipe.cookingTime ||
                                            "N/A"}
                                    </td>

                                    {/* CREATED BY */}

                                    <td>
                                        {recipe.userId?.name ||
                                            recipe.userId?.fullname ||
                                            recipe.userId?.email ||
                                            "Unknown"}
                                    </td>

                                    {/* DELETE */}

                                    <td>

                                        <button
                                            className="delete-recipe-btn"
                                            onClick={() =>
                                                deleteRecipe(
                                                    recipe._id
                                                )
                                            }
                                        >
                                            🗑️ Delete
                                        </button>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div className="admin-recipes-footer">

                <p>
                    RecipeHub Admin Panel
                </p>

            </div>

        </div>
    );
}

export default AdminRecipes;