const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        console.log("trying to connect to MongoDB....");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb is connected");
    } catch (error) {
        console.error("Mongo connection failed" , error.message);
        process.exit(1);
    }
}

module.exports = connectDB;