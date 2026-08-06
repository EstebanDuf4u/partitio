import "./ensembles.scss";

import { useEffect, useMemo, useState } from "react";
import LeftPanel from "../../components/leftPanel/leftPanel";
import { useNavigate } from "react-router-dom";
import FETCH_BASE_URL from '../../fetch_url';
import { Input } from '@mantine/core';
import {
    CalendarDotsIcon,
    CheckCircleIcon,
    MagnifyingGlassIcon,
    MusicNoteIcon,
    PlusIcon,
    UserPlusIcon,
    UsersIcon
} from '@phosphor-icons/react';

const ensembles = [
    {
        id: 1,
        name: "Chorale Saint-Martin",
        type: "Chorale mixte",
        role: "Chef de pupitre",
        members: 42,
        pieces: 18,
        nextDate: "Jeudi 18:30",
        status: "Actif",
        initials: "SM",
        color: "green"
    },
    {
        id: 2,
        name: "Les Voix du Sud",
        type: "Ensemble vocal",
        role: "Soprano",
        members: 24,
        pieces: 12,
        nextDate: "Samedi 10:00",
        status: "Invitation",
        initials: "VS",
        color: "orange"
    },
    {
        id: 3,
        name: "Atelier Gospel",
        type: "Gospel",
        role: "Alto",
        members: 31,
        pieces: 9,
        nextDate: "Mardi 19:15",
        status: "Actif",
        initials: "AG",
        color: "purple"
    },
    {
        id: 4,
        name: "Quatuor Horizon",
        type: "Petit ensemble",
        role: "Ténor",
        members: 4,
        pieces: 7,
        nextDate: "Vendredi 20:00",
        status: "Pause",
        initials: "QH",
        color: "blue"
    }
];

function Ensembles() {
    const [search, setSearch] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const filteredEnsembles = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        if (!searchValue) return ensembles;

        return ensembles.filter((ensemble) =>
            `${ensemble.name} ${ensemble.type} ${ensemble.role} ${ensemble.status}`
                .toLowerCase()
                .includes(searchValue)
        );
    }, [search]);

    const totalMembers = ensembles.reduce((total, ensemble) => total + ensemble.members, 0);
    const activeEnsembles = ensembles.filter((ensemble) => ensemble.status === "Actif").length;

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
            })
            .catch(() => navigate('/login', {
                replace: true,
                state: { from: window.location.pathname }
            }))
    }, [navigate]);

    if (!user) return null;

    return (
        <div className="ensemblesLayout">
            <LeftPanel user={user} />
            <main className="ensemblesPage">
                <header className="ensemblesHeader">
                    <div className="ensemblesHeading">
                        <p className="ensemblesEyebrow">Ensembles</p>
                        <h1>Mes ensembles</h1>
                        <p>Retrouvez vos groupes, leurs morceaux et les prochaines répétitions.</p>
                    </div>
                    <div className="ensemblesActions">
                        <button className="ensemblesAction secondary" type="button">
                            <UserPlusIcon />
                            <span>Rejoindre</span>
                        </button>
                        <button className="ensemblesAction primary" type="button">
                            <PlusIcon />
                            <span>Créer</span>
                        </button>
                    </div>
                </header>

                <section className="ensemblesStats" aria-label="Résumé des ensembles">
                    <article className="ensembleStat">
                        <UsersIcon />
                        <div>
                            <p>{ensembles.length}</p>
                            <span>Ensembles</span>
                        </div>
                    </article>
                    <article className="ensembleStat">
                        <CheckCircleIcon />
                        <div>
                            <p>{activeEnsembles}</p>
                            <span>Actifs</span>
                        </div>
                    </article>
                    <article className="ensembleStat">
                        <UsersIcon />
                        <div>
                            <p>{totalMembers}</p>
                            <span>Membres</span>
                        </div>
                    </article>
                    <article className="ensembleStat">
                        <MusicNoteIcon />
                        <div>
                            <p>46</p>
                            <span>Morceaux</span>
                        </div>
                    </article>
                </section>

                <section className="ensemblesToolbar">
                    <Input
                        className="ensemblesSearch"
                        placeholder="Rechercher un ensemble"
                        leftSection={<MagnifyingGlassIcon size={28} />}
                        value={search}
                        onChange={(event) => setSearch(event.currentTarget.value)}
                    />
                    <div className="ensemblesCount">
                        {filteredEnsembles.length} résultat{filteredEnsembles.length > 1 ? "s" : ""}
                    </div>
                </section>

                <section className="ensemblesContent">
                    <div className="ensemblesGrid" aria-label="Liste des ensembles">
                        {filteredEnsembles.map((ensemble) => (
                            <article className={`ensembleCard ${ensemble.color}`} key={ensemble.id}>
                                <div className="ensembleCardTop">
                                    <div className="ensembleAvatar">{ensemble.initials}</div>
                                    <span className="ensembleStatus">{ensemble.status}</span>
                                </div>
                                <div className="ensembleCardText">
                                    <h2>{ensemble.name}</h2>
                                    <p>{ensemble.type}</p>
                                </div>
                                <div className="ensembleRole">{ensemble.role}</div>
                                <div className="ensembleMeta">
                                    <span>
                                        <UsersIcon />
                                        {ensemble.members} membres
                                    </span>
                                    <span>
                                        <MusicNoteIcon />
                                        {ensemble.pieces} morceaux
                                    </span>
                                    <span>
                                        <CalendarDotsIcon />
                                        {ensemble.nextDate}
                                    </span>
                                </div>
                                <button className="ensembleOpenButton" type="button">
                                    Ouvrir
                                </button>
                            </article>
                        ))}
                    </div>

                    <aside className="ensemblesSide">
                        <section className="ensemblePanel">
                            <div className="ensemblePanelTitle">
                                <h2>Prochaine répétition</h2>
                                <CalendarDotsIcon />
                            </div>
                            <p className="ensemblePanelMain">Chorale Saint-Martin</p>
                            <p className="ensemblePanelMuted">Jeudi 18:30 - Salle Berlioz</p>
                        </section>

                        <section className="ensemblePanel">
                            <div className="ensemblePanelTitle">
                                <h2>Invitation en attente</h2>
                                <UserPlusIcon />
                            </div>
                            <p className="ensemblePanelMain">Les Voix du Sud</p>
                            <div className="ensembleInviteActions">
                                <button type="button">Accepter</button>
                                <button type="button">Refuser</button>
                            </div>
                        </section>
                    </aside>
                </section>
            </main>
        </div>
    );
}

export default Ensembles;
