const express = require('express')
const request = require('request')
const cheerio = require('cheerio')
const path = require("path");
const app = express()

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/:school/:course', (req, res) => {
  const school = req.params.school ? req.params.school  : 'politecnica'
  const course = req.params.course ? req.params.course : 'engenharia-de-software'

  const url = `http://www.pucrs.br/${school}/curso/${course}/#curriculos`

  request(url, (err, res, body) => {
    if (err) return console.error(err)

    const $ = cheerio.load(body)
    const data = $('.conteudo table tbody tr').toArray()
      .map(tag => ({
        school: school,
        course: course,
        semester: $(tag).find('td').eq(0).text(),
        code: $(tag).find('td').eq(1).text(),
        discipline: $(tag).find('td').eq(2).text(),
        hours: $(tag).find('td').eq(3).text()
      }))
      .filter(value => value.semester !== '' && 
                       value.code !== '' &&
                       value.discipline !== '' &&
                       value.hours !== '')

      console.log('\nJSON RESULT: \n\n', JSON.stringify(data))
  })
})

app.listen('3000')
console.log('\nRunning in http://localhost:3000/ \n\n')
exports = module.exports = app