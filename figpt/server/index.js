import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import connectDB from './config/db.js'

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'F1GPT API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  })
})

const PORT = process.env.PORT || 5000

connectDB()   // ← only once, before listen

app.listen(PORT, () => {
  console.log(`🚀 F1GPT Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
})