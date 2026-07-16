import { useState, useEffect } from 'react'
import './profilpage.scss'
import LeftPanel from '../components/leftPanel/leftPanel'
import { PenIcon, TrashIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from "@phosphor-icons/react";

const initialForm = {
    firstName: '',
    lastName: '',
    email: '',
    voiceType: '',
    phone: '',
    town: ''
}



function Profil() {
    const [form, setForm] = useState(initialForm)
    const [user, setUser] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [profileImage, setProfileImage] = useState(null)

    useEffect(() => {
        fetch('/api/me', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Impossible de récupérer le profil')
                }

                return response.json()
            })
            .then(data => {
                setUser(data.user)

                setForm({
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                    email: data.user.email
                })
            })
            .catch(error => {
                console.error(error)
            })
    }, [])

    const deleteProfile = (() => {
        console.log("test deleteProfile");
    })

    return (
        <>
            <main className="profil-page">
                <LeftPanel />
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
                                    src={
                                        profileImage
                                            ? URL.createObjectURL(profileImage)
                                            : '/utilisateurtest.jpg'
                                    }
                                    alt="Photo de profil"
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
                                        <input className="userFirstNameInput"
                                            type="text"
                                            value={form.firstName}
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    firstName: event.target.value
                                                })
                                            }
                                        />
                                    ) : (
                                        <p className="userFirstName">{user?.firstName}</p>)}
                                    {isEditing ? (
                                        <input className="userLastNameInput"
                                            type="text"
                                            value={form.lastName}
                                            onChange={(event) =>
                                                setForm({
                                                    ...form,
                                                    lastName: event.target.value
                                                })
                                            }
                                        />
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
                                    <p className="userVoice">{form.voiceType || 'Type de voix'}</p>)}

                            </div>

                            <div className="userInformation">
                                {isEditing ? (
                                    <input className="userEmailInput"
                                        type="email"
                                        value={form.email}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                email: event.target.value
                                            })
                                        }
                                    />
                                ) : (
                                    <p className="userEmail"><EnvelopeIcon />{user?.email}</p>)}
                                <hr />
                                {isEditing ? (
                                    <input className="userPhoneInput"
                                        type="text"
                                        value={form.phone}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                phone: event.target.value
                                            })
                                        }
                                    />
                                ) : (
                                    <p className="userPhone"><PhoneIcon />Numéro de téléphone</p>)}
                                <hr />
                                {isEditing ? (
                                    <input className="userTownInput"
                                        type="text"
                                        value={form.town}
                                        onChange={(event) =>
                                            setForm({
                                                ...form,
                                                town: event.target.value
                                            })
                                        }
                                    />
                                ) : (
                                    <p className="userTown"><MapPinIcon />Ville</p>)}
                            </div>

                            <div className="buttonsCard">
                                {isEditing ? (
                                    <>
                                        <button className="buttonModify buttonBouton">
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
