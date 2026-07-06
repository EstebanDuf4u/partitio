import "./button.scss"

import { NavLink } from "react-router-dom";

function Button({name, imageSrc, path}) {
    return (
        <NavLink to={path} className={({isActive}) => isActive ? "btn active" : "btn"}>
            <div className="btn">
                <img src={imageSrc} alt={name} />
                <p>{name}</p>
            </div>
        </NavLink>
    )
}

export default Button;