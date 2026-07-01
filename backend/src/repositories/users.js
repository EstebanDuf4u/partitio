import { pool } from '../db.js'

export async function createUser({ firstName, lastName, email, passwordHash, acceptedTerms }) {
  const result = await pool.query(
    `
      INSERT INTO users (first_name, last_name, email, password_hash, accepted_terms)
      VALUES ($1, $2, LOWER($3), $4, $5)
      RETURNING id, first_name, last_name, email, created_at;
    `,
    [firstName.trim(), lastName.trim(), email.trim(), passwordHash, acceptedTerms],
  )

  return result.rows[0]
}

export async function findUserByEmail(email) {
  const result = await pool.query(
    `
      SELECT id, first_name, last_name, email, password_hash, created_at
      FROM users
      WHERE email = LOWER($1);
    `,
    [email.trim()],
  )

  return result.rows[0] || null
}
