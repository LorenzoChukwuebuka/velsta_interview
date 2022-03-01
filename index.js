const express = require('express')
const cors = require('cors')
const db = require('./db')
const helmet = require('helmet')
const auth = require('./Routes/DroneRoutes')
const fs = require('fs')
const { currentDate } = require('./util')
var os = require('os')
const app = express()

app.use(cors())
app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//routes go here

app.use('/api/test', auth)

//checks for drones battery levels
setInterval(() => {
  db.query(
    'SELECT id,serial_number,battery_percent FROM drone',
    (err, rows) => {
      if (!err) {
        if (rows.length > 0) {
          rows.forEach(element => {
			  //writes to file 
            fs.appendFile(
              'logs.txt',
              `Time logged:${currentDate()}. Drone serial Number:${
                element.serial_number
              }. Drone battery percentage: ${element.battery_percent}` + os.EOL,
              errs => {
                if (!errs) {
                  console.log('completed')
                } else {
                  console.log(errs)
                }
              }
            )
          })
        }
      } else {
        console.log(err)
      }
    }
  )
}, 1000)

const PORT = process.env.PORT || 3000

db.connect(err => {
  if (err) {
    return 'network Error'
  }
})

app.listen(PORT, console.log(`Server running on ${PORT}`))
