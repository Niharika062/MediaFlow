import connectDB from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config(); // loads all the variables into process.env
const PORT= process.env.PORT || 7000;

connectDB()
.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`Server running on port ${PORT}`);
    });
})
.catch((error)=>{
    console.log("server failed to start", error);
});
