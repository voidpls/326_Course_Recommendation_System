const express = require("express")
const app = express()
const path = require('path')

const PORT = 3000

app.use(express.static(path.join(__dirname, '../src')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/index.html'))
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

module.exports = app
