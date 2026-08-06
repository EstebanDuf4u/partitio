import "./ensemble.scss"
import { ImageBrokenIcon } from '@phosphor-icons/react';

function Ensemble({ name, title, path, color }) {
    const hasImage = Boolean(path);

    return (
        <div className="ensemble">
            <div className={`ensembleImage ${color}`}>
                {hasImage ? <img src={path} alt={name} /> : <ImageBrokenIcon />}
            </div>
            <div className="ensembleTexte">
                <p id="ensembleName">{name}</p>
                <p>{title}</p>
            </div>
        </div>
    )
}

export default Ensemble;
