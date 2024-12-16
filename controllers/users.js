const User = require("../models/users");

module.exports.renderSignupForm =  (req, res) => {
    res.render("./users/signup.ejs");
}

module.exports.signup = async(req, res) => {
    try {
        let {username, password, email} = req.body;

        let user = new User({email, username});
        let newUser = await User.register(user, password);
        console.log(newUser);
        req.login(newUser, (err) => {
            if(err) {
                return next();
            }
            req.flash("success", "Welcome to WanderNest!");
            res.redirect("/listings");
        })
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("./users/login.ejs");
}

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to WanderNest!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
}