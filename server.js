// const express = require("express")
// const cors = require("cors")
// const dotenv = require("dotenv")
// const contactRoutes = require("./routes/contactRoutes")

// dotenv.config()

// const app = express()
// const PORT = process.env.PORT || 5000

// // Middleware
// app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// // Routes
// app.use("/api/contact", contactRoutes)

// // Health check route
// app.get("/api/health", (req, res) => {
//   res.status(200).json({ status: "OK", message: "Server is running" })
// })

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).json({
//     success: false,
//     message: "Something went wrong!",
//     error: process.env.NODE_ENV === "development" ? err.message : undefined,
//   })
// })

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`)
// })

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed frontend domains
const allowedOrigins = [
  'https://globuz.in',
  'https://globuzindia.netlify.app',
];

// ✅ CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ✅ Apply CORS globally
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight OPTIONS

// ✅ Parse JSON requests
app.use(express.json());

// ✅ API routes
app.use('/api', contactRoutes);

// ✅ Health check route
app.get('/', (req, res) => {
  res.send('Backend is running ✅');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
