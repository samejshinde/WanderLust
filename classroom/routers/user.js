const express = require("express");
const router = express.Router();

// USERS
// Index Route
router.get("/", (req, res) => {
    res.send("app users");
});

// edit Route
router.get("/edit", (req, res) => {
    res.send("app users edit");
});

// show Route
router.get("/:id", (req, res) => {
    res.send("app users show");
});


module.exports = router;