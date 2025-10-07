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

require('dotenv').config()
const express = require('express')
const cors = require('cors')
const contactRoutes = require('./routes/contactRoutes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: ['https://globuz.in','https://globuzindia.netlify.app'] }))

app.use(express.json())

app.use('/api', contactRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
