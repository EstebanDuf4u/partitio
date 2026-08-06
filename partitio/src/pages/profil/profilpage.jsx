import { useState, useEffect } from 'react'
import './profilpage.scss'
import LeftPanel from '../../components/leftPanel/leftPanel'
import { PenIcon, TrashIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from "@phosphor-icons/react";
import Voice from '../../components/voice/voice';
import { useNavigate } from 'react-router-dom';

import FETCH_BASE_URL from '../../fetch_url';

const initialForm = {
    firstName: '',
    lastName: '',
    email: '',
    voiceType: '',
    phone: '',
    town: '',
    image: ''
}

function Profil() {
    const [form, setForm] = useState(initialForm)
    const [isEditing, setIsEditing] = useState(false)
    const [profileImage, setProfileImage] = useState(null)

    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetch(FETCH_BASE_URL + '/api/me', {
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) throw new Error()
                return response.json()
            })
            .then(({ user }) => {
                setUser(user)

                setForm({
                    firstName: user.firstName ?? '',
                    lastName: user.lastName ?? '',
                    email: user.email ?? '',
                    phone: user.phone ?? '',
                    town: user.town ?? '',
                    voiceType: user.voiceType ?? '',
                    image: user.profileImageUrl ?? ''
                })
            })
            .catch(() => navigate('/login', {
                replace: true,
                state: { from: location.pathname }
            }))
    }, [navigate])

    if (!user) return null

    const deleteProfile = () => {
        const confirmation = window.confirm(
            'Voulez-vous vraiment supprimer votre profil ? Cette action est définitive.'
        )

        if (!confirmation) {
            return
        }

        fetch(FETCH_BASE_URL + '/api/me', {
            method: 'DELETE',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Impossible de supprimer le profil')
                }

                return response.json()
            })
            .then(() => {
                navigate('/login', { replace: true })
            })
            .catch(error => {
                console.error(error)
            })
    }

    const updateProfile = async (event) => {
        event.preventDefault()

        try {
            let imagePath = user?.profileImageUrl ?? null

            if (profileImage) {
                const imageFormData = new FormData()
                imageFormData.append('file', profileImage)

                const responseImage = await fetch(FETCH_BASE_URL + '/api/uploads/profile-images', {
                    method: 'POST',
                    credentials: 'include',
                    body: imageFormData
                })

                if (!responseImage.ok) {
                    throw new Error("Impossible d'enregistrer l'image")
                }

                imagePath = await responseImage.text()
            }

            const response = await fetch(FETCH_BASE_URL + '/api/me', {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    profileImageUrl: imagePath,
                    phone: form.phone,
                    town: form.town,
                    voiceType: form.voiceType
                })
            })

            if (!response.ok) {
                throw new Error('Impossible de modifier le profil')
            }

            const data = await response.json()

            setUser(data.user)

            setForm({
                firstName: data.user.firstName ?? '',
                lastName: data.user.lastName ?? '',
                email: data.user.email ?? '',
                phone: data.user.phone ?? '',
                town: data.user.town ?? '',
                voiceType: data.user.voiceType ?? '',
                image: data.user.profileImageUrl ?? ''
            })
            setProfileImage(null)
            setIsEditing(false)
        } catch (error) {
            console.error(error)
        }
    }

    const getProfileImageUrl = () => {
        if (profileImage) {
            return URL.createObjectURL(profileImage)
        }

        if (user?.profileImageUrl) {
            return `http://localhost:3000${user.profileImageUrl}`
        }

        return '/utilisateurtest.jpg'
    }

    return (
        <>
            <main className="profil-page">
                <LeftPanel user={user} />
                <div className="profil-content">
                    <p className="profil-kicker">Mon profil</p>
                    <section className="profil-panel" aria-labelledby="profil-title">

                        <div className="profil-intro">

                            <label
                                className={`profil-image-wrapper ${isEditing ? 'is-editing' : ''}`}
                                htmlFor={isEditing ? 'profileImageInput' : undefined}
                            >
                                <img
                                    className="profil-image"
                                    src={getProfileImageUrl()}
                                    alt="Photo de profil"
                                    onError={(event) => {
                                        console.error(
                                            "Impossible de charger l'image :",
                                            event.currentTarget.src
                                        )
                                    }}
                                />

                                {isEditing && (
                                    <div className="profil-image-overlay">
                                        <PenIcon />
                                    </div>
                                )}
                            </label>

                            {isEditing && (
                                <input
                                    id="profileImageInput"
                                    className="profil-image-input"
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={(event) => {
                                        const selectedFile = event.target.files?.[0]

                                        if (selectedFile) {
                                            setProfileImage(selectedFile)
                                        }
                                    }}
                                />
                            )}

                            <div className="userIdentity">
                                <div className="userName">
                                    {isEditing ? (
                                        <><label>Prénom</label>
                                            <input className="userFirstNameInput"
                                                type="text"
                                                value={form.firstName}
                                                placeholder="Prénom"
                                                onChange={(event) =>
                                                    setForm({
                                                        ...form,
                                                        firstName: event.target.value
                                                    })
                                                }
                                            /></>
                                    ) : (
                                        <p className="userFirstName">{user?.firstName}</p>)}
                                    {isEditing ? (
                                        <><label>Nom</label>
                                            <input className="userLastNameInput"
                                                type="text"
                                                value={form.lastName}
                                                placeholder="Nom"
                                                onChange={(event) => {
                                                    setForm({ ...form, lastName: event.target.value });
                                                    console.log(event.target.value);
                                                }

                                                }
                                            /></>
                                    ) : (
                                        <p className="userLastName">{user?.lastName}</p>)}
                                </div>
                                {isEditing ? (
                                    <>
                                        <label htmlFor="voiceType">Choisissez un type de voix :</label>
                                        <select name="voices" id="voiceSelect" value={form.voiceType}
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    voiceType: event.target.value
                                                })
                                            }
                                        >
                                            <option value="">--Veuillez choisir une option--</option>
                                            <option value="soprano">Soprano</option>
                                            <option value="alto">Alto</option>
                                            <option value="tenor">Ténor</option>
                                            <option value="basse">Basse</option>
                                        </select>
                                    </>
                                ) : (
                                    <>
                                        {user?.voiceType ? <Voice voice={user.voiceType} nbreVoice={1} /> : <Voice voice={"Soprano"} nbreVoice={1} />}
                                    </>
                                )}

                            </div>

                            <div className="userInformation">
                                {isEditing ? (
                                    <><label>Email</label>
                                        <input className="userEmailInput"
                                            type="email"
                                            value={form.email}
                                            placeholder="Email"
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    email: event.target.value
                                                })
                                            }
                                        /></>
                                ) : (
                                    <p className="userEmail"><EnvelopeIcon />{user?.email}</p>)}
                                <hr />
                                {isEditing ? (
                                    <> <label>Numéro de téléphone</label>
                                        <input className="userPhoneInput"
                                            type="text"
                                            value={form.phone}
                                            placeholder="Numéro de téléphone"
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    phone: event.target.value
                                                })
                                            }
                                        /></>
                                ) : (
                                    <p className="userPhone"><PhoneIcon />{user?.phone || 'Numéro de téléphone'}</p>)}
                                <hr />
                                {isEditing ? (
                                    <>
                                        <label>Ville</label>
                                        <input className="userTownInput"
                                            type="text"
                                            value={form.town}
                                            placeholder="Ville"
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    town: event.target.value
                                                })
                                            }
                                        />
                                    </>
                                ) : (
                                    <p className="userTown"><MapPinIcon />{user?.town || 'Ville'}</p>)}
                            </div>

                            <div className="buttonsCard">
                                {isEditing ? (
                                    <>
                                        <button className="buttonModify buttonBouton" onClick={updateProfile}>
                                            Valider
                                        </button>

                                        <button className="buttonDelete buttonBouton" onClick={() => setIsEditing(false)}>
                                            Annuler
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="buttonModify buttonBouton" onClick={() => setIsEditing(true)}><PenIcon /> Modifier le profil</button>
                                        <button className="buttonDelete buttonBouton" onClick={deleteProfile}><TrashIcon />Supprimer le profil</button>
                                    </>
                                )}
                            </div>

                        </div>


                    </section>
                </div>
            </main>
        </>
    )
}

export default Profil
