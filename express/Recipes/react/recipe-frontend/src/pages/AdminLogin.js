import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../css/AdminLogin.css";

function AdminLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (event) => {

        event.preventDefault();

        setErrorMessage("");

        if (!email.trim()) {
            setErrorMessage("Please enter email.");
            return;
        }

        if (!password) {
            setErrorMessage("Please enter password.");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "https://recipe-sharing-platform-2-nhqu.onrender.com/api/admin/login",
                {
                    email: email.trim(),
                    password: password
                }
            );

            console.log("Admin Login Response:", response.data);

            if (response.data.success) {

                // Save admin token
                localStorage.setItem(
                    "adminToken",
                    response.data.token
                );

                // Save admin details
                localStorage.setItem(
                    "admin",
                    JSON.stringify(response.data.admin)
                );

                // Go to admin dashboard
                navigate("/adminDashboard");

            } else {

                setErrorMessage(
                    response.data.message ||
                    "Admin login failed."
                );

            }

        } catch (error) {

            console.error(
                "Admin Login Error:",
                error
            );

            if (error.response) {

                setErrorMessage(
                    error.response.data?.message ||
                    "Invalid email or password."
                );

            } else if (error.request) {

                setErrorMessage(
                    "Cannot connect to backend. Make sure backend is running on port 5000."
                );

            } else {

                setErrorMessage(
                    "Something went wrong."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="admin-login-page">

            <div className="admin-login-box">

                <h1>
                    Admin Login
                </h1>

                <p>
                    RecipeHub Administration
                </p>


                {errorMessage && (

                    <div className="admin-error">
                        {errorMessage}
                    </div>

                )}


                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Admin Email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                    />


                    <input
                        type="password"
                        placeholder="Admin Password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                    />


                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Admin Login"
                        }

                    </button>

                </form>

            </div>

        </div>

    );
}

export default AdminLogin;