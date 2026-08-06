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

                setForm(form => ({
                    ...form,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }))
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

    const updateProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        fetch('/api/uploads/profile-images', {
            method: "POST",
            credentials: 'include',
            body: ImageformData,
        })

        const imagePath = await responseImage.text();
        g
        console.log(imagePath);
        //     .then(response => {
        //     if (!response.ok) {
        //         throw new Error('Impossible de modifier le profil')
        //     }

        //     return response.json()
        // })
        // .then(({ user }) => {
        //     setUser(user)
        //     setIsEditing(false)
        // })
        // .catch(error => {
        //     console.error(error)
        // })
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
                                    src={profileImage ? URL.createObjectURL(profileImage) : '/utilisateurtest.jpg'}
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
                                        {form.voiceType ? <Voice voice={form.voiceType} nbreVoice={1} /> : <Voice voice={"Soprano"} nbreVoice={1} />}
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
                                    <p className="userPhone"><PhoneIcon />Numéro de téléphone</p>)}
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
                                    <p className="userTown"><MapPinIcon />Ville</p>)}
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
