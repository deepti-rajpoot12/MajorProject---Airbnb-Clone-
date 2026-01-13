const mongoose = require("mongoose");
const Review = require("./reviews.js");
const { required } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: String,
    image: {
        
        filename: String,
        url: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner : {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    geometry:{
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    } ,
    category:{
        type: String,
        enum:[
            "all",
            "trending",
            "rooms",
            "iconic-cities",
            "mountains",
            "castles",
            "amazing-pools",
            "farms",
            "camping",
            "arctic",
            "beaches",
            "domes"
        ],
        required: true
    }
});
listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;