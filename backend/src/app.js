import cors from 'cors'
import express from 'express'
import { healthRouter } from './routes/health.js'
import { loginRouter } from './routes/login.js'
import { signupRouter } from './routes/signup.js'

export function createApp() {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use('/api/health', healthRouter)
  app.use('/api/login', loginRouter)
  app.use('/api/signup', signupRouter)

  app.use((error, _request, response, _next) => {
    console.error(error)
    response.status(500).json({ error: 'Erreur serveur.' })
  })

  return app
}
