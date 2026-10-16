const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

// Connect to MongoDB (supports local development and cloud/Vercel via environment variables)
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/urlShortener'
mongoose.connect(dbURI)
    .then(() => console.log('Connected to Database'))
    .catch(err => console.error('Connection error:', err))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

// Home Route: Display all short URLs
app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

// Create Short URL Route
app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

// Redirect Route & Click Counter
app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

// Server Listen (Vercel handles port automatically, fallback to 5000 locally)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})