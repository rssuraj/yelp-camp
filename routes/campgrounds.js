var express = require(`express`);
var router = express.Router();
var Campground = require(`../models/campground`);
var middleware = require(`../middleware`);

//INDEX Route - Show all campgrounds
router.get('/', (req, res) => {
    //Get all campgrounds from DB
    Campground.find({}, (err, campgrounds) => {
        if(err) {
            console.log(err);
        }
        else {
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
    });
});

//CREATE Route - add new campground to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    //add author/user to campground
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    //Create a new campground and save to DB
    Campground.create(newCampground, (err, campground) => {
        if(err) {
            console.log(err);
        }
        else {
            //redirect back to campgrounds page
            console.log(campground);
            res.redirect('/campgrounds');
        }
    });
});

//NEW Route - Show form to create new campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

//SHOW Route - Show more information about one campground
router.get('/:id', (req, res) => {
    //find the campground with provided ID and populate comments
    Campground.findById(req.params.id).populate(`comments`).exec((err, campground) => {
        if(err) {
            console.log(err);
        }
        else {
            //render show template with that campground
            res.render(`campgrounds/show`, {campground: campground});
        }
    });
});

//EDIT Campground Route
router.get(`/:id/edit`, middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        res.render(`campgrounds/edit`, {campground: campground});
    });
});

//UPDATE Campground Route
router.put(`/:id`, middleware.checkCampgroundOwnership, (req, res) => {
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        if(err) {
            res.redirect(`/campgrounds`);
        }
        else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
    //redirect somehwere(show page)
});

//DESTROY Campground Route
router.delete(`/:id`, middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect(`/campgrounds`);
        }
        else {
            req.flash(`success`, `Campground deleted`);
            res.redirect(`/campgrounds`);
        }
    });
});

module.exports = router;