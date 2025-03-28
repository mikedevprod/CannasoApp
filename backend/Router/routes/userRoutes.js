import express from 'express'
import { getSocios } from '../../controllers/userController.js'

const sociosRoute = express.Router()

sociosRoute.get("/socios", getSocios)

export default sociosRoute