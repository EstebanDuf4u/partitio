import "./morceau.scss";
import { DotsThreeIcon } from "@phosphor-icons/react";

function Morceau({title, author, path, modifDate}) {
    return (
        <div className="morceau">
            <div className="gauche">
                <img src={path} alt="cover" />
                <div className="morceauTitre">
                    <p id="title">{title}</p>
                    <p>{author}</p>
                </div>
            </div>
            <div className="droite">
                <p>Modifié le {modifDate}</p>
            </div>
        </div>
    )
}

export default Morceau;