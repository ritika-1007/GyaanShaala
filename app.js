const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require('ejs-mate');

app.use(express.urlencoded({ extended: true }))
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, 'public')));


app.get("/", (req, res) => {
    res.render("home");
})
app.get("/materials", (req, res) => {
    res.render("templates/materials");
})
app.get("/team", (req, res) => {
    res.render("templates/team");
})
app.get("/contact", (req, res) => {
    res.render("templates/contact");
})
app.get("/dsa", (req, res) => {
    res.render("templates/dsa");
})
app.get("/development", (req, res) => {
    res.render("templates/development");
})
app.get("/academics", (req, res) => {
    res.render("templates/academics");
})
app.get("/testimonials", (req, res) => {
    res.render("templates/testimonials");
})
app.get("/feedback", (req, res) => {
    res.render("templates/feedback");
})


app.listen(3000, () => {
    console.log(`Listening at port 3000`);
})