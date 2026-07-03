import "./ensemble.scss"
function Ensemble({name, title, path, color}) {
    return (
        <div className="ensemble">
            <div className={`ensembleImage ${color}`}>
                {path == "null" ? <img src="/image-missing.svg" alt={name} /> : <img src={path} alt={name} />}
            </div>
            <div className="ensembleTexte">
                <p id="ensembleName">{name}</p>
                <p>{title}</p>
            </div>
        </div>
    )
}

export default Ensemble;