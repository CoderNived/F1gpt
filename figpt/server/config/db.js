// Hint 1 — Import
import mongoose from 'mongoose'

// Hint 2 — Export an async function called connectDB
export const connectDB = async () => {
  try {
    // mongoose.connect returns a connection object
    // connection.connection.host gives you the host name
    
  } catch (error) {
    // Log the error message
    // Exit the process with failure code: process.exit(1)
  }
}