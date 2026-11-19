import express from 'express';
import Redis from 'ioredis';

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379'); // Connect to Redis

const BANNER_KEY = "app:site-banner"; // Key for storing the banner in Redis

// Endpoint to get the current site banner

app.post('/banner' , async (req , res)=>{
    await redis.set(BANNER_KEY , req.body.message || "Welcome to our site!"); // Set the banner message in Redis 
    res.json({ message: "Banner updated successfully" }); // Respond with a success message
})

app.get('/banner' , async(req , res)=>{
    const message = await redis.get(BANNER_KEY) ; // Get the banner message from Redis
    res.json({
        message : message  // Respond with the banner message
    })
})

app.delete('/banner' , async(req , res)=>{
    await redis.del(BANNER_KEY); // Delete the banner message from Redis
    res.json({
        message : "Banner delete successfully" // Respond with a success message
    })
})

// BANNER_KEY  exists in redis then return true else false
app.get('/banner/exists' , async(req , res)=>{
    const exists = await redis.exists(BANNER_KEY) ; // Check if the banner key exists in Redis
    res.json({
        exists : Boolean(exists) // Respond with true if the key exists, false otherwise
    })
})
app.listen(3000 , ()=>{
    console.log("server is running on port 3000") // Start the server and log a message
})

export default app; // Export the Express app for use in other modules