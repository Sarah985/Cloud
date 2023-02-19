const express = require('express')
const app = express()
const port = 8082

app.get('/', (req, res) => {
  res.send('server 2!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

