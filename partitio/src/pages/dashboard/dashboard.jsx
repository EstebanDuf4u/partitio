import "./dashboard.scss";

import LeftPanel from "../../components/leftPanel/leftPanel";
import Nbre from "../../components/nbres/nbre";
import Morceau from "../../components/morceau/morceau";
import Ensemble from "../../components/ensemble/ensemble";
import MenuDashboard from "../../components/menuDashboard/menuDashboard";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Input } from '@mantine/core';
import { MagnifyingGlassIcon, MusicNoteIcon, UsersIcon, FileTextIcon } from '@phosphor-icons/react';

import FETCH_BASE_URL from '../../fetch_url';

function Dashboard() {
    const [search, setSearch] = useState("");
    const [user, setUser] = useState(null);
    const [pieces, setPieces] = useState([]);
    const [lastPieces, setLastPieces] = useState([]);
    const [ensembles, setEnsembles] = useState([]);
    const [nbreDocuments, setNbreDocuments] = useState(0);
    const navigate = useNavigate();

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
                state: { from: location.pathname }
            }))
    }, [navigate]);

    useEffect(() => {
        fetch(FETCH_BASE_URL + '/api/pieces', {
            credentials: "include"
        }).then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        }).then((data) => {
            setPieces(data);
            setLastPieces(data.slice(0, 5));
        }).catch(() => {
            setPieces([]);
            setLastPieces([]);
        });

        fetch(FETCH_BASE_URL + '/api/documents', {
            credentials: "include"
        }).then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        }).then((data) => {
            setNbreDocuments(data.length);
        }).catch(() => setNbreDocuments(0));

        fetch(FETCH_BASE_URL + '/api/ensembles', {
            credentials: "include"
        }).then(response => {
            if (!response.ok) throw new Error();
            return response.json();
        }).then((data) => {
            setEnsembles(data);
        }).catch(() => setEnsembles([]));

    }, []);

    if (!user) return null;

    return (
        <div className="all">
            <LeftPanel user={user} />
            <div className="panneauDroite">
                <div className="top">
                    <div className="texte">
                        <p className="textePrenom">Bonjour {user.firstName}!</p>
                        <p>Voici un aperçu de votre activité.</p>
                    </div>
                    <div className="recherche">
                        <Input className="searchInput" placeholder="Rechercher un morceau, un ensemble..." leftSection={<MagnifyingGlassIcon size={32} />} value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="chiffreDiv">
                    <Nbre image={<MusicNoteIcon />} name="Morceaux" number={pieces.length} numberMonthly="3" link="/piece" color="green" />
                    <Nbre image={<UsersIcon />} name="Ensemble" number={ensembles.length} numberMonthly="null" link="/ensembles" color="orange" />
                    <Nbre image={<FileTextIcon />} name="Documents" number={nbreDocuments} numberMonthly="null" link="/piece" color="purple" />
                    {/* <Nbre image={} name="Commentaires" number="12" numberMonthly="null" link="/piece" color="blue" /> */}
                </div>
                <div className="bottom">
                    <div className="morceauxRecents">
                        <div className="mrTexte">
                            <p>Morceaux Récents</p>
                            <Link to="/piece">Voir tout</Link>
                        </div>
                        <hr />
                        {lastPieces.map((piece) => (
                            <Morceau key={`${piece.id}`} {...piece} />
                        ))}
                    </div>
                    <div className="mesEnsembles">
                        <div className="mrTexte">
                            <p>Mes Ensembles</p>
                            <Link to="/ensembles">Voir tout</Link>
                        </div>
                        <hr />
                        {ensembles.slice(0, 4).map((ensemble) => (
                            <div key={ensemble.id}>
                                <Ensemble
                                    name={ensemble.name}
                                    title={ensemble.type}
                                    color={ensemble.color ?? "green"}
                                />
                                <hr />
                            </div>
                        ))}
                        <MenuDashboard />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
