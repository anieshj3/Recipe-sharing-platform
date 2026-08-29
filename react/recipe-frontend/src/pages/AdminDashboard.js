import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Link,
    useNavigate
} from "react-router-dom";


function AdminDashboard() {

    // ======================================================
    // STATES
    // ======================================================

    const [statistics, setStatistics] = useState({
        totalUsers: 0,
        totalRecipes: 0,
        totalAdmins: 0,
        activeUsers: 0
    });

    const [users, setUsers] = useState([]);

    const [recipes, setRecipes] = useState([]);

    const [admin, setAdmin] = useState(null);

    const [loading, setLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");

    const [actionLoading, setActionLoading] = useState(null);

    const navigate = useNavigate();


    // ======================================================
    // GET ADMIN TOKEN
    // ======================================================

    const adminToken =
        localStorage.getItem("adminToken");


    // ======================================================
    // AXIOS CONFIG
    // ======================================================

    const getConfig = () => {

        return {
            headers: {
                Authorization:
                    `Bearer ${adminToken}`
            }
        };

    };


    // ======================================================
    // LOAD DASHBOARD
    // ======================================================

    const loadDashboard = useCallback(
        async () => {

            if (!adminToken) {

                navigate("/adminLogin");

                return;

            }

            try {

                setLoading(true);

                setErrorMessage("");


                // ==================================================
                // DASHBOARD STATISTICS
                // ==================================================

                const dashboardResponse =
                    await axios.get(
                        "http://localhost:5000/api/admin/dashboard",
                        getConfig()
                    );


                console.log(
                    "Dashboard Response:",
                    dashboardResponse.data
                );


                if (
                    dashboardResponse.data &&
                    dashboardResponse.data.statistics
                ) {

                    setStatistics(
                        dashboardResponse.data.statistics
                    );

                }


                // ==================================================
                // GET USERS
                // ==================================================

                const usersResponse =
                    await axios.get(
                        "http://localhost:5000/api/admin/users",
                        getConfig()
                    );


                console.log(
                    "Users Response:",
                    usersResponse.data
                );


                if (
                    usersResponse.data &&
                    Array.isArray(
                        usersResponse.data.users
                    )
                ) {

                    setUsers(
                        usersResponse.data.users
                    );

                } else {

                    setUsers([]);

                }


                // ==================================================
                // GET RECIPES
                // ==================================================

                const recipesResponse =
                    await axios.get(
                        "http://localhost:5000/api/admin/recipes",
                        getConfig()
                    );


                console.log(
                    "Recipes Response:",
                    recipesResponse.data
                );


                if (
                    recipesResponse.data &&
                    Array.isArray(
                        recipesResponse.data.recipes
                    )
                ) {

                    setRecipes(
                        recipesResponse.data.recipes
                    );

                } else {

                    setRecipes([]);

                }

            } catch (error) {

                console.error(
                    "Admin Dashboard Error:",
                    error
                );


                // ==================================================
                // TOKEN EXPIRED
                // ==================================================

                if (
                    error.response &&
                    (
                        error.response.status === 401 ||
                        error.response.status === 403
                    )
                ) {

                    localStorage.removeItem(
                        "adminToken"
                    );

                    localStorage.removeItem(
                        "admin"
                    );


                    alert(
                        "Admin session expired. Please login again."
                    );


                    navigate("/adminLogin");

                    return;

                }


                // ==================================================
                // BACKEND ERROR
                // ==================================================

                if (error.response) {

                    setErrorMessage(
                        error.response.data?.message ||
                        "Unable to load admin dashboard."
                    );

                }

                // ==================================================
                // BACKEND NOT RUNNING
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

        },
        [adminToken, navigate]
    );


    // ======================================================
    // USE EFFECT
    // ======================================================

    useEffect(() => {

        if (!adminToken) {

            navigate("/adminLogin");

            return;

        }


        // ==================================================
        // GET SAVED ADMIN
        // ==================================================

        const savedAdmin =
            localStorage.getItem("admin");


        if (savedAdmin) {

            try {

                setAdmin(
                    JSON.parse(savedAdmin)
                );

            } catch (error) {

                console.error(
                    "Invalid admin information:",
                    error
                );

                localStorage.removeItem(
                    "admin"
                );

            }

        }


        // ==================================================
        // LOAD DASHBOARD
        // ==================================================

        loadDashboard();

    }, [
        adminToken,
        navigate,
        loadDashboard
    ]);


    // ======================================================
    // DELETE USER
    // ======================================================

    const deleteUser = async (userId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this user? Their recipes will also be deleted."
            );


        if (!confirmDelete) {

            return;

        }


        try {

            setActionLoading(
                `user-delete-${userId}`
            );


            await axios.delete(
                `http://localhost:5000/api/admin/users/${userId}`,
                getConfig()
            );


            alert(
                "User deleted successfully."
            );


            await loadDashboard();

        } catch (error) {

            console.error(
                "Delete User Error:",
                error
            );


            if (
                error.response &&
                (
                    error.response.status === 401 ||
                    error.response.status === 403
                )
            ) {

                localStorage.removeItem(
                    "adminToken"
                );

                localStorage.removeItem(
                    "admin"
                );

                navigate("/adminLogin");

                return;

            }


            alert(
                error.response?.data?.message ||
                "Unable to delete user."
            );

        } finally {

            setActionLoading(null);

        }

    };


    // ======================================================
    // DELETE RECIPE
    // ======================================================

    const deleteRecipe = async (recipeId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this recipe?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            setActionLoading(
                `delete-${recipeId}`
            );


            await axios.delete(
                `http://localhost:5000/api/admin/recipes/${recipeId}`,
                getConfig()
            );


            alert(
                "Recipe deleted successfully."
            );


            await loadDashboard();

        } catch (error) {

            console.error(
                "Delete Recipe Error:",
                error
            );


            if (
                error.response &&
                (
                    error.response.status === 401 ||
                    error.response.status === 403
                )
            ) {

                localStorage.removeItem(
                    "adminToken"
                );

                localStorage.removeItem(
                    "admin"
                );

                navigate("/adminLogin");

                return;

            }


            alert(
                error.response?.data?.message ||
                "Unable to delete recipe."
            );

        } finally {

            setActionLoading(null);

        }

    };


    // ======================================================
    // BLOCK RECIPE
    // ======================================================

    const blockRecipe = async (recipeId) => {

        const confirmBlock =
            window.confirm(
                "Are you sure you want to block this recipe?"
            );


        if (!confirmBlock) {

            return;

        }


        try {

            setActionLoading(
                `block-${recipeId}`
            );


            const response =
                await axios.put(
                    `http://localhost:5000/api/admin/recipes/${recipeId}/block`,
                    {},
                    getConfig()
                );


            console.log(
                "Block Recipe Response:",
                response.data
            );


            alert(
                response.data?.message ||
                "Recipe blocked successfully."
            );


            await loadDashboard();

        } catch (error) {

            console.error(
                "Block Recipe Error:",
                error
            );


            if (
                error.response &&
                (
                    error.response.status === 401 ||
                    error.response.status === 403
                )
            ) {

                localStorage.removeItem(
                    "adminToken"
                );

                localStorage.removeItem(
                    "admin"
                );

                navigate("/adminLogin");

                return;

            }


            alert(
                error.response?.data?.message ||
                "Unable to block recipe."
            );

        } finally {

            setActionLoading(null);

        }

    };


    // ======================================================
    // UNBLOCK RECIPE
    // ======================================================

    const unblockRecipe = async (recipeId) => {

        const confirmUnblock =
            window.confirm(
                "Are you sure you want to unblock this recipe?"
            );


        if (!confirmUnblock) {

            return;

        }


        try {

            setActionLoading(
                `unblock-${recipeId}`
            );


            const response =
                await axios.put(
                    `http://localhost:5000/api/admin/recipes/${recipeId}/unblock`,
                    {},
                    getConfig()
                );


            console.log(
                "Unblock Recipe Response:",
                response.data
            );


            alert(
                response.data?.message ||
                "Recipe unblocked successfully."
            );


            await loadDashboard();

        } catch (error) {

            console.error(
                "Unblock Recipe Error:",
                error
            );


            if (
                error.response &&
                (
                    error.response.status === 401 ||
                    error.response.status === 403
                )
            ) {

                localStorage.removeItem(
                    "adminToken"
                );

                localStorage.removeItem(
                    "admin"
                );

                navigate("/adminLogin");

                return;

            }


            alert(
                error.response?.data?.message ||
                "Unable to unblock recipe."
            );

        } finally {

            setActionLoading(null);

        }

    };


    // ======================================================
    // VIEW RECIPE
    // ======================================================

    const viewRecipe = (recipe) => {

        // --------------------------------------------------
        // Check if recipe is blocked
        // --------------------------------------------------

        if (
            recipe.isBlocked === true ||
            recipe.status === "Blocked" ||
            recipe.status === "blocked"
        ) {

            alert(
                "This recipe is currently blocked."
            );

            return;

        }


        // --------------------------------------------------
        // Navigate to recipe details
        // --------------------------------------------------

        navigate(
            `/recipe/${recipe._id}`,
            {
                state: {
                    recipe: recipe
                }
            }
        );

    };


    // ======================================================
    // LOGOUT
    // ======================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "adminToken"
        );

        localStorage.removeItem(
            "admin"
        );

        navigate("/adminLogin");

    };


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

        return (

            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f5f5f5"
                }}
            >

                <h2>
                    Loading Admin Dashboard...
                </h2>

            </div>

        );

    }


    // ======================================================
    // PAGE
    // ======================================================

    return (

        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
                padding: "30px"
            }}
        >


            {/* ==================================================
                HEADER
            ================================================== */}

            <div
                style={{
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "25px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "15px"
                }}
            >

                <div>

                    <h1>
                        👨‍🍳 RecipeHub Admin Dashboard
                    </h1>

                    {admin && (

                        <p>
                            Welcome,{" "}
                            <strong>
                                {admin.name}
                            </strong>
                        </p>

                    )}

                </div>


                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        border: "none",
                        padding: "12px 20px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Logout
                </button>

            </div>


            {/* ==================================================
                ADMIN NAVIGATION
            ================================================== */}

            <div
                style={{
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "30px",
                    display: "flex",
                    gap: "15px",
                    flexWrap: "wrap"
                }}
            >

                <Link
                    to="/adminDashboard"
                    style={{
                        textDecoration: "none"
                    }}
                >

                    <button
                        style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            padding: "12px 20px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        📊 Dashboard
                    </button>

                </Link>


                <Link
                    to="/adminUsers"
                    style={{
                        textDecoration: "none"
                    }}
                >

                    <button
                        style={{
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            padding: "12px 20px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        👥 Manage Users
                    </button>

                </Link>


                <Link
                    to="/adminRecipes"
                    style={{
                        textDecoration: "none"
                    }}
                >

                    <button
                        style={{
                            backgroundColor: "#ff9800",
                            color: "white",
                            border: "none",
                            padding: "12px 20px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        🍴 Manage Recipes
                    </button>

                </Link>

            </div>


            {/* ==================================================
                ERROR MESSAGE
            ================================================== */}

            {errorMessage && (

                <div
                    style={{
                        backgroundColor: "#ffe6e6",
                        color: "#cc0000",
                        padding: "15px",
                        borderRadius: "8px",
                        marginBottom: "20px"
                    }}
                >

                    <strong>
                        Error:
                    </strong>{" "}

                    {errorMessage}

                </div>

            )}


            {/* ==================================================
                STATISTICS
            ================================================== */}

            <h2>
                📊 Statistics
            </h2>


            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "20px",
                    marginBottom: "40px"
                }}
            >

                <div style={statCard}>

                    <h3>
                        👥 Total Users
                    </h3>

                    <h1>
                        {statistics.totalUsers}
                    </h1>

                </div>


                <div style={statCard}>

                    <h3>
                        🍴 Total Recipes
                    </h3>

                    <h1>
                        {statistics.totalRecipes}
                    </h1>

                </div>


                <div style={statCard}>

                    <h3>
                        👨‍💼 Total Admins
                    </h3>

                    <h1>
                        {statistics.totalAdmins}
                    </h1>

                </div>


                <div style={statCard}>

                    <h3>
                        ✅ Active Users
                    </h3>

                    <h1>
                        {statistics.activeUsers}
                    </h1>

                </div>

            </div>


            {/* ==================================================
                MANAGE USERS
            ================================================== */}

            <div
                style={{
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "40px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "15px"
                    }}
                >

                    <div>

                        <h2>
                            👥 Manage Users
                        </h2>

                        <p>
                            Total registered users:{" "}
                            <strong>
                                {users.length}
                            </strong>
                        </p>

                    </div>


                    <Link
                        to="/adminUsers"
                        style={{
                            textDecoration: "none"
                        }}
                    >

                        <button
                            style={{
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                padding: "12px 20px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            👥 Open Manage Users
                        </button>

                    </Link>

                </div>

            </div>


            {/* ==================================================
                RECENT USERS
            ================================================== */}

            <h2>
                👥 Recent Users
            </h2>


            <div
                style={{
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "40px",
                    overflowX: "auto"
                }}
            >

                {users.length === 0 ? (

                    <p>
                        No users found.
                    </p>

                ) : (

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >

                        <thead>

                            <tr>

                                <th style={tableHeader}>
                                    Name
                                </th>

                                <th style={tableHeader}>
                                    Email
                                </th>

                                <th style={tableHeader}>
                                    Status
                                </th>

                                <th style={tableHeader}>
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {users
                                .slice(0, 5)
                                .map(
                                    (user) => (

                                        <tr
                                            key={user._id}
                                        >

                                            <td style={tableCell}>
                                                {user.name ||
                                                    user.fullname ||
                                                    "N/A"}
                                            </td>

                                            <td style={tableCell}>
                                                {user.email ||
                                                    "N/A"}
                                            </td>

                                            <td style={tableCell}>
                                                {user.status ||
                                                    "Active"}
                                            </td>

                                            <td style={tableCell}>

                                                <button
                                                    onClick={() =>
                                                        deleteUser(
                                                            user._id
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        `user-delete-${user._id}`
                                                    }
                                                    style={{
                                                        backgroundColor:
                                                            "#dc3545",
                                                        color:
                                                            "white",
                                                        border:
                                                            "none",
                                                        padding:
                                                            "8px 15px",
                                                        borderRadius:
                                                            "5px",
                                                        cursor:
                                                            "pointer"
                                                    }}
                                                >

                                                    {actionLoading ===
                                                    `user-delete-${user._id}`
                                                        ? "Deleting..."
                                                        : "Delete"}

                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )}

                        </tbody>

                    </table>

                )}

            </div>


            {/* ==================================================
                MANAGE RECIPES
            ================================================== */}

            <div
                style={{
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "40px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "15px"
                    }}
                >

                    <div>

                        <h2>
                            🍴 Manage Recipes
                        </h2>

                        <p>
                            Total recipes:{" "}
                            <strong>
                                {recipes.length}
                            </strong>
                        </p>

                    </div>


                    <Link
                        to="/adminRecipes"
                        style={{
                            textDecoration: "none"
                        }}
                    >

                        <button
                            style={{
                                backgroundColor: "#ff9800",
                                color: "white",
                                border: "none",
                                padding: "12px 20px",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            🍴 Open Manage Recipes
                        </button>

                    </Link>

                </div>

            </div>


            {/* ==================================================
                RECENT RECIPES
            ================================================== */}

            <h2>
                🍴 Recent Recipes
            </h2>


            <div
                style={{
                    backgroundColor: "#ffffff",
                    padding: "20px",
                    borderRadius: "10px",
                    marginBottom: "40px",
                    overflowX: "auto"
                }}
            >

                {recipes.length === 0 ? (

                    <p>
                        No recipes found.
                    </p>

                ) : (

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "1000px"
                        }}
                    >

                        <thead>

                            <tr>

                                <th style={tableHeader}>
                                    Image
                                </th>

                                <th style={tableHeader}>
                                    Recipe Name
                                </th>

                                <th style={tableHeader}>
                                    Category
                                </th>

                                <th style={tableHeader}>
                                    Difficulty
                                </th>

                                <th style={tableHeader}>
                                    Created By
                                </th>

                                <th style={tableHeader}>
                                    Status
                                </th>

                                <th style={tableHeader}>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {recipes
                                .slice(0, 5)
                                .map(
                                    (recipe) => {

                                        const isBlocked =
                                            recipe.isBlocked === true ||
                                            recipe.status === "Blocked" ||
                                            recipe.status === "blocked";


                                        return (

                                            <tr
                                                key={
                                                    recipe._id
                                                }
                                                style={{
                                                    backgroundColor:
                                                        isBlocked
                                                            ? "#fff1f1"
                                                            : "#ffffff"
                                                }}
                                            >

                                                {/* IMAGE */}

                                                <td
                                                    style={
                                                        tableCell
                                                    }
                                                >

                                                    <img
                                                        src={
                                                            recipe.image ||
                                                            "https://placehold.co/100x70?text=No+Image"
                                                        }
                                                        alt={
                                                            recipe.recipeName ||
                                                            "Recipe"
                                                        }
                                                        style={{
                                                            width: "90px",
                                                            height: "65px",
                                                            objectFit: "cover",
                                                            borderRadius: "6px",
                                                            border: "1px solid #ddd",
                                                            display: "block"
                                                        }}
                                                        onError={(
                                                            event
                                                        ) => {

                                                            event.currentTarget.src =
                                                                "https://placehold.co/100x70?text=No+Image";

                                                        }}
                                                    />

                                                </td>


                                                {/* RECIPE NAME */}

                                                <td
                                                    style={
                                                        tableCell
                                                    }
                                                >

                                                    <strong>
                                                        {
                                                            recipe.recipeName ||
                                                            "N/A"
                                                        }
                                                    </strong>

                                                </td>


                                                {/* CATEGORY */}

                                                <td
                                                    style={
                                                        tableCell
                                                    }
                                                >

                                                    {
                                                        recipe.category ||
                                                        "N/A"
                                                    }

                                                </td>


                                                {/* DIFFICULTY */}

                                                <td
                                                    style={
                                                        tableCell
                                                    }
                                                >

                                                    {
                                                        recipe.difficulty ||
                                                        "N/A"
                                                    }

                                                </td>


                                                {/* CREATED BY */}

                                                <td
                                                    style={
                                                        tableCell
                                                    }
                                                >

                                                    {
                                                        recipe.userId?.name ||
                                                        recipe.userId?.email ||
                                                        "Unknown"
                                                    }

                                                </td>


                                                {/* STATUS */}

                                                <td
                                                    style={
                                                        tableCell
                                                    }
                                                >

                                                    {isBlocked ? (

                                                        <span
                                                            style={{
                                                                display: "inline-block",
                                                                backgroundColor: "#dc3545",
                                                                color: "white",
                                                                padding: "6px 12px",
                                                                borderRadius: "20px",
                                                                fontSize: "13px",
                                                                fontWeight: "bold"
                                                            }}
                                                        >
                                                            🚫 Blocked
                                                        </span>

                                                    ) : (

                                                        <span
                                                            style={{
                                                                display: "inline-block",
                                                                backgroundColor: "#28a745",
                                                                color: "white",
                                                                padding: "6px 12px",
                                                                borderRadius: "20px",
                                                                fontSize: "13px",
                                                                fontWeight: "bold"
                                                            }}
                                                        >
                                                            ✅ Active
                                                        </span>

                                                    )}

                                                </td>


                                                {/* ACTIONS */}

                                                <td
                                                    style={
                                                        tableCell
                                                    }
                                                >

                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "8px",
                                                            flexWrap: "wrap"
                                                        }}
                                                    >

                                                        {/* VIEW */}

                                                        <button
                                                            onClick={() =>
                                                                viewRecipe(
                                                                    recipe
                                                                )
                                                            }
                                                            disabled={
                                                                isBlocked
                                                            }
                                                            style={{
                                                                backgroundColor:
                                                                    isBlocked
                                                                        ? "#aaa"
                                                                        : "#007bff",
                                                                color: "white",
                                                                border: "none",
                                                                padding: "8px 12px",
                                                                borderRadius: "5px",
                                                                cursor:
                                                                    isBlocked
                                                                        ? "not-allowed"
                                                                        : "pointer",
                                                                fontWeight: "bold"
                                                            }}
                                                        >
                                                            👁 View
                                                        </button>


                                                        {/* BLOCK / UNBLOCK */}

                                                        {isBlocked ? (

                                                            <button
                                                                onClick={() =>
                                                                    unblockRecipe(
                                                                        recipe._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    actionLoading ===
                                                                    `unblock-${recipe._id}`
                                                                }
                                                                style={{
                                                                    backgroundColor: "#28a745",
                                                                    color: "white",
                                                                    border: "none",
                                                                    padding: "8px 12px",
                                                                    borderRadius: "5px",
                                                                    cursor: "pointer",
                                                                    fontWeight: "bold"
                                                                }}
                                                            >

                                                                {actionLoading ===
                                                                `unblock-${recipe._id}`
                                                                    ? "Unblocking..."
                                                                    : "🔓 Unblock"}

                                                            </button>

                                                        ) : (

                                                            <button
                                                                onClick={() =>
                                                                    blockRecipe(
                                                                        recipe._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    actionLoading ===
                                                                    `block-${recipe._id}`
                                                                }
                                                                style={{
                                                                    backgroundColor: "#ffc107",
                                                                    color: "#212529",
                                                                    border: "none",
                                                                    padding: "8px 12px",
                                                                    borderRadius: "5px",
                                                                    cursor: "pointer",
                                                                    fontWeight: "bold"
                                                                }}
                                                            >

                                                                {actionLoading ===
                                                                `block-${recipe._id}`
                                                                    ? "Blocking..."
                                                                    : "🚫 Block"}

                                                            </button>

                                                        )}


                                                        {/* DELETE */}

                                                        <button
                                                            onClick={() =>
                                                                deleteRecipe(
                                                                    recipe._id
                                                                )
                                                            }
                                                            disabled={
                                                                actionLoading ===
                                                                `delete-${recipe._id}`
                                                            }
                                                            style={{
                                                                backgroundColor: "#dc3545",
                                                                color: "white",
                                                                border: "none",
                                                                padding: "8px 12px",
                                                                borderRadius: "5px",
                                                                cursor: "pointer",
                                                                fontWeight: "bold"
                                                            }}
                                                        >

                                                            {actionLoading ===
                                                            `delete-${recipe._id}`
                                                                ? "Deleting..."
                                                                : "🗑 Delete"}

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                        </tbody>

                    </table>

                )}

            </div>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <div
                style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "#666"
                }}
            >

                <p>
                    RecipeHub Admin Panel
                </p>

            </div>

        </div>

    );

}


// ======================================================
// STAT CARD STYLE
// ======================================================

const statCard = {

    backgroundColor: "#ffffff",

    padding: "25px",

    borderRadius: "10px",

    textAlign: "center",

    boxShadow:
        "0 2px 8px rgba(0,0,0,0.1)"

};


// ======================================================
// TABLE HEADER STYLE
// ======================================================

const tableHeader = {

    border: "1px solid #ddd",

    padding: "12px",

    backgroundColor: "#f0f0f0",

    textAlign: "left"

};


// ======================================================
// TABLE CELL STYLE
// ======================================================

const tableCell = {

    border: "1px solid #ddd",

    padding: "12px",

    verticalAlign: "middle"

};


// ======================================================
// EXPORT
// ======================================================

export default AdminDashboard;