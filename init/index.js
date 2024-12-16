const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/test";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
.then(() => {
    console.log("connection successfull");
})
.catch((err) => {
    console.log(err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    const modifiedData = initData.data.map((obj)=> ({...obj, owner: "674958dd907daa8561fd5f0e"}));
    await Listing.insertMany(modifiedData);
    console.log("data was initialized");
}

initDB();


