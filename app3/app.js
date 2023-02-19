const express = require('express')
const app = express()
const port = 8083

app.get('/', (req, res) => {
  res.send('server3!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

