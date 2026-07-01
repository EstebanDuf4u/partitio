import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { createUser } from '../repositories/users.js'

export const signupRouter = Router()

signupRouter.post('/', async (request, response, next) => {
  try {
    const { firstName, lastName, email, password, terms } = request.body

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password || terms !== true) {
      return response.status(400).json({ error: 'Champs invalides.' })
    }

    if (password.length < 8) {
      return response.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caracteres.' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await createUser({
      firstName,
      lastName,
      email,
      passwordHash,
      acceptedTerms: terms,
    })

    response.status(201).json({ user })
  } catch (error) {
    if (error.code === '23505') {
      return response.status(409).json({ error: 'Cette adresse mail est deja utilisee.' })
    }

    next(error)
  }
})
