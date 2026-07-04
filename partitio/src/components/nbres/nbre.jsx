import "./nbre.scss"

function Nbre({path, name, number, numberMonthly, link, color}) {
    return (
        <div className="nbreDiv">
            <div className={`image ${color}`}>
                <img src={path} alt={name} />
            </div>
            <div className="text">
                <p className="nombre">{number}</p>
                <p className="title">{name}</p>
                {numberMonthly != "null" ? (<a href={link}>+{numberMonthly} ce mois ci</a>) : (<a href={link}>Voir tout</a>)}
            </div>
        </div>
    )
}

export default Nbre;