const express = require('express')
const cors = require('cors')
const newsEndpoints = require('./api/news')
const politicsEndpoints = require('./api/politics')
const entertainmentEndpoints = require('./api/entertainment')
const sportsEndpoints = require('./api/sports')

const app = express()

app.use(cors())
app.get('/', (req, res) => {
    res.json('News API Home Page')
})

app.use('/api/news', newsEndpoints)
app.use('/api/politics', politicsEndpoints)
app.use('/api/entertainment', entertainmentEndpoints)
app.use('/api/sports', sportsEndpoints)


const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`API Server is running on PORT ${PORT}`))