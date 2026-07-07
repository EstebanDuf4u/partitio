import "./leftPanel.scss"

import Button from "../button/button";
import { NavLink } from "react-router-dom";
import { HouseIcon, MusicNoteIcon, UsersIcon, FileTextIcon, UserListIcon, UserPlusIcon } from "@phosphor-icons/react";

function LeftPanel() {
    return (
        <div className="panneauGauche">
            <div className="group">
                <NavLink className="texteLogo" to="/dashboard">
                    <div className="logo">
                        <img src="/logo.png" alt="logoPartitio" />
                        <p>Partitio</p>
                    </div>
                    <p>Gérer vos partitions en toute harmonie</p>
                </NavLink>
                <div className="btnDiv">
                    <Button name="Tableau de bord" image={<HouseIcon />} path="/dashboard"/>
                    <Button name="Morceaux" image={<MusicNoteIcon />} path="/piece"/>
                    <Button name="Documents" image={<FileTextIcon />} path="/piece"/>
                    <Button name="Ensembles" image={<UsersIcon />} path="/piece"/>
                </div>
                <div className="texteAdminDiv">
                    <div className="texteAdmin">
                        <p>Administration</p>
                    </div>
                    <div className="divider"></div>
                </div>
                <div className="btnDiv">
                    <Button name="Utilisateurs" image={<UserListIcon />} path="/piece"/>
                    <Button name="Rôles" image={<UserPlusIcon  />} path="/piece"/>
                </div>
            </div>
            <NavLink to="/piece" className="btnProfil">
                <img src="/avatar.svg" alt="avatar" />
                <div className="profilText">
                    <p className="prenomNom">Prenom Nom</p>
                    <p className="typeVoix">Type de voix</p>
                </div>
            </NavLink>
        </div>
    )
}

export default LeftPanel;
