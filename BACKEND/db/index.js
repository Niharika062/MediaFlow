import mongoose from "mongoose" ;


const connectDB= async()=>{
try{
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("MONGODB Connected !");
}

catch(error){
    console.log("Error connecting to MongoDB:", error);
    process.exit(1); // if database connection fails , server also shuts down
}

};
export default connectDB;