if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
fs = require('fs');
const app = express();
const path = require("path");
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const AppError = require('./utils/AppError');
const wrapAsync = require('./utils/wrapAsync');
const UserContactUs = require("./models/usercontactus");
const UserFeedback = require("./models/userfeedback");
const Discussion = require("./models/discussion");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const multer = require('multer');
const { storage, cloudinary } = require('./cloudinary');
const upload = multer({ storage });
const User = require('./models/user');
const Book = require('./models/book');
const Pyq = require('./models/pyq');
const Ppt = require('./models/ppt');
const Resource = require('./models/resource');
const Subject = require('./models/subject');


const { isLoggedIn } = require('./middleware');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/gyaanshaala';
main().catch(err => {
    console.log(err)
});
async function main() {
    await mongoose.connect(dbUrl);
    console.log("Connection open");
}
const secret = process.env.SECRET || 'thisisasecret';
const store = new MongoStore({
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24 * 3600
});
store.on('error', function (e) {
    console.log("Session Store Error", e)
});
const sessionConfig = {
    store,
    secret,
    resave: false, saveUninitialized: false,
    cookie: {
        name: 'session',
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(express.urlencoded({ extended: true }))
app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '/upload', function (error, success) {
//             if (error) throw error;
//         });
//     },
//     filename: function (req, file, cb) {
//         const name = Date.now() + '-' + file.originalName;
//         cb(null, name, function (error1, success1) {
//             if (error1) throw error1;
//         })
//     }
// });


app.get("/", (req, res) => {
    res.render("home");
})
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get("/materials", isLoggedIn, (req, res) => {
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
        const userData = new UserContactUs(req.body)
        await userData.save();
        res.status(201).render("home");
    }
    catch (error) {
        res.status(500).send(error)
    }
})

app.get("/materials/dsa", isLoggedIn, (req, res) => {
    res.render("templates/dsa");
})
app.get("/materials/development", isLoggedIn, (req, res) => {
    res.render("templates/development");
})
app.get("/materials/academics", isLoggedIn, (req, res) => {
    res.render("templates/academics");
})
app.get("/testimonials", (req, res) => {
    res.render("templates/testimonials");
})
app.get("/feedback", (req, res) => {
    res.render("templates/feedback");
})
app.get("/discussion", async (req, res) => {
    const discussion = await Discussion.find();
    res.status(200).json(discussion);
}
)
app.post("/discussion", async (req, res) => {
    console.log(req.headers);
    const { title, createdby, text } = req.headers;
    if (title == null || createdby == null || text == null) {
        res.status(400).json({ message: "field empty" });
    }
    else {
        try {
            const discussion = new Discussion({ title, createdby, text, comments: [] })
            await discussion.save();
            res.status(200).json(discussion);
        }
        catch (error) {
            console.log(error);
            res.status(500).send(error)
        }
    }
}
)

app.post("/feedback", async (req, res) => {
    try {
        const userFeedback = new UserFeedback(req.body)
        await userFeedback.save();
        req.flash("success", "Feedback Submitted");
        res.status(201).redirect("/materials");
    }
    catch (error) {
        res.status(500).send(error)
    }
})
//data structures and algorithms content
app.get("/materials/dsa/ds", isLoggedIn, async (req, res) => {
    const resources = await Resource.find({});
    res.render("templates/innercontents/ds", { resources });
})
app.get("/materials/dsa/practice", isLoggedIn, (req, res) => {
    res.render("templates/innercontents/practice");
})
app.get("/materials/core", isLoggedIn, async (req, res) => {
    const subjects = await Subject.find({});
    res.render("templates/innercontents/core", { subjects });
})
// app.get("/materials/resume", (req, res) => {
//     res.render("templates/innercontents/resume");
// })
//development contents
app.get("/materials/development/webdev", isLoggedIn, async (req, res) => {
    res.render("templates/innercontents/webdev");

})
app.get("/materials/development/appdev", isLoggedIn, (req, res) => {
    res.render("templates/innercontents/appdev");
})
app.get("/materials/development/ml", isLoggedIn, (req, res) => {
    res.render("templates/innercontents/ml");
})
//academics content
app.get("/materials/academics/pyq", isLoggedIn, async (req, res) => {
    const pyqs = await Pyq.find({});
    res.render("templates/innercontents/pyq", { pyqs });
})
app.get("/materials/academics/ppt", isLoggedIn, async (req, res) => {
    const ppts = await Ppt.find({});
    res.render("templates/innercontents/ppt", { ppts });
})
app.get("/materials/academics/books", isLoggedIn, async (req, res) => {
    const books = await Book.find({});
    res.render("templates/innercontents/books", { books });
})

app.get('/materials/academics/calendar', isLoggedIn, function (req, res) {
    var filePath = "/public/docs/calendar.pdf";

    fs.readFile(__dirname + filePath, function (err, data) {
        res.contentType("application/pdf");
        res.send(data);
    });
});

app.get('/register', (req, res) => {
    res.render('users/register');
});
app.post('/register', wrapAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Succesfully Registered");
            res.redirect("/materials");
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.render("users/register");
    }
}));

app.get('/login', (req, res) => {
    res.render('users/login');
})
app.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/materials';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})
app.get('/adminlogin', (req, res) => {
    res.render('admin/adminlogin');
})
app.get('/adminpage', (req, res) => {
    res.render('admin/adminpage');
})
app.post('/adminlogin', passport.authenticate('local', { failureFlash: true, failureRedirect: '/admin' }), async (req, res) => {
    if (req.body.username === 'admin') {

        const users = await User.find({});
        const feedbacks = await UserFeedback.find({});
        const books = await Book.find({});
        const pyqs = await Pyq.find({});
        const ppts = await Ppt.find({});
        const resources = await Resource.find({});
        const subjects = await Subject.find({});
        res.render('admin/adminpage', { users, feedbacks, books, pyqs, ppts, resources, subjects });
    }
    else {

        res.render("admin/adminlogin")
    }
})
app.get('/admin/edituser', async (req, res) => {
    const id = req.query.id;
    const userData = await User.findById({ _id: id })
    if (userData) {
        res.render('admin/edituser', { user: userData });
    }
    else {
        res.redirect("/adminpage")
    }
})

app.post('/edituser', async (req, res) => {
    const userData = await User.findByIdAndUpdate({ _id: req.body.id },
        { $set: { username: req.body.username, email: req.body.email } })
    const users = await User.find({});
    const feedbacks = await UserFeedback.find({});
    const books = await Book.find({});
    const pyqs = await Pyq.find({});
    const ppts = await Ppt.find({});
    const resources = await Resource.find({});
    const subjects = await Subject.find({});
    res.render('admin/adminpage', { users, feedbacks, books, pyqs, ppts, resources, subjects })
})

app.get("/admin/deleteuser", async (req, res) => {
    const id = req.query.id;
    await User.deleteOne({ _id: id });
    const users = await User.find({});
    const feedbacks = await UserFeedback.find({});
    const books = await Book.find({});
    const pyqs = await Pyq.find({});
    const ppts = await Ppt.find({});
    const resources = await Resource.find({});
    const subjects = await Subject.find({});


    res.render('admin/adminpage', { users, feedbacks, books, pyqs, ppts, resources, subjects })
})

app.get("/addbooks", (req, res) => {
    res.render('admin/addbooks');
})
app.post('/addbooks', upload.array('pdf'), async (req, res) => {
    try {
        const newBook = new Book({
            name: req.body.name,
            subject: req.body.subject,
        })
        newBook.pdf = req.files.map(f => ({ url: f.path, filename: f.filename }))
        await newBook.save();
        // console.log(req.files)

        const books = await Book.find({});

        res.render('templates/innercontents/books', { books })
    }
    catch (e) {
        req.flash("error", "Invalid Book");
        res.render("admin/addbooks")
    }
})
app.get("/admin/deletebooks", async (req, res) => {
    const id = req.query.id;
    await Book.deleteOne({ _id: id });
    const books = await Book.find({});

    res.render('templates/innercontents/books', { books })
})


app.get("/addpyq", (req, res) => {
    res.render('admin/addpyq');
})
app.post('/addpyq', upload.array('pdf'), async (req, res) => {
    try {
        const newPyq = new Pyq({
            semester: req.body.semester,
            year: req.body.year
        })
        newPyq.pdf = req.files.map(f => ({ url: f.path, filename: f.filename }))
        await newPyq.save();
        const pyqs = await Pyq.find({});

        res.render('templates/innercontents/pyq', { pyqs })
    }
    catch (e) {
        req.flash("error", "Invalid Pyq");
        res.render("admin/addpyq")
    }
})
app.get("/admin/deletepyq", async (req, res) => {
    const id = req.query.id;
    await Pyq.deleteOne({ _id: id });
    const pyqs = await Pyq.find({});

    res.render('templates/innercontents/pyq', { pyqs })
})

app.get("/addppt", (req, res) => {
    res.render('admin/addppt');
})
app.post('/addppt', upload.array('pdf'), async (req, res) => {
    try {
        const newPpt = new Ppt({
            semester: req.body.semester,
            year: req.body.year,
            topic: req.body.topic,
            subject: req.body.subject
        })
        newPpt.pdf = req.files.map(f => ({ url: f.path, filename: f.filename }))
        await newPpt.save();
        const ppts = await Ppt.find({});

        res.render('templates/innercontents/ppt', { ppts })
    }
    catch (e) {
        res.render("admin/addppt")
    }
})
app.get("/admin/deleteppt", async (req, res) => {
    const id = req.query.id;
    await Ppt.deleteOne({ _id: id });
    const ppts = await Ppt.find({});
    res.render('templates/innercontents/ppt', { ppts })
})

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});
app.get("/addresource", (req, res) => {
    res.render('admin/addresource');
})
app.post('/addresource', async (req, res) => {
    try {
        const newResource = new Resource({
            topic: req.body.topic,
            followuplink: req.body.followuplink
        })
        await newResource.save();
        const resources = await Resource.find({});
        res.render('templates/innercontents/ds', { resources })
    }
    catch (e) {
        req.flash("error", "Invalid Resource");
        res.render("admin/addresource")
    }
})
app.get("/admin/deleteresource", async (req, res) => {
    const id = req.query.id;
    await Resource.deleteOne({ _id: id });
    const resources = await Resource.find({});
    res.render('templates/innercontents/ds', { resources })
})
app.get("/addsubject", (req, res) => {
    res.render('admin/addsubject');
})
app.post('/addsubject', async (req, res) => {
    try {
        const newSubject = new Subject({
            topic: req.body.topic,
            noteslink: req.body.noteslink,
            playlistlink: req.body.playlistlink,
            queslink: req.body.queslink
        })
        await newSubject.save();
        const subjects = await Subject.find({});
        res.render('templates/innercontents/core', { subjects })
    }
    catch (e) {
        req.flash("error", "Invalid");
        res.render("admin/addsubject")
    }
})
app.get("/admin/deletesubject", async (req, res) => {
    const id = req.query.id;
    await Subject.deleteOne({ _id: id });
    const subjects = await Subject.find({});
    res.render('templates/innercontents/core', { subjects })
})

app.listen(3000, () => {
    console.log(`Listening at port 3000`);
})