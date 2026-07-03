import "./button.scss"

function Button({name, imageSrc}) {
    return (
        <div className="btn">
            <img src={imageSrc} alt={name} />
            <p>{name}</p>
        </div>
    )
}

export default Button;