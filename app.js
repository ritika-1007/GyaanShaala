const express = require("express");
fs = require('fs');
const app = express();
const path = require("path");
const ejsMate = require('ejs-mate');
// const mongoose = require('mongoose');
const User = require("./models/user/usercontact");

// const dbUrl = 'mongodb://localhost:27017/gyaanshaala';
// main().catch(err => {
//     console.log(err)
// });
// async function main() {
//     await mongoose.connect(dbUrl);
//     console.log("Connection open");
// }

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
app.post("/contact", async (req, res) => {
    try {
        const userData = new User(req.body)
        await userData.save();
        res.status(201).render("home");
    }
    catch (error) {
        res.status(500).send(error)
    }
})

app.get("/materials/dsa", (req, res) => {
    res.render("templates/dsa");
})
app.get("/materials/development", (req, res) => {
    res.render("templates/development");
})
app.get("/materials/academics", (req, res) => {
    res.render("templates/academics");
})
app.get("/testimonials", (req, res) => {
    res.render("templates/testimonials");
})
app.get("/feedback", (req, res) => {
    res.render("templates/feedback");
})
//data structures and algorithms content
app.get("/materials/dsa/ds", (req, res) => {
    res.render("templates/innercontents/ds");
})
app.get("/materials/dsa/cp", (req, res) => {
    res.render("templates/innercontents/cp");
})
app.get("/materials/core", (req, res) => {
    res.render("templates/innercontents/core");
})
app.get("/materials/resume", (req, res) => {
    res.render("templates/innercontents/resume");
})
//development contents
app.get("/materials/development/webdev", (req, res) => {
    res.render("templates/innercontents/webdev");
})
app.get("/materials/development/appdev", (req, res) => {
    res.render("templates/innercontents/appdev");
})
app.get("/materials/development/ml", (req, res) => {
    res.render("templates/innercontents/ml");
})
//academics content
app.get("/materials/academics/pyq", (req, res) => {
    res.render("templates/innercontents/pyq");
})
app.get("/materials/academics/assign", (req, res) => {
    res.render("templates/innercontents/assign");
})
app.get("/materials/academics/books", (req, res) => {
    res.render("templates/innercontents/books");
})

app.get('/materials/academics/calendar', function (req, res) {
    var filePath = "/public/docs/calendar.pdf";

    fs.readFile(__dirname + filePath, function (err, data) {
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.listen(3000, () => {
    console.log(`Listening at port 3000`);
})