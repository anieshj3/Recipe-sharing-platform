import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import "../css/AdminUsers.css";

function AdminUsers() {

    // ======================================================
    // STATES
    // ======================================================

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();


    // ======================================================
    // GET ADMIN TOKEN
    // ======================================================

    const adminToken =
        localStorage.getItem("adminToken");


    // ======================================================
    // LOAD USERS
    // ======================================================

    useEffect(() => {

        const loadUsers = async () => {

            // Check admin login

            if (!adminToken) {

                navigate("/adminLogin");

                return;

            }


            try {

                setLoading(true);

                setErrorMessage("");


                // ==================================================
                // GET USERS FROM BACKEND
                // ==================================================

                const response = await axios.get(
                    "http://localhost:5000/api/admin/users",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${adminToken}`
                        }
                    }
                );


                console.log(
                    "Admin Users Response:",
                    response.data
                );


                // ==================================================
                // SAVE USERS
                // ==================================================

                if (
                    response.data &&
                    Array.isArray(response.data.users)
                ) {

                    setUsers(
                        response.data.users
                    );

                } else {

                    setUsers([]);

                }


            } catch (error) {

                console.error(
                    "Admin Users Error:",
                    error
                );


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
                        "Unable to load users."
                    );

                }

                // ==================================================
                // SERVER NOT RUNNING
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
                        "Something went wrong."
                    );

                }

            } finally {

                setLoading(false);

            }

        };


        loadUsers();

    }, [adminToken, navigate]);


    // ======================================================
    // DELETE USER
    // ======================================================

    const deleteUser = async (userId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this user? All recipes created by this user will also be deleted."
            );


        if (!confirmDelete) {

            return;

        }


        try {

            // ==================================================
            // DELETE USER API
            // ==================================================

            await axios.delete(
                `http://localhost:5000/api/admin/users/${userId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${adminToken}`
                    }
                }
            );


            // ==================================================
            // REMOVE USER FROM SCREEN
            // ==================================================

            setUsers(
                (previousUsers) =>
                    previousUsers.filter(
                        (user) =>
                            user._id !== userId
                    )
            );


            alert(
                "User deleted successfully."
            );


        } catch (error) {

            console.error(
                "Delete User Error:",
                error
            );


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

                localStorage.removeItem(
                    "adminToken"
                );

                localStorage.removeItem(
                    "admin"
                );

                navigate("/adminLogin");

                return;

            }


            // ==================================================
            // ERROR MESSAGE
            // ==================================================

            alert(
                error.response?.data?.message ||
                "Unable to delete user."
            );

        }

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

            <div className="admin-users-loading">

                <div className="loading-box">

                    <div className="loading-spinner"></div>

                    <h2>
                        Loading Users...
                    </h2>

                </div>

            </div>

        );

    }


    // ======================================================
    // PAGE
    // ======================================================

    return (

        <div className="admin-users-page">


            {/* ==================================================
                HEADER
            ================================================== */}

            <header className="admin-users-header">


                <div className="admin-users-logo">

                    👨‍🍳 RecipeHub

                </div>


                <nav className="admin-users-nav">

                    <Link to="/adminDashboard">
                        Dashboard
                    </Link>


                    <Link
                        to="/adminUsers"
                        className="active"
                    >
                        Users
                    </Link>


                    <Link to="/adminRecipes">
                        Recipes
                    </Link>


                    <button
                        type="button"
                        onClick={handleLogout}
                        className="admin-users-logout"
                    >
                        Logout
                    </button>

                </nav>

            </header>


            {/* ==================================================
                MAIN CONTENT
            ================================================== */}

            <main className="admin-users-main">


                {/* ==================================================
                    PAGE TITLE
                ================================================== */}

                <div className="admin-users-title">

                    <div>

                        <h1>
                            👥 Manage Users
                        </h1>

                        <p>
                            View and manage RecipeHub users.
                        </p>

                    </div>


                    <div className="user-count">

                        <span>
                            Total Users
                        </span>

                        <strong>
                            {users.length}
                        </strong>

                    </div>

                </div>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {errorMessage && (

                    <div className="admin-users-error">

                        <strong>
                            Error:
                        </strong>

                        {" "}

                        {errorMessage}

                    </div>

                )}


                {/* ==================================================
                    USERS TABLE
                ================================================== */}

                <div className="users-table-container">


                    {users.length === 0 ? (

                        <div className="no-users">

                            <div className="no-users-icon">
                                👥
                            </div>

                            <h2>
                                No Users Found
                            </h2>

                            <p>
                                There are currently no registered users.
                            </p>

                        </div>

                    ) : (

                        <table className="users-table">

                            <thead>

                                <tr>

                                    <th>
                                        #
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Created
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {users.map(
                                    (user, index) => (

                                        <tr
                                            key={
                                                user._id
                                            }
                                        >

                                            {/* NUMBER */}

                                            <td>
                                                {index + 1}
                                            </td>


                                            {/* NAME */}

                                            <td>

                                                <div className="user-name">

                                                    <div className="user-avatar">

                                                        {(
                                                            user.name ||
                                                            user.fullname ||
                                                            "U"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}

                                                    </div>


                                                    <span>

                                                        {
                                                            user.name ||
                                                            user.fullname ||
                                                            "Unknown User"
                                                        }

                                                    </span>

                                                </div>

                                            </td>


                                            {/* EMAIL */}

                                            <td>
                                                {user.email ||
                                                    "N/A"}
                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        user.status ===
                                                        "Inactive"
                                                            ? "status inactive"
                                                            : "status active"
                                                    }
                                                >

                                                    {user.status ||
                                                        "Active"}

                                                </span>

                                            </td>


                                            {/* CREATED DATE */}

                                            <td>

                                                {user.createdAt
                                                    ? new Date(
                                                        user.createdAt
                                                    ).toLocaleDateString()
                                                    : "N/A"}

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                <button
                                                    type="button"
                                                    className="delete-user-btn"
                                                    onClick={() =>
                                                        deleteUser(
                                                            user._id
                                                        )
                                                    }
                                                >
                                                    🗑 Delete
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
                    BACK TO DASHBOARD
                ================================================== */}

                <div className="back-dashboard">

                    <Link to="/adminDashboard">

                        ← Back to Admin Dashboard

                    </Link>

                </div>


            </main>

        </div>

    );

}

export default AdminUsers;