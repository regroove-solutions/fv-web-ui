const path = require('path')
const compression = require('compression')
const express = require('express')
const app = express()
const port = 3011
app.use(compression())
app.use('*/assets', express.static(path.resolve(__dirname, 'public', 'assets')))
app.use(express.static(path.resolve(__dirname, 'public')))
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})
app.listen(port, () => console.log(`Ready @ http://localhost:${port}`)) // eslint-disable-line
