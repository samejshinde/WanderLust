const express = require("express");
const router = express.Router();

// POSTS
// Index Route
router.get("/", (req, res) => {
    res.send("app posts");
});

// edit Route
router.get("/edit", (req, res) => {
    res.send("app posts edit");
});

// show Route
router.get("/:id", (req, res) => {
    res.send("app posts show");
});

module.exports = router;