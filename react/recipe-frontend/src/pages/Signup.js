import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

import "../css/Login.css";

function Signup() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConf, setPasswordConf] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    // ==========================================
    // SIGNUP
    // ==========================================

    const handleSignup = async (event) => {

        event.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name.trim()) {
            setErrorMessage("Please enter your name.");
            return;
        }

        if (!email.trim()) {
            setErrorMessage("Please enter your email.");
            return;
        }

        if (!password) {
            setErrorMessage("Please enter your password.");
            return;
        }

        if (password.length < 6) {
            setErrorMessage(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (!passwordConf) {
            setErrorMessage(
                "Please confirm your password."
            );
            return;
        }

        if (password !== passwordConf) {
            setErrorMessage(
                "Passwords do not match."
            );
            return;
        }


        // ==========================================
        // SEND TO BACKEND
        // ==========================================

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/signup",
                {
                    name: name.trim(),
                    email: email.trim(),
                    password: password,
                    passwordConf: passwordConf
                }
            );


            console.log(
                "Signup Response:",
                response.data
            );


            // ==========================================
            // SUCCESS
            // ==========================================

            setSuccessMessage(
                response.data?.message ||
                "Registration successful!"
            );


            // Clear form

            setName("");
            setEmail("");
            setPassword("");
            setPasswordConf("");


            // ==========================================
            // GO TO LOGIN
            // ==========================================

            setTimeout(() => {

                navigate("/login");

            }, 1500);


        } catch (error) {

            console.error(
                "Signup Error:",
                error
            );


            // ==========================================
            // BACKEND RESPONSE
            // ==========================================

            if (error.response) {

                console.log(
                    "Backend Response:",
                    error.response.data
                );


                setErrorMessage(
                    error.response.data?.message ||
                    "Registration failed."
                );

            }


            // ==========================================
            // SERVER NOT CONNECTED
            // ==========================================

            else if (error.request) {

                setErrorMessage(
                    "Unable to connect to the server. " +
                    "Please make sure the backend is running on port 5000."
                );

            }


            // ==========================================
            // OTHER ERROR
            // ==========================================

            else {

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

                    {/* ==================================
                        TITLE
                    ================================== */}

                    <h1>
                        🍴 RecipeHub
                    </h1>

                    <h2>
                        Create Account
                    </h2>

                    <p>
                        Join RecipeHub and share your
                        favourite recipes.
                    </p>


                    {/* ==================================
                        ERROR
                    ================================== */}

                    {errorMessage && (

                        <div className="error-message">
                            {errorMessage}
                        </div>

                    )}


                    {/* ==================================
                        SUCCESS
                    ================================== */}

                    {successMessage && (

                        <div className="success-message">
                            {successMessage}
                        </div>

                    )}


                    {/* ==================================
                        SIGNUP FORM
                    ================================== */}

                    <form onSubmit={handleSignup}>


                        {/* NAME */}

                        <input
                            type="text"
                            placeholder="Enter Name"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                        />


                        {/* EMAIL */}

                        <input
                            type="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                        />


                        {/* PASSWORD */}

                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                        />


                        {/* CONFIRM PASSWORD */}

                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={passwordConf}
                            onChange={(event) =>
                                setPasswordConf(
                                    event.target.value
                                )
                            }
                        />


                        {/* REGISTER */}

                        <button
                            type="submit"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Create Account"
                            }

                        </button>

                    </form>


                    {/* ==================================
                        LOGIN
                    ================================== */}

                    <div className="bottom-text">

                        Already have an account?

                        <Link to="/login">
                            {" "}Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Signup;