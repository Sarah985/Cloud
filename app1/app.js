const express = require('express')
const app = express()
const port = 8081

app.get('/', (req, res) => {
  res.send('server 1!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

