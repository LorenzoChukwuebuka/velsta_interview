const express = require('express')
const controller = require('../Controller/droneController')

const router = express.Router()

router.post('/drone', controller.createDrone)
router.get('/drone/:id', controller.getSingleDrone)
router.get('/drone', controller.getDrones)
router.post('/medication', controller.createMedication)
router.get('/dronebattery/:id', controller.getDronesBattery)

module.exports = router
