import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import "../css/Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // ==========================================
    // LOGIN
    // ==========================================

    const attemptLogin = async (event) => {

        event.preventDefault();

        setErrorMessage("");

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!email.trim()) {

            setErrorMessage(
                "Please enter your email."
            );

            return;
        }

        if (!password) {

            setErrorMessage(
                "Please enter your password."
            );

            return;
        }

        try {

            setLoading(true);

            // ==========================================
            // LOGIN API
            // IMPORTANT:
            // Backend route = /api/login
            // ==========================================

            const response = await axios.post(
                "http://localhost:5000/api/login",
                {
                    email: email.trim(),
                    password: password
                }
            );

            console.log(
                "Login Response:",
                response.data
            );

            // ==========================================
            // GET TOKEN
            // ==========================================

            const token =
                response.data?.token;

            if (!token) {

                setErrorMessage(
                    "Login successful, but token was not received."
                );

                return;
            }

            // ==========================================
            // SAVE TOKEN
            // ==========================================

            localStorage.setItem(
                "token",
                token
            );

            // ==========================================
            // SAVE USER
            // ==========================================

            if (response.data?.user) {

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        response.data.user
                    )
                );
            }

            // ==========================================
            // CLEAR FORM
            // ==========================================

            setEmail("");
            setPassword("");

            // ==========================================
            // GO TO DASHBOARD
            // ==========================================

            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Login Error:",
                error
            );

            if (error.response) {

                console.log(
                    "Backend Response:",
                    error.response.data
                );

                setErrorMessage(
                    error.response.data?.message ||
                    "Invalid email or password."
                );

            } else if (error.request) {

                setErrorMessage(
                    "Unable to connect to the server. " +
                    "Please make sure your backend is running on port 5000."
                );

            } else {

                setErrorMessage(
                    "Something went wrong. Please try again."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="login-page">

            <div className="overlay">

                <div className="login-box">

                    {/* ==============================
                        TITLE
                    ============================== */}

                    <h1>
                        🍴 RecipeHub
                    </h1>

                    <h2>
                        Welcome Back
                    </h2>

                    <p>
                        Login to continue sharing
                        delicious recipes.
                    </p>

                    {/* ==============================
                        ERROR MESSAGE
                    ============================== */}

                    {errorMessage && (

                        <div className="error-message">
                            {errorMessage}
                        </div>

                    )}

                    {/* ==============================
                        LOGIN FORM
                    ============================== */}

                    <form onSubmit={attemptLogin}>

                        {/* EMAIL */}

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            required
                        />

                        {/* PASSWORD */}

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            required
                        />

                        {/* REMEMBER ME */}

                        <div className="login-options">

                            <label>

                                <input
                                    type="checkbox"
                                />

                                Remember Me

                            </label>

                        </div>

                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Logging in..."
                                : "Login"
                            }

                        </button>

                    </form>

                    {/* ==============================
                        SIGNUP LINK
                    ============================== */}

                    <div className="bottom-text">

                        Don't have an account?

                        <Link to="/signup">
                            {" "}Create Account
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Login;