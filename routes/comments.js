var express = require(`express`);
var router = express.Router({mergeParams: true});
var Campground = require(`../models/campground`);
var Comment = require(`../models/comment`);
var middleware = require(`../middleware`);

//Comments New Route
router.get(`/new`, middleware.isLoggedIn, (req, res) => {
    //find campground by id and send it to new.ejs
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err);
        }
        else {
            res.render(`comments/new`, {campground: campground});
        }
    });
});

//Comments Create Route
router.post(`/`, middleware.isLoggedIn, (req, res) => {
    //lookup campground using ID
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            req.flash(`error`, `Something went wrong`);
            res.redirect(`/campgrounds`);
        }
        else {
            //create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    console.log(err);
                }
                else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash(`success`, `Successfully added comment`);
                    res.redirect(`/campgrounds/${campground._id}`);
                }
            });
        }
    });
});

//Comments Edit Route
router.get(`/:comment_id/edit`, middleware.checkCommentOwnership, (req, res) => {
    var campground_id = req.params.id;
    Comment.findById(req.params.comment_id, (err, comment) => {
        if(err) {
            res.redirect(`back`);
        }
        else {
            res.render(`comments/edit`, {campground_id: campground_id, comment: comment});
        }
    });
});

//Comments Update Route
router.put(`/:comment_id`, middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
        if(err) {
            res.redirect(`back`);
        }
        else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

//Comments Destroy Route
router.delete(`/:comment_id`, middleware.checkCommentOwnership, (req, res) => {
    //find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err) {
            res.redirect(`back`);
        }
        else {
            req.flash(`success`, `Comment deleted`);
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

module.exports = router;