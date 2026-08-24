import { useEffect, useState } from "react";
import "./morceau.scss";
import { DotsThreeIcon } from "@phosphor-icons/react";

function Morceau({ coverUrl, title, artist, documentDto }) {
    const [lastDate, setLastDate] = useState(null);
    const API_LINK = "http://localhost:3000";

    useEffect(() => {
        let latest = null;
        documentDto.forEach(element => {
            const currentDate = new Date(element.dateModified);

            if (latest === null || currentDate > latest) {
                latest = currentDate;
            }
        });
        setLastDate(latest);
    }, [documentDto]);

    return (
        <div className="morceau">
            <div className="gauche">
                <img src={API_LINK+coverUrl} alt="cover" />
                <div className="morceauTitre">
                    <p id="title">{title}</p>
                    <p>{artist}</p>
                </div>
            </div>
            <div className="droite">
                <p>Ajouté le : {lastDate ? lastDate.toLocaleDateString("fr-FR") : ""}</p>
            </div>
        </div>
    )
}

export default Morceau;