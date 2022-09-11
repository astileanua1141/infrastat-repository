require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')


mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true})
const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())


const catalogRouter = require('./routes/catalog')
app.use('/catalog', catalogRouter)
// localhost:3000/catalog/anything


app.listen(3000, () => console.log('Server Started'))
