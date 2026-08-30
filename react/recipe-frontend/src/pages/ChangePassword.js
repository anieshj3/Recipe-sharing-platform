import React, { useState } from "react";
import "../css/ChangePassword.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const changePassword = async (e) => {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first.");
            navigate("/login");
            return;
        }

        if (!oldPassword.trim()) {
            setErrorMessage("Please enter your current password.");
            return;
        }

        if (newPassword.length < 6) {
            setErrorMessage(
                "New password must be at least 6 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage(
                "New password and confirm password do not match."
            );
            return;
        }

        if (oldPassword === newPassword) {
            setErrorMessage(
                "New password must be different from old password."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await axios.put(
                "https://recipe-sharing-platform-2-nhqu.onrender.com/api/changepassword",
                {
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "Change password response:",
                response.data
            );

            setSuccessMessage(
                "Password changed successfully!"
            );

            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);

        } catch (error) {
            console.error(
                "Change password error:",
                error
            );

            if (error.response?.status === 401) {
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
                "Unable to change password. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-page">

            <div className="change-password-card">

                <div className="change-password-icon">
                    🔐
                </div>

                <h1>RecipeHub</h1>

                <h2>Change Password</h2>

                <p className="subtitle">
                    Update your password to keep your account secure.
                </p>

                {errorMessage && (
                    <div className="error-message">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="success-message">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={changePassword}>

                    <div className="input-group">
                        <label>
                            Current Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter current password"
                            value={oldPassword}
                            onChange={(e) =>
                                setOldPassword(e.target.value)
                            }
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            minLength={6}
                            autoComplete="new-password"
                            required
                        />

                        <small>
                            Password must contain at least 6 characters.
                        </small>
                    </div>

                    <div className="input-group">
                        <label>
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            minLength={6}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="update-password-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "🔒 Update Password"}
                    </button>

                </form>

                <button
                    type="button"
                    className="back-btn"
                    onClick={() => navigate("/profile")}
                >
                    ← Back to Profile
                </button>

            </div>

        </div>
    );
}

export default ChangePassword;