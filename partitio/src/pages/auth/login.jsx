import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './login.scss'

const initialForm = {
    email: '',
    password: '',
}

function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState(initialForm)
    const [submitted, setSubmitted] = useState(false)
    const [status, setStatus] = useState({ type: '', message: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const errors = useMemo(() => {
        const nextErrors = {}

        if (!form.email.trim()) {
            nextErrors.email = 'Le mail est requis.'
        }
        //Ajouter email erroné ou non

        if (!form.password) {
            nextErrors.password = 'Le mot de passe est requis.'
        }
        //Ajouter mdp erroné ou non

        return nextErrors
    }, [form])

    const isValid = Object.keys(errors).length === 0

    function updateField(event) {
        const { name, value, type, checked } = event.target

        setStatus({ type: '', message: '' })
        setForm((currentForm) => ({
            ...currentForm,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setSubmitted(true)
        setStatus({ type: '', message: '' })

        if (!isValid) return

        setIsSubmitting(true)

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                setStatus({ type: 'error', message: data.error || 'Connexion impossible.' })
                return
            }

            setForm(initialForm)
            setSubmitted(false)
            setStatus({ type: 'success', message: 'Connexion reussie.' })
            navigate('/dashboard', { replace: true })
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
        <main className="connexion-page">
            <aside className="connexion-brand">
                <div>
                    <div className="connexion-logo">
                        <span aria-hidden="true">♪</span>
                        <strong>Partitio</strong>
                    </div>
                    <p>Gerer vos partitions en toute harmonie</p>
                </div>
            </aside>

            <section className="connexion-panel" aria-labelledby="connexion-title">
                <div className="connexion-intro">
                    <p className="connexion-kicker">Partitio</p>
                    <h1 id="connexion-title">Connexion</h1>
                    <p>Entre tes informations de connexion. Le captcha pourra etre ajoute ici plus tard.</p>
                </div>

                <form className="connexion-form" onSubmit={handleSubmit} noValidate>

                    <label className="field">
                        <span>Mail</span>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={updateField}
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
                            aria-invalid={Boolean(fieldError('password'))}
                        />
                        {fieldError('password') && <small>{fieldError('password')}</small>}
                    </label>

                    <div className="captcha-placeholder" aria-label="Captcha a venir">
                        Captcha à ajouter plus tard
                    </div>

                    {status.message && (
                        <p className={`connexion-status connexion-status--${status.type}`} role="status">
                            {status.message}
                        </p>
                    )}

                    <button className="connexion-submit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Connexion...' : 'Se connecter'}
                    </button>

                    <p className="auth-switch">
                        Pas encore de compte ? <Link to="/signup">Creer un compte</Link>
                    </p>
                </form>
            </section>
        </main>
    )
}

export default Login
