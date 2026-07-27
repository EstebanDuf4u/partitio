import MenuPiece from "../menuPiece/menuPiece";
import Voice from "../voice/voice";
import "./card.scss"

function Card({ coverSrc, title, artist, voices, modifDate }) {
    return (
        <div className="card">
            <div className="imgText">
                <img src={coverSrc} alt={title} />
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
                <p>Modifié le {modifDate}</p>
                <MenuPiece />
            </div>
        </div>

    )
}

export default Card;