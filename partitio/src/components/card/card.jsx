import { useEffect, useState } from "react";
import MenuPiece from "../menuPiece/menuPiece";
import Voice from "../voice/voice";
import "./card.scss"

function Card({ coverUrl, title, artist, voices, documentDto }) {
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
        <div className="card">
            <div className="imgText">
                <img src={API_LINK+coverUrl} alt={title} />
                <div className="songName">
                    <p id="title">{title}</p>
                    <p>{artist}</p>
                </div>
            </div>
            {/* <div className="typeVoice">
                {voices.length == 4 ? <span className="voice tout">TOUT</span> : voices.map((voice) => (
                    <Voice voice={voice} nbreVoice={voices.length}/>
                ))}
            </div> */}
            <hr />
            <div className="date">
                <p>Modifié le {lastDate ? lastDate.toLocaleDateString("fr-FR") : ""}</p>
                <MenuPiece />
            </div>
        </div>

    )
}

export default Card;