import "./dashboard.scss";

import LeftPanel from "../../components/leftPanel/leftPanel";
import Nbre from "../../components/nbres/nbre";
import Morceau from "../../components/morceau/morceau";
import Ensemble from "../../components/ensemble/ensemble";
import MenuDashboard from "../../components/menuDashboard/menuDashboard";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Input } from '@mantine/core';
import { MagnifyingGlassIcon, MusicNoteIcon, UsersIcon, FileTextIcon, PlusIcon } from '@phosphor-icons/react';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function loadUser() {
            try {
                const response = await fetch("/api/me", {
                    credentials: "same-origin",
                });

                if (!response.ok) {
                    navigate("/login", { replace: true });
                    return;
                }

                const data = await response.json();
                setUser(data.user);
            } catch {
                navigate("/login", { replace: true });
            } finally {
                setIsLoading(false);
            }
        }

        loadUser();
    }, [navigate]);

    useEffect(() => {
        console.log(search);
    }, [search]);

    if (isLoading) {
        return null;
    }

    if (!user) {
        return null;
    }

    const morceaux = [
        { title: "Hallelujah", author: "Leonard Cohen", path: "/cover/hallelujah.jpg", modifDate: "02/07/2026" },
        { title: "Hier Encore", author: "Charles Aznavour", path: "/cover/hier-encore.jpg", modifDate: "02/07/2026" },
        { title: "I'm Done", author: "Rutra", path: "/cover/im-done.jpg", modifDate: "02/07/2026" },
        { title: "Freestyle du sale", author: "Lorenzo", path: "/cover/freestyle-du-sale.jpg", modifDate: "02/07/2026" },
        { title: "Parisienne", author: "Gims", path: "/cover/parisienne.jpg", modifDate: "02/07/2026" }
    ];

    return (
        <div className="all">
            <LeftPanel />
            <div className="panneauDroite">
                <div className="top">
                    <div className="texte">
                        <p className="textePrenom">Bonjour {user.firstName} {user.lastName}!</p>
                        <p>Voici un aperçu de votre activité.</p>
                    </div>
                    <div className="recherche">
                        <Input className="searchInput" placeholder="Rechercher un morceau, un ensemble..." leftSection={<MagnifyingGlassIcon size={32} />} value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="chiffreDiv">
                    <Nbre image={<MusicNoteIcon />} name="Morceaux" number="28" numberMonthly="3" link="/piece" color="green" />
                    <Nbre image={<UsersIcon />} name="Ensemble" number="4" numberMonthly="null" link="/piece" color="orange" />
                    <Nbre image={<FileTextIcon />} name="Documents" number="156" numberMonthly="null" link="/piece" color="purple" />
                    {/* <Nbre image={} name="Commentaires" number="12" numberMonthly="null" link="/piece" color="blue" /> */}
                </div>
                <div className="bottom">
                    <div className="morceauxRecents">
                        <div className="mrTexte">
                            <p>Morceaux Récents</p>
                            <Link to="/piece">Voir tout</Link>
                        </div>
                        <hr />
                        {morceaux.map((morceau) => (
                            <Morceau key={`${morceau.title}-${morceau.author}`} {...morceau} />
                        ))}
                    </div>
                    <div className="mesEnsembles">
                        <div className="mrTexte">
                            <p>Mes Ensembles</p>
                            <Link to="#">Voir tout</Link>
                        </div>
                        <hr />
                        <Ensemble name="Nom de l'ensemble" title="Titre de l'ensemble" path="null" color="green" />
                        <hr />
                        <Ensemble name="Nom de l'ensemble" title="Titre de l'ensemble" path="null" color="orange" />
                        <hr />
                        <Ensemble name="Nom de l'ensemble" title="Titre de l'ensemble" path="null" color="purple" />
                        <hr />
                        <Ensemble name="Nom de l'ensemble" title="Titre de l'ensemble" path="null" color="blue" />
                        <hr />
                        <MenuDashboard />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
