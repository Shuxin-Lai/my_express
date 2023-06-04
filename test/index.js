const express = require('../src/index')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/json', (req, res, next) => {
  console.log('1')
  res.json({
    name: 'get',
  })
  next()
})
app.get('/json', (req, res) => {
  console.log('2')
})

app.put('/json', (req, res) => {
  res.json({
    name: 'put',
  })
})

app.post('/json', (req, res) => {
  res.json({
    name: 'post',
  })
})

app.listen(3000, () => {
  console.log('Example app listening http://localhost:3000')
})
