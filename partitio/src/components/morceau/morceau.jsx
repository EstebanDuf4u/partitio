import "./morceau.scss";

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
                <img src="/dots.svg" alt="dots" />
            </div>
        </div>
    )
}

export default Morceau;