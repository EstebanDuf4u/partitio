import { Router } from 'express'
import { pool } from '../db.js'

export const healthRouter = Router()

healthRouter.get('/', async (_request, response, next) => {
  try {
    await pool.query('SELECT 1')
    response.json({ status: 'ok' })
  } catch (error) {
    next(error)
  }
})
