const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        // ==========================================
        // USER NAME
        // ==========================================

        name: {
            type: String,
            required: true,
            trim: true
        },


        // ==========================================
        // EMAIL
        // ==========================================

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },


        // ==========================================
        // PASSWORD
        // ==========================================

        password: {
            type: String,
            required: true,
            minlength: 6
        },


        // ==========================================
        // PROFILE IMAGE
        // ==========================================

        profileImage: {
            type: String,
            default: ""
        },


        // ==========================================
        // BIO
        // ==========================================

        bio: {
            type: String,
            default: "",
            trim: true
        },


        // ==========================================
        // GENDER
        // ==========================================

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            default: "Other"
        },


        // ==========================================
        // DATE OF BIRTH
        // ==========================================

        dob: {
            type: Date,
            default: null
        },


        // ==========================================
        // USER ROLE
        // ==========================================

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },


        // ==========================================
        // USER STATUS
        // ==========================================

        status: {
            type: String,
            enum: ["Active", "Inactive", "Blocked"],
            default: "Active"
        }
    },

    // ==========================================
    // CREATED AT + UPDATED AT
    // ==========================================

    {
        timestamps: true
    }
);


// ==========================================
// CREATE MODEL
// ==========================================

const User = mongoose.model("User", userSchema);


// ==========================================
// EXPORT MODEL
// ==========================================

module.exports = User;