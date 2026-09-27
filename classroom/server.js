const express = require("express");
const app = express();
const path = require("path");
const users = require("./routers/user.js");
const posts = require("./routers/post.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

app.use(cookieParser("hiddenCode"))
app.use(session({ secret: "mysecretcode", resave: false, saveUninitialized: true }));
app.use(flash());
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views")); 


app.get("/test", (req, res) => {
    res.send("test successful");
});

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("s");
    res.locals.errorMsg = req.flash(("e"));
    next(); 
})

app.get("/register", (req, res) => {
    let { name = "anonumus"} = req.query;
    req.session.name = name;
    if (name === "anonumus") {
        req.flash("e", "User Not Registered");
    }
    else {
        req.flash("s", "user register successfully");
    }
    res.redirect("/hello"); 
})

app.get("/hello", (req, res) => {
    res.render("page.ejs", { name: req.session.name });
})

app.use("/users", users);
app.use("/posts", posts);

app.listen(3000, () => { console.log("Listing"); });