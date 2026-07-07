import MenuPiece from "../menuPiece/menuPiece";
import "./card.scss"

function Card({ coverSrc, title, author, voices, modifDate }) {
    return (
        <div className="card">
            <div className="imgText">
                <img src={coverSrc} alt={title} />
                <div className="songName">
                    <p id="title">{title}</p>
                    <p>{author}</p>
                </div>
            </div>
            <div className="typeVoice">
                {voices.length == 4 ? <span className="voice tout">TOUT</span> : voices.map((voice) => (
                    <span key={voice} className={`voice ${voice.toLowerCase()} ${voices.length === 1 ? "full" : ""} ${voices.length === 2 ? "haut" : ""}`}>
                        {voice.toUpperCase()}
                    </span>
                ))}
            </div>
            <hr />
            <div className="date">
                <p>Modifié le {modifDate}</p>
                <MenuPiece />
            </div>
        </div>

    )
}

export default Card;