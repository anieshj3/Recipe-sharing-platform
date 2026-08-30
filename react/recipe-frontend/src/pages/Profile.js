import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/Profile.css";

function Profile() {
    const [user, setUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // ==================================================
    // DEFAULT PROFILE IMAGE
    // ==================================================

    const defaultProfileImage =
        "https://ui-avatars.com/api/?name=Recipe+User&size=300&background=d35400&color=fff";

    // ==================================================
    // GET PROFILE
    // ==================================================

    useEffect(() => {
        const getProfile = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                setLoading(true);

                const response = await axios.get(
                    "https://recipe-sharing-platform-2-nhqu.onrender.com/api/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("Profile Response:", response.data);

                const profileUser = response.data?.user;

                if (!profileUser) {
                    setErrorMessage("User profile was not found.");
                    return;
                }

                setUser(profileUser);

                // Save latest user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(profileUser)
                );

            } catch (error) {
                console.error(
                    "Error fetching profile:",
                    error
                );

                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");
                    return;
                }

                setErrorMessage(
                    error.response?.data?.message ||
                    "Unable to load your profile."
                );

            } finally {
                setLoading(false);
            }
        };

        getProfile();
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
    // EDIT PROFILE
    // ==================================================

    const editProfile = () => {
        if (user?._id) {
            navigate(`/editProfile/${user._id}`, {
                state: {
                    user: user,
                },
            });
        } else {
            navigate("/editProfile", {
                state: {
                    user: user,
                },
            });
        }
    };

    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {
        return (
            <div className="profile-page">

                <div className="profile-loading">

                    <div className="profile-spinner"></div>

                    <h2>
                        Loading Profile...
                    </h2>

                    <p>
                        Please wait a moment.
                    </p>

                </div>

            </div>
        );
    }

    // ==================================================
    // ERROR
    // ==================================================

    if (errorMessage) {
        return (
            <div className="profile-page">

                <div className="profile-error">

                    <div className="error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Unable to Load Profile
                    </h2>

                    <p>
                        {errorMessage}
                    </p>

                    <button
                        className="primary-btn"
                        onClick={() => navigate("/login")}
                    >
                        Go to Login
                    </button>

                </div>

            </div>
        );
    }

    // ==================================================
    // PROFILE PAGE
    // ==================================================

    return (
        <div className="profile-page">

            {/* ==================================================
                TOP NAVIGATION
            ================================================== */}

            <div className="profile-topbar">

                <button
                    className="dashboard-link"
                    onClick={() => navigate("/dashboard")}
                >
                    ← Dashboard
                </button>

                <span className="profile-brand">
                    🍴 RECIPE SHARE
                </span>

            </div>


            {/* ==================================================
                MAIN PROFILE CONTAINER
            ================================================== */}

            <div className="profile-container">

                {/* ==================================================
                    PROFILE HERO
                ================================================== */}

                <section className="profile-hero">

                    <div className="profile-image-container">

                        <img
                            src={
                                user?.profileImage ||
                                defaultProfileImage
                            }
                            alt="Profile"
                            className="profile-img"
                            onError={(event) => {
                                event.target.onerror = null;
                                event.target.src =
                                    defaultProfileImage;
                            }}
                        />

                        <div className="profile-status-dot">
                            ✓
                        </div>

                    </div>


                    <div className="profile-introduction">

                        <span className="profile-label">
                            MY PROFILE
                        </span>

                        <h1>
                            {user?.name || "Recipe User"}
                        </h1>

                        <p>
                            {user?.bio ||
                                "Welcome to your Recipe Share profile."}
                        </p>

                        <span className="active-badge">
                            ● {user?.status || "Active"}
                        </span>

                    </div>


                    <button
                        className="hero-edit-btn"
                        onClick={editProfile}
                    >
                        ✏️ Edit Profile
                    </button>

                </section>


                {/* ==================================================
                    PERSONAL INFORMATION
                ================================================== */}

                <section className="profile-section">

                    <div className="section-title">

                        <div className="section-icon">
                            👤
                        </div>

                        <div>
                            <h2>
                                Personal Information
                            </h2>

                            <p>
                                Your basic account information
                            </p>
                        </div>

                    </div>


                    <div className="profile-grid">

                        <div className="profile-info-card">

                            <span className="info-label">
                                Full Name
                            </span>

                            <strong>
                                {user?.name || "Not provided"}
                            </strong>

                        </div>


                        <div className="profile-info-card">

                            <span className="info-label">
                                Email Address
                            </span>

                            <strong>
                                {user?.email || "Not provided"}
                            </strong>

                        </div>


                        <div className="profile-info-card">

                            <span className="info-label">
                                Gender
                            </span>

                            <strong>
                                {user?.gender || "Not provided"}
                            </strong>

                        </div>


                        <div className="profile-info-card">

                            <span className="info-label">
                                Date of Birth
                            </span>

                            <strong>
                                {user?.dob
                                    ? new Date(
                                        user.dob
                                    ).toLocaleDateString()
                                    : "Not provided"}
                            </strong>

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    ACCOUNT INFORMATION
                ================================================== */}

                <section className="profile-section">

                    <div className="section-title">

                        <div className="section-icon">
                            🔐
                        </div>

                        <div>
                            <h2>
                                Account Information
                            </h2>

                            <p>
                                Your account details and settings
                            </p>
                        </div>

                    </div>


                    <div className="account-grid">

                        <div className="account-card">

                            <div className="account-card-icon">
                                👨‍🍳
                            </div>

                            <div>
                                <span>
                                    Account Role
                                </span>

                                <strong>
                                    {user?.role || "User"}
                                </strong>
                            </div>

                        </div>


                        <div className="account-card">

                            <div className="account-card-icon">
                                🟢
                            </div>

                            <div>
                                <span>
                                    Account Status
                                </span>

                                <strong>
                                    {user?.status || "Active"}
                                </strong>
                            </div>

                        </div>


                        <div className="account-card">

                            <div className="account-card-icon">
                                📅
                            </div>

                            <div>
                                <span>
                                    Member Since
                                </span>

                                <strong>
                                    {user?.createdAt
                                        ? new Date(
                                            user.createdAt
                                        ).toLocaleDateString()
                                        : "Not available"}
                                </strong>
                            </div>

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <section className="profile-actions">

                    <button
                        className="action-btn edit-action"
                        onClick={editProfile}
                    >
                        <span>
                            ✏️
                        </span>

                        <div>
                            <strong>
                                Edit Profile
                            </strong>

                            <small>
                                Update your personal information
                            </small>
                        </div>
                    </button>


                    <button
                        className="action-btn password-action"
                        onClick={() =>
                            navigate("/changePassword")
                        }
                    >
                        <span>
                            🔐
                        </span>

                        <div>
                            <strong>
                                Change Password
                            </strong>

                            <small>
                                Keep your account secure
                            </small>
                        </div>
                    </button>


                    <button
                        className="action-btn logout-action"
                        onClick={logout}
                    >
                        <span>
                            🚪
                        </span>

                        <div>
                            <strong>
                                Logout
                            </strong>

                            <small>
                                Sign out of your account
                            </small>
                        </div>
                    </button>

                </section>

            </div>

        </div>
    );
}

export default Profile;

