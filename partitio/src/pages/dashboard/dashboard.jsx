import "./dashboard.scss";
import LeftPanel from "../../components/leftPanel/leftPanel";
import Nbre from "../../components/nbres/nbre";
import Morceau from "../../components/morceau/morceau";
import Ensemble from "../../components/ensemble/ensemble";

function Dashboard() {
    return (
        <div className="all">
            <LeftPanel />
            <div className="panneauDroite">
                <div className="top">
                    <div className="texte">
                        <p className="textePrenom">Bonjour Prenom!</p>
                        <p>Voici un aperçu de votre activité.</p>
                    </div>
                    <div className="recherche">
                        <input type="text" placeholder="Rechercher un morceau, un ensemble..."/>
                        <img src="/bell.svg" alt="bell" />
                    </div>
                </div>
                <div className="chiffreDiv">
                    <Nbre path="/music.svg" name="Morceaux" number="28" numberMonthly="3" link="/#" color="green"/>
                    <Nbre path="/group.svg" name="Ensemble" number="4" numberMonthly="null" link="/#" color="orange"/>
                    <Nbre path="/doc.svg" name="Documents" number="156" numberMonthly="null" link="/#" color="purple"/>
                    <Nbre path="/chat.svg" name="Commentaires" number="12" numberMonthly="null" link="/#" color="blue"/>
                </div>
                <div className="bottom">
                    <div className="morceauxRecents">
                        <div className="mrTexte">
                            <p>Morceaux Récents</p>
                            <a href="#">Voir tout</a>
                        </div>
                        <hr />
                        <Morceau title="Hallelujah" author="Leonard Cohen" path="/hallelujah-cover.jpg" modifDate="02/07/2026"/>
                        <Morceau title="Hallelujah" author="Leonard Cohen" path="/hallelujah-cover.jpg" modifDate="02/07/2026"/>
                        <Morceau title="Hallelujah" author="Leonard Cohen" path="/hallelujah-cover.jpg" modifDate="02/07/2026"/>
                        <Morceau title="Hallelujah" author="Leonard Cohen" path="/hallelujah-cover.jpg" modifDate="02/07/2026"/>
                        <Morceau title="Hallelujah" author="Leonard Cohen" path="/hallelujah-cover.jpg" modifDate="02/07/2026"/>
                    </div>
                    <div className="mesEnsembles">
                        <div className="mrTexte">
                            <p>Mes Ensembles</p>
                            <a href="#">Voir tout</a>
                        </div>
                        <hr />
                        <Ensemble name="Nom de l'ensemble" title="Titre de l'ensemble" path="null" color="green"/>
                        <hr />
                        <Ensemble name="Nom de l'ensemble" title="Titre de l'ensemble" path="null" color="orange"/>
                        <hr />
                        <Ensemble name="Nom de l'ensemble" title="Titre de l'ensemble" path="null" color="purple"/>
                        <hr />
                        <Ensemble name="Nom de l'ensemble" title="Titre de l'ensemble" path="null" color="blue"/>
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
