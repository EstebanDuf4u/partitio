import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { findUserByEmail } from '../repositories/users.js'

export const loginRouter = Router()

loginRouter.post('/', async (request, response, next) => {
  try {
    const { email, password } = request.body

    if (!email?.trim() || !password) {
      return response.status(400).json({ error: 'Mail et mot de passe requis.' })
    }

    const user = await findUserByEmail(email)

    if (!user) {
      return response.status(401).json({ error: 'Identifiants invalides.' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return response.status(401).json({ error: 'Identifiants invalides.' })
    }

    response.json({
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        createdAt: user.created_at,
      },
    })
  } catch (error) {
    next(error)
  }
})
