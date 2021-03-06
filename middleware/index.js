var Campground = require(`../models/campground`);
var Comment = require(`../models/comment`);

//all the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        //if user logged in?
        Campground.findById(req.params.id, (err, campground) => {
            if(err) {
                req.flash(`error`, `Campground not found`);
                res.redirect(`back`);
            }
            else {
                //does user own the campground?
                if(campground.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash(`error`, `You dont have permission to do that`);
                    res.redirect(`back`);
                }
            }
        });
    }
    else {
        req.flash(`error`, `You need to be logged in to do that`);
        res.redirect(`back`);
    }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        //if user logged in?
        Comment.findById(req.params.comment_id, (err, comment) => {
            if(err) {
                req.flash(`error`, `Comment not found`);
                res.redirect(`back`);
            }
            else {
                //does user own the comment?
                if(comment.author.id.equals(req.user._id)) {
                    next();
                }
                else {
                    req.flash(`error`, `You dont have permission to do that`);
                    res.redirect(`back`);
                }
            }
        });
    }
    else {
        req.flash(`error`, `You need to be logged in to do that`);
        res.redirect(`back`);
    }
};

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash(`error`, `You need to be logged in to do that`);
    res.redirect(`/login`);
};

module.exports = middlewareObj;