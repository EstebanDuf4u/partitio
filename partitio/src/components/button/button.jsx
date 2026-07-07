import "./button.scss"

import { NavLink } from "react-router-dom";

function Button({name, imageSrc, path, image}) {
    return (
        <NavLink to={path} className={({isActive}) => isActive ? "btn active" : "btn"}>
            <div className="btn">
                {image}
                <p>{name}</p>
            </div>
        </NavLink>
    )
}

export default Button;