import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/EditProfile.css";

function EditProfile() {

    const navigate = useNavigate();

    // =====================================================
    // STATES
    // =====================================================

    const [user, setUser] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [gender, setGender] = useState("Other");
    const [profileImage, setProfileImage] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    // =====================================================
    // DEFAULT IMAGE
    // =====================================================

    const defaultProfileImage =
        "https://ui-avatars.com/api/?name=User&size=200&background=6c63ff&color=fff";

    // =====================================================
    // GET PROFILE
    // =====================================================

    useEffect(() => {

        const getProfile = async () => {

            const token = localStorage.getItem("token");

            // -------------------------------------------------
            // CHECK LOGIN
            // -------------------------------------------------

            if (!token) {

                navigate("/login");

                return;
            }

            try {

                const response = await axios.get(
                    "http://localhost:5000/api/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log(
                    "Profile response:",
                    response.data
                );

                const profileUser =
                    response.data?.user;

                if (!profileUser) {

                    setErrorMessage(
                        "User information not found."
                    );

                    setLoading(false);

                    return;
                }

                // -------------------------------------------------
                // SAVE USER
                // -------------------------------------------------

                setUser(profileUser);

                // -------------------------------------------------
                // SET FORM VALUES
                // -------------------------------------------------

                setName(
                    profileUser.name || ""
                );

                setEmail(
                    profileUser.email || ""
                );

                setBio(
                    profileUser.bio || ""
                );

                setGender(
                    profileUser.gender || "Other"
                );

                setProfileImage(
                    profileUser.profileImage || ""
                );

                // -------------------------------------------------
                // UPDATE LOCAL STORAGE
                // -------------------------------------------------

                localStorage.setItem(
                    "user",
                    JSON.stringify(profileUser)
                );

            } catch (error) {

                console.error(
                    "Get Profile Error:",
                    error
                );

                if (
                    error.response?.status === 401
                ) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");

                    return;
                }

                setErrorMessage(
                    error.response?.data?.message ||
                    "Unable to load profile."
                );

            } finally {

                setLoading(false);

            }
        };

        getProfile();

    }, [navigate]);


    // =====================================================
    // IMAGE ERROR
    // =====================================================

    const handleImageError = (event) => {

        event.target.onerror = null;

        event.target.src =
            defaultProfileImage;
    };


    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    const updateProfile = async (event) => {

        event.preventDefault();

        setErrorMessage("");

        const token =
            localStorage.getItem("token");

        // -------------------------------------------------
        // CHECK TOKEN
        // -------------------------------------------------

        if (!token) {

            navigate("/login");

            return;
        }

        // -------------------------------------------------
        // CHECK USER
        // -------------------------------------------------

        if (!user?._id) {

            setErrorMessage(
                "User ID not found."
            );

            return;
        }

        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!name.trim()) {

            setErrorMessage(
                "Please enter your name."
            );

            return;
        }

        if (!email.trim()) {

            setErrorMessage(
                "Please enter your email."
            );

            return;
        }

        // -------------------------------------------------
        // EMAIL VALIDATION
        // -------------------------------------------------

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailPattern.test(
                email.trim()
            )
        ) {

            setErrorMessage(
                "Please enter a valid email address."
            );

            return;
        }

        // -------------------------------------------------
        // UPDATED DATA
        // -------------------------------------------------

        const updatedUser = {

            name: name.trim(),

            email: email.trim(),

            bio: bio.trim(),

            gender: gender,

            profileImage:
                profileImage.trim()

        };

        console.log(
            "Updating user:",
            updatedUser
        );

        try {

            setSaving(true);

            // -------------------------------------------------
            // UPDATE API
            // -------------------------------------------------

            const response =
                await axios.put(

                    `http://localhost:5000/api/updateprofile/${user._id}`,

                    updatedUser,

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
                "Update response:",
                response.data
            );

            // -------------------------------------------------
            // UPDATED USER
            // -------------------------------------------------

            const updatedUserData =
                response.data?.user;

            if (updatedUserData) {

                // Save updated user

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        updatedUserData
                    )
                );

            } else {

                // Fallback

                localStorage.setItem(

                    "user",

                    JSON.stringify({

                        ...user,

                        ...updatedUser

                    })

                );

            }

            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            alert(
                "Profile updated successfully! ✅"
            );

            navigate("/profile");

        } catch (error) {

            console.error(
                "Update Profile Error:",
                error
            );

            console.error(
                "Server response:",
                error.response?.data
            );

            // -------------------------------------------------
            // 401
            // -------------------------------------------------

            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem(
                    "token"
                );

                localStorage.removeItem(
                    "user"
                );

                alert(
                    "Your session has expired. Please login again."
                );

                navigate("/login");

                return;
            }

            // -------------------------------------------------
            // ERROR
            // -------------------------------------------------

            setErrorMessage(

                error.response?.data?.message ||

                "Unable to update profile."

            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="edit-profile-page">

                <div className="loading-card">

                    <div className="loading-spinner">
                    </div>

                    <h2>
                        Loading Profile...
                    </h2>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (errorMessage && !user) {

        return (

            <div className="edit-profile-page">

                <div className="not-found-card">

                    <div className="not-found-icon">
                        ⚠️
                    </div>

                    <h1>
                        Unable to Load Profile
                    </h1>

                    <p>
                        {errorMessage}
                    </p>

                    <button
                        className="back-profile-btn"
                        onClick={() =>
                            navigate("/profile")
                        }
                    >
                        ← Back to Profile
                    </button>

                </div>

            </div>

        );

    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="edit-profile-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="edit-profile-header">

                <button
                    type="button"
                    className="back-btn"
                    onClick={() =>
                        navigate("/profile")
                    }
                >
                    ← Back to Profile
                </button>

                <div className="header-content">

                    <span className="header-small">
                        🍴 RECIPE COMMUNITY
                    </span>

                    <h1>
                        Edit Your Profile
                    </h1>

                    <p>
                        Update your personal information
                        and profile details.
                    </p>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {errorMessage && (

                <div className="error-message">
                    ⚠️ {errorMessage}
                </div>

            )}


            {/* =================================================
                CARD
            ================================================= */}

            <div className="edit-profile-card">

                <div className="card-title">

                    <div className="title-icon">
                        👤
                    </div>

                    <div>

                        <h2>
                            Profile Information
                        </h2>

                        <p>
                            Keep your information up to date.
                        </p>

                    </div>

                </div>


                <form onSubmit={updateProfile}>

                    {/* =================================================
                        PROFILE IMAGE
                    ================================================= */}

                    <div className="profile-image-section">

                        <div className="profile-image-wrapper">

                            <img
                                src={
                                    profileImage.trim()
                                        ? profileImage.trim()
                                        : defaultProfileImage
                                }
                                alt="Profile"
                                onError={
                                    handleImageError
                                }
                            />

                        </div>

                        <div className="image-details">

                            <h3>
                                Profile Picture
                            </h3>

                            <p>
                                Enter an image URL for your profile picture.
                            </p>

                            <input
                                type="url"
                                value={profileImage}
                                placeholder="https://example.com/profile.jpg"
                                onChange={(event) =>
                                    setProfileImage(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        NAME + EMAIL
                    ================================================= */}

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Full Name
                                <span>*</span>
                            </label>

                            <input
                                type="text"
                                value={name}
                                placeholder="Enter your full name"
                                onChange={(event) =>
                                    setName(
                                        event.target.value
                                    )
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Email Address
                                <span>*</span>
                            </label>

                            <input
                                type="email"
                                value={email}
                                placeholder="Enter your email"
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        GENDER
                    ================================================= */}

                    <div className="form-group">

                        <label>
                            Gender
                        </label>

                        <div className="gender-options">

                            <label
                                className={
                                    gender === "Male"
                                        ? "gender-option active"
                                        : "gender-option"
                                }
                            >

                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={
                                        gender === "Male"
                                    }
                                    onChange={(event) =>
                                        setGender(
                                            event.target.value
                                        )
                                    }
                                />

                                <span>
                                    👨 Male
                                </span>

                            </label>


                            <label
                                className={
                                    gender === "Female"
                                        ? "gender-option active"
                                        : "gender-option"
                                }
                            >

                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={
                                        gender === "Female"
                                    }
                                    onChange={(event) =>
                                        setGender(
                                            event.target.value
                                        )
                                    }
                                />

                                <span>
                                    👩 Female
                                </span>

                            </label>


                            <label
                                className={
                                    gender === "Other"
                                        ? "gender-option active"
                                        : "gender-option"
                                }
                            >

                                <input
                                    type="radio"
                                    name="gender"
                                    value="Other"
                                    checked={
                                        gender === "Other"
                                    }
                                    onChange={(event) =>
                                        setGender(
                                            event.target.value
                                        )
                                    }
                                />

                                <span>
                                    🧑 Other
                                </span>

                            </label>

                        </div>

                    </div>


                    {/* =================================================
                        BIO
                    ================================================= */}

                    <div className="form-group">

                        <label>
                            Bio
                        </label>

                        <textarea
                            rows="5"
                            value={bio}
                            maxLength="250"
                            placeholder="Tell something about yourself..."
                            onChange={(event) =>
                                setBio(
                                    event.target.value
                                )
                            }
                        />

                        <small>
                            {bio.length}/250 characters
                        </small>

                    </div>


                    {/* =================================================
                        BUTTONS
                    ================================================= */}

                    <div className="form-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() =>
                                navigate("/profile")
                            }
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="save-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "⏳ Saving..."
                                : "💾 Save Changes"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default EditProfile;