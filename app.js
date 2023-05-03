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
const User = require('./models/user');
const { isLoggedIn } = require('./middleware');
const dbUrl = "mongodb://0.0.0.0:27017/GyaanShaala"
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
app.get("/discussion", async (req, res)=>{
    const discussion = await Discussion.find();
    res.status(200).json(discussion);
}
)
app.post("/discussion", async (req, res)=>{
    console.log(req.headers);
    const{title,createdby,text}= req.headers;
    if(title == null || createdby == null || text == null){
        res.status(400).json({message:"field empty"});
    }
    else{
        try {
            const discussion = new Discussion({title,createdby,text,comments:[]})
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
        res.status(201).render("home");
    }
    catch (error) {
        res.status(500).send(error)
    }
})
//data structures and algorithms content
app.get("/materials/dsa/ds", isLoggedIn, (req, res) => {
    res.render("templates/innercontents/ds");
})
app.get("/materials/dsa/practice", isLoggedIn, (req, res) => {
    res.render("templates/innercontents/practice");
})
app.get("/materials/core", isLoggedIn, (req, res) => {
    res.render("templates/innercontents/core");
})
// app.get("/materials/resume", (req, res) => {
//     res.render("templates/innercontents/resume");
// })
//development contents
app.get("/materials/development/webdev", isLoggedIn, (req, res) => {
    res.render("templates/innercontents/webdev");
})
app.get("/materials/development/appdev", isLoggedIn, (req, res) => {
    res.render("templates/innercontents/appdev");
})
app.get("/materials/development/ml", isLoggedIn, (req, res) => {
    res.render("templates/innercontents/ml");
})
//academics content
app.get("/materials/academics/pyq", isLoggedIn, (req, res) => {
    res.render("templates/innercontents/pyq");
})
app.get("/materials/academics/assign", isLoggedIn, (req, res) => {
    res.render("templates/innercontents/assign");
})
app.get("/materials/academics/books", isLoggedIn, (req, res) => {
    res.render("templates/innercontents/books");
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

app.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.listen(3000, () => {
    console.log(`Listening at port 3000`);
})