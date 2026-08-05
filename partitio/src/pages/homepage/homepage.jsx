import "./homepage.scss" 

import { FolderIcon, UsersIcon, MusicNoteIcon, ShieldCheckIcon } from "@phosphor-icons/react";
function HomePage() {
    return(
        <div className="homepage">
            <div className="top">
                <div className="logo">
                    <img src="/logo.png" alt="logo" />
                    <p>Partitio</p>
                </div>
                <div className="buttons">
                    <button className="loginBtn">Se connecter</button>
                    <button className="registerBtn">Créer un compte</button>
                </div>
            </div>
            <div className="bottom">
                <div className="hero">
                    <div className="leftText">
                        <p className="topText">Gérez vos partiitions, jouez <span>ensemble.</span></p>
                        <p>Partitio est un outil pour organiser vos partitions, collaborer avec vos ensembles et ne jamais perdre le fil de votre musique.</p>
                    </div>
                    <img src="/dashboard.png" alt="dashboard" />
                </div>
                <div className="cards">
                    <div className="card green">
                        <FolderIcon size={32} />
                        <div className="text">
                            <p className="firstLine">Centralisez vos partitions</p>
                            <p className="secondLine">Importez, organisez et retrouvez toutes vos partitons en un seul endroit.</p>
                        </div>
                    </div>
                    <div className="card orange">
                        <UsersIcon size={32} />
                        <div className="text">
                            <p className="firstLine">Collaborez avec vos ensembles</p>
                            <p className="secondLine">Partagez et travaillez ensemble en toute simplicité.</p>
                        </div>
                    </div>
                    <div className="card purple">
                        <MusicNoteIcon size={32} />
                        <div className="text">
                            <p className="firstLine">Préparez vos répétitions</p>
                            <p className="secondLine">Accédez à vos morceaux à tout moment et soyez prêt pour chaque répétition.</p>
                        </div>
                    </div>
                    <div className="card blue">
                        <ShieldCheckIcon  size={32} />
                        <div className="text">
                            <p className="firstLine">Vos données en sécurité</p>
                            <p className="secondLine">Vos partitions sont sauvegardées et sécurisées. Votre musique vous appartient.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;