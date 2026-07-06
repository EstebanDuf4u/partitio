import "./dashboard.scss";

import LeftPanel from "../../components/leftPanel/leftPanel";
import Nbre from "../../components/nbres/nbre";
import Morceau from "../../components/morceau/morceau";
import Ensemble from "../../components/ensemble/ensemble";

import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
    const [search, setSearch] = useState("");

    const morceaux = [
        <Morceau title="Hallelujah" author="Leonard Cohen" path="/hallelujah-cover.jpg" modifDate="02/07/2026" />,
        <Morceau title="Hier Encore" author="Charles Aznavour" path="/hallelujah-cover.jpg" modifDate="02/07/2026" />,
        <Morceau title="I'm Done" author="Rutra" path="/hallelujah-cover.jpg" modifDate="02/07/2026" />,
        <Morceau title="Freestyle du sale" author="Lorenzo" path="/hallelujah-cover.jpg" modifDate="02/07/2026" />,
        <Morceau title="Parisienne" author="Gims" path="/hallelujah-cover.jpg" modifDate="02/07/2026" />
    ];

    useEffect(() => {
        console.log(search);

    }, [search]);

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
                        <input type="text" placeholder="Rechercher un morceau, un ensemble..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <img src="/bell.svg" alt="bell" />
                    </div>
                </div>
                <div className="chiffreDiv">
                    <Nbre path="/music.svg" name="Morceaux" number="28" numberMonthly="3" link="/piece" color="green" />
                    <Nbre path="/group.svg" name="Ensemble" number="4" numberMonthly="null" link="/piece" color="orange" />
                    <Nbre path="/doc.svg" name="Documents" number="156" numberMonthly="null" link="/piece" color="purple" />
                    <Nbre path="/chat.svg" name="Commentaires" number="12" numberMonthly="null" link="/piece" color="blue" />
                </div>
                <div className="bottom">
                    <div className="morceauxRecents">
                        <div className="mrTexte">
                            <p>Morceaux Récents</p>
                            <Link to="/piece">Voir tout</Link>
                        </div>
                        <hr />
                        {morceaux.map((morceau) => (
                            <p key={morceau}>{morceau}</p>
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
                        <div className="boutonBottom">
                            <img src="/plus.svg" alt="" />
                            <div className="boutonTexte">
                                <p>Rejoindre ou créer</p>
                                <p>un ensemble</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
