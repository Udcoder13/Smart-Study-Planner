
const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");


const app = express();

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
}); 


const PORT = process.env.PORT || 3000 || 5000 || '0.0.0.0';
app.use(cors());
app.use(express.json());
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
.then(()=>{
    console.log("Connected")
})
.catch(()=>{
  console.log("connection error")
});

app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
