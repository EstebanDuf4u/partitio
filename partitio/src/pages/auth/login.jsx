import { useMemo, useState } from 'react'
import './login.scss'

const initialForm = {
    email: '',
    password: '',
}

function Login() {
    const [form, setForm] = useState(initialForm)
    const [submitted, setSubmitted] = useState(false)

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

        setForm((currentForm) => ({
            ...currentForm,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()
        setSubmitted(true)

        if (!isValid) return
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

                    <button className="connexion-submit" type="submit">
                        Se connecter
                    </button>
                </form>
            </section>
        </main>
    )
}

export default Login
