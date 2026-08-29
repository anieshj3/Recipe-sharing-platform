import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";

function Home() {
    return (
        <div>

            {/* ==================================================
                NAVBAR
            ================================================== */}

            <header className="header">

                <h1>RecipeShare</h1>

                <nav>

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/login">
                        Login
                    </Link>

                    <Link to="/signup">
                        Signup
                    </Link>

                    {/* ADMIN LOGIN */}

                    <Link
                        to="/adminLogin"
                        className="admin-link"
                    >
                        Admin Login
                    </Link>

                </nav>

            </header>


            {/* ==================================================
                HERO SECTION
            ================================================== */}

            <section className="hero">

                <h2>
                    Welcome to Recipe Sharing Platform
                </h2>

                <p>
                    Discover delicious recipes from around
                    the world and share your own recipes
                    with the community.
                </p>


                <div className="buttons">

                    {/* USER LOGIN */}

                    <Link
                        to="/login"
                        className="btn"
                    >
                        Login
                    </Link>


                    {/* USER SIGNUP */}

                    <Link
                        to="/signup"
                        className="btn signup"
                    >
                        Signup
                    </Link>

                </div>

            </section>


            {/* ==================================================
                FEATURES
            ================================================== */}

            <section className="features">

                <h2>
                    Features
                </h2>


                <div className="feature-container">

                    <div className="card">

                        <h3>
                            Search Recipes
                        </h3>

                        <p>
                            Search recipes using recipe
                            names and categories.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            Share Recipes
                        </h3>

                        <p>
                            Create and publish your own
                            recipes easily.
                        </p>

                    </div>


                    <div className="card">

                        <h3>
                            View Recipes
                        </h3>

                        <p>
                            Browse popular and latest
                            recipes shared by users.
                        </p>

                    </div>

                </div>

            </section>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <footer className="footer">

                <p>
                    © 2026 Recipe Sharing Platform
                </p>

                <Link
                    to="/adminLogin"
                    className="admin-footer-link"
                >
                    Admin Login
                </Link>

            </footer>

        </div>
    );
}

export default Home;