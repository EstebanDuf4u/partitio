import { Link } from "react-router-dom";
import "./nbre.scss"

function Nbre({image, name, number, numberMonthly, link, color}) {
    return (
        <div className="nbreDiv">
            <div className={`image ${color}`}>
                {image}
            </div>
            <div className="text">
                <p className="nombre">{number}</p>
                <p className="title">{name}</p>
                {numberMonthly != "null" ? (<Link to={link}>+{numberMonthly} ce mois ci</Link>) : (<Link to={link}>Voir tout</Link>)}
            </div>
        </div>
    )
}

export default Nbre;