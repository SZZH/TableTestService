const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

let data = []

data.push({
  id: 1,
  name: 'zh' + 1,
  age: 21,
  sex: 0,
  time: '20200101',
  twoTime: ['20200101', '20200202']
})

for(let i = 0; i < 100; i++) {
  data.push({
    id: Math.round((Math.random() + 10) * 100) + Date.now(),
    name: 'zh' + (i + 1),
    age: 21,
    sex: 0,
    time: '20200101',
    twoTime: ['20200101', '20200202']
  })
}

app.post('/addItem', (req, res) => {
  const input = req.body.input
  data.push({
    ...input
  })

  console.log(data.length, 'length')
  res.send('success')
})

app.post('/getTableList', (request, response) => {
  const body = request.body

  if(!body.input || !body.current || !body.pageSize) {
    response.status(500).send('查询出错')
  }
  const start = body.current * Math.pow(10, body.current - 1) - 1
  let resultData = data.slice(start, start + body.pageSize)

  const searchKeys = Object.keys(body.input)
  if(searchKeys.length > 0) {
    resultData = resultData.filter(item => {
      for(let key in body.input) {
        if(typeof item[key] == 'object') {
          if(item[key][0] <= body.input[key][0] && item[key][1] >= body.input[key][1]) return true
        }else {
          if(item[key] && item[key].includes(body.input[key])) return true
        }
        return false
      }
    })
  }
 
  response.send({
    data: resultData,
    pagination: {
      current: body.current,
      pageSize: body.pageSize,
      total: data.length
    }
  })
})

app.post('/removeItem', (req, res) => {
  const { input: { id } } = req.body
  const result = data.filter(item => item.id !== id)
  data = result
  res.send('success')
})

app.listen(3333, (err) => {
  if(err) {
    console.error(err)
    return
  }

  console.log('服务启动成功端口号为 3333')
})
