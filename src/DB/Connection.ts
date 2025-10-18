import mongoose from "mongoose";
export const connectdb = async () =>{
    await mongoose.connect(process.env.DB_URL as string)
    .then (()=>{
        console.log("Connected to database successfully.");
    }).catch((err)=>{
        console.log("Failed to connect to database.", err);
    })
};

// Responsible for establishing and managing the database connection.
// Establishes connection to your database (MongoDB, PostgreSQL, etc).
// Often exports a connection instance used across the app.