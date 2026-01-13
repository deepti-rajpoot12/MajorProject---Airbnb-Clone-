const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");

main()
    .then(() => {
        console.log("connected to db");
    }) .catch((err) =>{
        console.log(err);
    });

    async function main(){
        await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    };

    const intiDB = async () =>{
        await Listing.deleteMany({});
        initData.data = initData.data.map((obj) =>({
            ...obj, 
            owner:"6901a809a792f7bfdd2ffac6"}))
        await Listing.insertMany(initData.data);
        console.log("data was initialize");
    };

    intiDB();