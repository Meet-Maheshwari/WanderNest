const express = require("express");
const router = express.Router();
const Listing = require("../models/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const {storage} = require("../cloudConfig.js");
const listingControllers = require("../controllers/listings.js");

const multer  = require("multer")
const upload = multer({ storage })

//Listings
// router.get("/", (req, res) => {
//     res.redirect("/listings");
// })

router.route("/")
//Main Page
.get(wrapAsync(listingControllers.index))
//Create Route
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingControllers.createListing))


// New Page
router.get("/new", isLoggedIn, listingControllers.renderNewForm);


//Search 
router.get('/search', listingControllers.search);


router.route("/:id")
//Show Route
.get(wrapAsync(listingControllers.showListing))
//Update Route
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingControllers.updateListing))
//Delete ROute
.delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing))


//Category Search
router.get("/categories/:category", listingControllers.searchByCategory)


//Booking Route
router.get("/book/:id", isLoggedIn, listingControllers.confirmBooking);


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingControllers.renderEditForm));



module.exports = router;