'use strict'
const res = require('express/lib/response')
const db = require('../db')
const { currentDate, sanitize } = require('../util')

const createDrone = (req, res) => {
  //sanitize and validate inputs
  let serial_number = sanitize(req.body.sNum)
  let model = sanitize(req.body.model)
  let weight_limit = 500
  let batteryCap = sanitize(req.body.batteryCap)
  let state = 'IDLE'

  if (serial_number && model && batteryCap) {
    //check if drone already exists

    db.query(
      'SELECT * FROM drone WHERE serial_number = ?',
      [serial_number],
      (errs, row) => {
        if (!errs) {
          if (row.length > 0) {
            //if drone exists
            return res.json({ message: 'Drone already exists' })
          } else {
            //run insert query
            db.query(
              'INSERT INTO drone( serial_number, model, weight, battery_percent, state, date_created) VALUES (?,?,?,?,?,?)',
              [
                serial_number,
                model,
                weight_limit,
                batteryCap,
                state,
                currentDate()
              ],
              (err, rows) => {
                if (!err) {
                  return res.json({ message: 'Inserted successfull' })
                } else {
                  return err
                }
              }
            )
          }
        } else {
          return errs
        }
      }
    )
  } else {
    return res.json({ message: 'Invalid data' })
  }
}

const createMedication = (req, res) => {
  //sanitize and validate inputs
  let drone_id = req.body.drone_id
  let name = sanitize(req.body.name)
  let weight = req.body.weight
  let code = sanitize(req.body.code)

  if (drone_id && name && weight && code) {
    //check if weight is greater than 500
    if (Number(weight) > 500) {
      return res.json({ message: 'weight is too much for the drone' })
    } else {
      //check for battery percentage
      db.query(
        'SELECT * FROM drone WHERE id = ? LIMIT 1',
        [drone_id],
        (err, rows) => {
          if (!err) {
            //check if id exists
            if (rows.length > 0) {
              //check if battery is below given percentage that is 25
              if (rows[0]['battery_percent'] <= 25) {
                return res.json({ message: 'Battery too low for flight' })
              } else {
                //insert query
                db.query(
                  'INSERT INTO medication( drone_id, name, weight, code, date_created) VALUES (?,?,?,?,?)',
                  [drone_id, name, weight, code, currentDate()],
                  (ierr, resp) => {
                    if (!ierr) {
                      //update state to loading

                      db.query(
                        'UPDATE drone SET state="LOADING"',
                        (uerr, response) => {
                          if (!uerr) {
                            return res.json({ message: 'medication loaded' })
                          } else {
                            console.log(uerr)
                          }
                        }
                      )
                    } else {
                      console.log(ierr)
                    }
                  }
                )
              }
            }
          } else {
            return err
          }
        }
      )
    }
  } else {
    return res.json({ message: 'Invalid inputs' })
  }
}

const getSingleDrone = (req, res) => {
  let id = req.params.id
  db.query(
    'SELECT medication.*,drone.* FROM medication JOIN drone ON drone.id = medication.drone_id WHERE drone_id =?',
    [id],
    (err, rows) => {
      if (!err) {
        return res.send(rows)
      } else {
        return err
      }
    }
  )
}

const getDronesBattery = (req, res) => {
  let id = req.params.id
  db.query(
    'SELECT battery_percent FROM drone WHERE id =?',
    [id],
    (err, rows) => {
      if (!err) {
        return res.send(rows)
      } else {
        return err
      }
    }
  )
}

const getDrones = (req, res) => {
  db.query('SELECT * FROM drone WHERE state = "IDLE"', (err, rows) => {
    if (!err) {
      if (rows.length > 0) {
        return res.send(rows)
      } else {
        return res.json({ message: 'No drones found' })
      }
    } else {
      return err
    }
  })
}

exports.createDrone = createDrone
exports.createMedication = createMedication
exports.getSingleDrone = getSingleDrone
exports.getDrones = getDrones
exports.getDronesBattery = getDronesBattery
