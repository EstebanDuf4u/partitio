import { useMemo, useState } from 'react'
import './signup.scss'

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false,
}

function SignUp() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [verificationLink, setVerificationLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const errors = useMemo(() => {
    const nextErrors = {}

    if (!form.firstName.trim()) nextErrors.firstName = 'Le prenom est requis.'
    if (!form.lastName.trim()) nextErrors.lastName = 'Le nom est requis.'
    if (!form.email.trim()) {
      nextErrors.email = 'Le mail est requis.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Entre une adresse mail valide.'
    }

    if (!form.password) {
      nextErrors.password = 'Le mot de passe est requis.'
    } else if (form.password.length < 8) {
      nextErrors.password = 'Utilise au moins 8 caracteres.'
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = 'Confirme ton mot de passe.'
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Les mots de passe ne correspondent pas.'
    }

    if (!form.terms) nextErrors.terms = 'Tu dois accepter les conditions generales.'

    return nextErrors
  }, [form])

  const isValid = Object.keys(errors).length === 0

  function updateField(event) {
    const { name, value, type, checked } = event.target

    setStatus({ type: '', message: '' })
    setVerificationLink('')
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setStatus({ type: '', message: '' })
    setVerificationLink('')

    if (!isValid) return

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          terms: form.terms,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setStatus({ type: 'error', message: data.error || "L'inscription a echoue." })
        return
      }

      alert(`Bienvenue ${data.user.firstName} ${data.user.lastName}`)
      setVerificationLink(data.verificationLink || '')
      setForm(initialForm)
      setSubmitted(false)
      setStatus({ type: 'success', message: 'Compte cree. Valide ton email pour te connecter.' })
    } catch {
      setStatus({ type: 'error', message: 'Impossible de joindre le serveur.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  function fieldError(name) {
    return submitted ? errors[name] : ''
  }

  return (
    <main className="signup-page">
      <aside className="signup-brand">
        <div>
          <div className="signup-logo">
            <span aria-hidden="true">♪</span>
            <strong>Partitio</strong>
          </div>
          <p>Gerer vos partitions en toute harmonie</p>
        </div>
      </aside>

      <section className="signup-panel" aria-labelledby="signup-title">
        <div className="signup-intro">
          <p className="signup-kicker">Partitio</p>
          <h1 id="signup-title">Creer un compte</h1>
          <p>Entre tes informations pour commencer. Le captcha pourra etre ajoute ici plus tard.</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <div className="signup-grid">
            <label className="field">
              <span>Prenom</span>
              <input
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={updateField}
                autoComplete="given-name"
                aria-invalid={Boolean(fieldError('firstName'))}
              />
              {fieldError('firstName') && <small>{fieldError('firstName')}</small>}
            </label>

            <label className="field">
              <span>Nom</span>
              <input
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={updateField}
                autoComplete="family-name"
                aria-invalid={Boolean(fieldError('lastName'))}
              />
              {fieldError('lastName') && <small>{fieldError('lastName')}</small>}
            </label>
          </div>

          <label className="field">
            <span>Mail</span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              aria-invalid={Boolean(fieldError('email'))}
            />
            {fieldError('email') && <small>{fieldError('email')}</small>}
          </label>

          <label className="field">
            <span>Mot de passe</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              autoComplete="new-password"
              aria-invalid={Boolean(fieldError('password'))}
            />
            {fieldError('password') && <small>{fieldError('password')}</small>}
          </label>

          <label className="field">
            <span>Confirmation du mot de passe</span>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={updateField}
              autoComplete="new-password"
              aria-invalid={Boolean(fieldError('confirmPassword'))}
            />
            {fieldError('confirmPassword') && <small>{fieldError('confirmPassword')}</small>}
          </label>

          <div className="captcha-placeholder" aria-label="Captcha a venir">
            Captcha a ajouter plus tard
          </div>

          <label className="terms">
            <input name="terms" type="checkbox" checked={form.terms} onChange={updateField} />
            <span>J'accepte les conditions generales.</span>
          </label>
          {fieldError('terms') && <small className="terms-error">{fieldError('terms')}</small>}

          {status.message && (
            <p className={`signup-status signup-status--${status.type}`} role="status">
              {status.message}
            </p>
          )}

          {verificationLink && (
            <a className="signup-status signup-status--success" href={verificationLink}>
              Valider mon email
            </a>
          )}

          <button className="signup-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>
      </section>
    </main>
  )
}

export default SignUp
