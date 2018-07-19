const express = require('express')
const request = require('request')
const cheerio = require('cheerio')
const eachSeries = require("async/eachSeries")
const path = require("path")
const fs = require('fs')
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

      console.log('\n\n JSON RESULT: \n\n', JSON.stringify(data))
  })
})

app.get('/all', (req, res) => {
  let school = null
  let course = null

  _readCourses()
    .then(courses => {
      if (courses.length > 0) {
        eachSeries(courses, (data, callback) => {
          school = data.split(";")[0]
          course = data.split(";")[1]

          const url = `http://www.pucrs.br/${school}/curso/${course}/#curriculos`

          request(url, (err, res, body) => {
            if (err) return console.error(err)

            const $ = cheerio.load(body)
            const info = $('.conteudo table tbody tr').toArray()
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

            console.log(`  LOADING ${school}: ${course}... `)
            const json = JSON.stringify(info)
            fs.writeFile(`results/${course}.json`, json, 'utf8', callback)
          })
        })
      }
    })
})

function _readCourses() {
  return new Promise((resolve, reject) => {
    fs.readFile('courses', 'utf8', (err, data) => {
      if (err) {
        return reject(err)
      }
  
      const arr = data.replace(/ - /g, ';').split('\n')
      resolve(arr.map(course => _parse(course)))
    })
  })
}

const map = {"â":"a","Â":"A","à":"a","À":"A","á":"a","Á":"A","ã":"a","Ã":"A","ê":"e","Ê":"E","è":"e","È":"E","é":"e","É":"E","î":"i","Î":"I","ì":"i","Ì":"I","í":"i","Í":"I","õ":"o","Õ":"O","ô":"o","Ô":"O","ò":"o","Ò":"O","ó":"o","Ó":"O","ü":"u","Ü":"U","û":"u","Û":"U","ú":"u","Ú":"U","ù":"u","Ù":"U","ç":"c","Ç":"C"," ":"-"}
function _parse(s){ return s.replace(/[\W\[\] ]/g,function(a){return map[a]||a}) }

app.listen('3000')
console.log('\nRunning in http://localhost:3000/ \n\n')
exports = module.exports = app