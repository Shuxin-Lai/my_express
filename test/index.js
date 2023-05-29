const express = require('../src')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/json', (req, res) => {
  res.json({
    name: 'express',
  })
})

app.listen(3000, () => {
  console.log('Example app listening http://localhost:3000')
})
