import "./joinCreateButton.scss";
import { PlusIcon } from '@phosphor-icons/react';

function JoinCreateButton({ ref, ...others }) {
    return (
        <div className="joinCreateButton">
            <div ref={ref} {...others} className="boutonBottom">
                <PlusIcon />
                <div className="boutonTexte">
                    <p>Rejoindre ou créer</p>
                    <p>un ensemble</p>
                </div>
            </div>
        </div>
    )
}

export default JoinCreateButton;