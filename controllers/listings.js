const Listing = require("../models/listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}

module.exports.search =  async (req, res) => {
    try {
        // Extract the search query from the input
        const { query } = req.query;

        if (!query) {
            return res.redirect('/listings'); // Redirect if no query is provided
        }

        if (!isNaN(query)) { // If the query is a number
            req.flash("error", "Please enter text-based search terms, not numbers!");
            return res.redirect('/listings');
        }
        
        // Build the search filter using `$or` to match across multiple fields
        const filter = {
            $or: [
                { title: { $regex: query, $options: 'i' } },        // Case-insensitive search in title
                { description: { $regex: query, $options: 'i' } }, // Case-insensitive search in description
                { location: { $regex: query, $options: 'i' } },    // Case-insensitive search in location
                { country: { $regex: query, $options: 'i' } }     // Case-insensitive search in category
            ]
        };

        // Perform the query
        const allListings = await Listing.find(filter);
        if (allListings.length === 0) {
            req.flash('error', 'No properties found for your search.');
            return res.redirect('/listings'); // Redirect to the listings page or any other route
          }
        // Render the results

        res.render('listings/index.ejs', { allListings });
    } catch (error) {
        console.error("Error during search:", error);
        res.status(500).send("Server Error");
    }
};

module.exports.searchByCategory = async(req, res) => {
    const {category} = req.params;
    const allListings = await Listing.find({ category: category });
    if(allListings.length === 0) {
        req.flash("error", `Currently ${category} are not available`);
        res.redirect("/listings");
        return;
    }
    console.log(allListings);
    res.render("listings/index.ejs", {allListings});
}

module.exports.renderNewForm =  (req, res) => {    
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews", 
        populate: {
            path: "author"
        },
    })
    .populate("owner");
    console.log(listing);
    if(!listing) {
        req.flash("error", "Listing you requested for doesn't exist!");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", {listing});
    }
}

module.exports.createListing = async (req, res, next) => {
    
    const response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
    .send();


    const listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image.url = req.file.path;
    newListing.image.filename = req.file.filename;
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();

    console.log(savedListing);
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}


module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for doesn't exist!");
        res.redirect("/listings");
    }
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_300");
        req.flash("success", "Listing deleted successfully!");
        res.render("listings/edit.ejs", {listing, originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    
    if(typeof req.file !== "undefined") {
        const url = req.file.path;
        const filename = req.file.filename;

        listing.image = {url, filename};
        await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect("/listings");
}

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
}

module.exports.confirmBooking = async(req, res) => {
    let {id} = req.params;

    req.flash("success", "Booking successfull! explore some more places.");
    res.redirect(`/listings/${id}`);
}