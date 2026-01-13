const Listing = require("../Models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index =  async (req, res) =>{
        const category  = req.query.category;

        let filter = {};
        if (category) {
        filter.category = { $in: category.split(",") };
    }

        const allListings = await Listing.find(filter);
        res.render("listings/index.ejs", {allListings, category});
    };

module.exports.renderNewForms =  (req, res) =>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) =>{
        let {id} = req.params;
        const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
    })
        .populate("owner");
        if(!listing){
            req.flash("error", "Listing You requested for does not exist!");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs", {listing});
    };

module.exports.createListing = async(req, res, next) =>{

    let response =await geocodingClient
    .forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
})
  .send()
    let url = req.file.secure_url || req.file.url;
     let filename = req.file.public_id;
     console.log(url, ".." , filename);

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename}
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
     res.redirect("/listings");
    };

module.exports.renderEditForms = async(req, res) =>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error", "Listing You requested for does not exist!");
            return res.redirect("/listings");
        }

        // let originalImageUrl = listing.image.url;
        //let smallImageUrl = originalImageUrl.replace( "/upload","/upload/h_150, w_200,c_fill")
        let smallImageUrl = "";
        if(listing.image && listing.image.url) {
            smallImageUrl = listing.image.url.replace(
                "/upload",
                "/upload/w_300"
            );
        }
        
        res.render("listings/edit.ejs", {listing , smallImageUrl});
    };    
    
module.exports.updateListing = async (req, res) =>{
        let {id} =req.params;
        let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing });
        if(typeof req.file !== "undefined"){
        let url = req.file.secure_url || req.file.url;
        let filename = req.file.public_id;
        listing.image ={ url, filename}
        await listing.save();
        }
        req.flash("success", "Listing Updated!");
        res.redirect(`/listings/${id}`);
    };
   
module.exports.deleteListings = async (req, res)=>{
            let {id} = req.params;
            let deleteListing = await Listing.findByIdAndDelete(id);
            console.log(deleteListing);
            req.flash("success", "Listing Deleted!");
            res.redirect("/listings");
        
    };    