if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}


const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

app.set('view engine','ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
//where css, style files are:
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended:false}))

// Database config
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true})
const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const indexRouter = require('./routes/index')
app.use('/', indexRouter)

const invoiceEntriesRouter = require('./routes/invoiceEntries')
app.use('/invoiceEntries', invoiceEntriesRouter)

const catalogRouter = require('./routes/catalog')
app.use('/catalog', catalogRouter)
// localhost:3000/catalog/anything


app.listen(process.env.PORT || 3000, () => console.log('Server Started'))


