// ======================================================
// LOAD ENVIRONMENT VARIABLES
// ======================================================

require("dotenv").config();


// ======================================================
// DATABASE CONNECTION
// ======================================================

require("./database/db");


// ======================================================
// IMPORT PACKAGES
// ======================================================

const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");


// ======================================================
// IMPORT ROUTES
// ======================================================

const indexRouter = require("./routes/index");
const userRouter = require("./routes/users");
const adminRouter = require("./routes/admin");


// ======================================================
// CREATE EXPRESS APP
// ======================================================

const app = express();


// ======================================================
// CORS
// ======================================================

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "PATCH"
        ],
        credentials: true
    })
);


// ======================================================
// VIEW ENGINE
// ======================================================

app.set(
    "views",
    path.join(__dirname, "views")
);

app.set(
    "view engine",
    "ejs"
);


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(logger("dev"));

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(cookieParser());

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);


// ======================================================
// DEFAULT ROUTES
// ======================================================

app.use(
    "/",
    indexRouter
);


// ======================================================
// USER + RECIPE APIs
// ======================================================

app.use(
    "/api",
    userRouter
);


// ======================================================
// ADMIN APIs
// ======================================================

app.use(
    "/api/admin",
    adminRouter
);


// ======================================================
// 404 ERROR HANDLER
// ======================================================

app.use(
    function (req, res, next) {

        next(
            createError(404)
        );

    }
);


// ======================================================
// ERROR HANDLER
// ======================================================

app.use(
    function (err, req, res, next) {

        console.error(
            "Server Error:",
            err
        );


        // ==================================================
        // API ERROR
        // ==================================================

        if (
            req.originalUrl.startsWith("/api")
        ) {

            return res.status(
                err.status || 500
            ).json({

                success: false,

                message:
                    err.message ||
                    "Something went wrong."

            });

        }


        // ==================================================
        // NORMAL BROWSER ERROR
        // ==================================================

        res.locals.message =
            err.message;

        res.locals.error =
            req.app.get("env") === "development"
                ? err
                : {};


        res.status(
            err.status || 500
        );


        res.render(
            "error"
        );

    }
);


// ======================================================
// EXPORT APP
// ======================================================

module.exports = app;